"""
PayrollService — alur kerja payroll:

1. HR buat PayrollPeriod (bulan/tahun) → status OPEN
2. HR trigger "generate" → status PROCESSING
   - Looping semua karyawan aktif
   - Rekap attendance dalam periode tsb (present, late, leave, alpha)
   - Snapshot base_salary dari profile saat itu
   - Hitung gross_salary = base_salary (bisa dikembangkan dengan rumus pro-rata)
3. HR tambah/edit komponen (tunjangan/potongan) per record secara manual
4. HR finalize → status FINALIZED, record berubah ke APPROVED
5. HR mark paid → record berubah ke PAID

Kalkulasi gaji sengaja sederhana untuk MVP.
Formula pro-rata (alpha deduction, overtime, dll) bisa ditambah di step 2.
"""
import calendar
import uuid
from datetime import date, datetime, timezone
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import (
    BadRequestException,
    ConflictException,
    ForbiddenException,
    NotFoundException,
)
from app.models.attendance import AttendanceStatus
from app.models.payroll_period import PayrollPeriod, PayrollPeriodStatus
from app.models.payroll_record import PayrollRecord, PayrollRecordStatus
from app.models.user import User
from app.repositories.attendance_repository import AttendanceRepository
from app.repositories.employee_repository import EmployeeRepository
from app.repositories.payroll_repository import (
    PayrollComponentRepository,
    PayrollPeriodRepository,
    PayrollRecordRepository,
)
from app.repositories.user_repository import UserRepository


class PayrollService:
    def __init__(self, db: AsyncSession):
        self.period_repo = PayrollPeriodRepository(db)
        self.record_repo = PayrollRecordRepository(db)
        self.component_repo = PayrollComponentRepository(db)
        self.attendance_repo = AttendanceRepository(db)
        self.employee_repo = EmployeeRepository(db)
        self.user_repo = UserRepository(db)

    # ── Period ─────────────────────────────────────────────────────────────────

    async def get_all_periods(self) -> list[PayrollPeriod]:
        return await self.period_repo.get_all()

    async def get_period_by_id(self, period_id: uuid.UUID) -> PayrollPeriod:
        period = await self.period_repo.get_by_id(period_id)
        if not period:
            raise NotFoundException("Periode payroll")
        return period

    async def create_period(self, month: int, year: int) -> PayrollPeriod:
        # Cek duplikat
        existing = await self.period_repo.get_by_month_year(month, year)
        if existing:
            raise ConflictException(
                f"Periode payroll {month}/{year} sudah ada."
            )

        # Hitung start_date dan end_date otomatis
        _, last_day = calendar.monthrange(year, month)
        start_date = date(year, month, 1)
        end_date = date(year, month, last_day)

        return await self.period_repo.create({
            "month": month,
            "year": year,
            "start_date": start_date,
            "end_date": end_date,
            "status": PayrollPeriodStatus.OPEN,
        })

    async def generate_records(
        self, period_id: uuid.UUID, actor: User
    ) -> list[PayrollRecord]:
        """
        Generate PayrollRecord untuk semua karyawan aktif dalam periode.
        Hanya bisa dipanggil saat periode OPEN.
        Idempotent: karyawan yang sudah punya record di-skip.
        """
        period = await self._get_period_or_404(period_id)

        if period.status != PayrollPeriodStatus.OPEN:
            raise BadRequestException(
                error_code="PERIOD_NOT_OPEN",
                message="Generate hanya bisa dilakukan saat periode berstatus OPEN.",
            )

        # Ubah status ke PROCESSING
        await self.period_repo.update(period, {"status": PayrollPeriodStatus.PROCESSING})

        # Ambil semua karyawan aktif dengan profile
        users, _ = await self.employee_repo.get_all_with_profile(
            skip=0, limit=9999, is_active=True
        )

        generated = []
        for user in users:
            # Skip jika sudah ada record
            existing = await self.record_repo.get_by_employee_period(user.id, period_id)
            if existing:
                generated.append(existing)
                continue

            profile = user.profile
            if not profile:
                continue  # Skip user tanpa profile

            # Rekap attendance periode ini
            attendances = await self.attendance_repo.get_by_period(
                user.id, period.start_date, period.end_date
            )

            # Hitung total hari kerja periode (hari kalender - weekend, sederhana untuk MVP)
            working_days = self._count_working_days(period.start_date, period.end_date)

            present_days = sum(
                1 for a in attendances
                if a.status in (AttendanceStatus.PRESENT, AttendanceStatus.LATE)
            )
            leave_days = sum(1 for a in attendances if a.status == AttendanceStatus.LEAVE)
            alpha_days = working_days - present_days - leave_days
            alpha_days = max(alpha_days, 0)

            base_salary = float(profile.base_salary or 0)

            # Gross = base_salary (MVP — bisa dikembangkan dengan pro-rata alpha)
            # Contoh deduction alpha: base_salary / working_days * alpha_days
            alpha_deduction = (
                (base_salary / working_days * alpha_days) if working_days > 0 else 0
            )
            gross_salary = base_salary - alpha_deduction

            record = await self.record_repo.create({
                "employee_id": user.id,
                "period_id": period_id,
                "base_salary": base_salary,
                "working_days": working_days,
                "present_days": present_days,
                "leave_days": leave_days,
                "alpha_days": alpha_days,
                "gross_salary": round(gross_salary, 2),
                "total_allowances": 0,
                "total_deductions": round(alpha_deduction, 2),
                "net_salary": round(gross_salary, 2),
                "status": PayrollRecordStatus.DRAFT,
            })
            generated.append(record)

        return generated

    async def finalize_period(
        self, period_id: uuid.UUID, actor: User
    ) -> PayrollPeriod:
        """
        Finalize periode:
        - Semua record DRAFT → APPROVED
        - Period status → FINALIZED
        """
        period = await self._get_period_or_404(period_id)

        if period.status != PayrollPeriodStatus.PROCESSING:
            raise BadRequestException(
                error_code="PERIOD_NOT_PROCESSING",
                message="Finalisasi hanya bisa dilakukan saat periode berstatus PROCESSING.",
            )

        # Approve semua record DRAFT dalam periode ini
        records, _ = await self.record_repo.get_all(period_id=period_id)
        for record in records:
            if record.status == PayrollRecordStatus.DRAFT:
                await self.record_repo.update(
                    record, {"status": PayrollRecordStatus.APPROVED}
                )

        return await self.period_repo.update(period, {
            "status": PayrollPeriodStatus.FINALIZED,
            "finalized_at": datetime.now(timezone.utc),
            "finalized_by": actor.id,
        })

    # ── Record ─────────────────────────────────────────────────────────────────

    async def get_all_records(
        self,
        skip: int,
        limit: int,
        period_id: Optional[uuid.UUID] = None,
        employee_id: Optional[uuid.UUID] = None,
        status: Optional[PayrollRecordStatus] = None,
    ) -> dict:
        records, total = await self.record_repo.get_all(
            skip, limit, period_id, employee_id, status
        )
        return {"data": records, "total": total, "skip": skip, "limit": limit}

    async def get_record_by_id(self, record_id: uuid.UUID) -> PayrollRecord:
        record = await self.record_repo.get_by_id(record_id)
        if not record:
            raise NotFoundException("Payroll record")
        return record

    async def get_my_records(
        self, employee_id: uuid.UUID, skip: int, limit: int
    ) -> dict:
        records, total = await self.record_repo.get_my_records(employee_id, skip, limit)
        return {"data": records, "total": total, "skip": skip, "limit": limit}

    async def get_my_slip(
        self, employee_id: uuid.UUID, record_id: uuid.UUID
    ) -> dict:
        """Slip gaji detail — employee hanya bisa lihat punyanya sendiri."""
        record = await self.record_repo.get_by_id(record_id)
        if not record:
            raise NotFoundException("Payroll record")
        if record.employee_id != employee_id:
            raise ForbiddenException()

        period = await self.period_repo.get_by_id(record.period_id)
        allowances = [c for c in record.components if c.type.value == "allowance"]
        deductions = [c for c in record.components if c.type.value == "deduction"]

        return {
            "record": record,
            "allowances": allowances,
            "deductions": deductions,
            "period": period,
        }

    async def mark_paid(self, record_id: uuid.UUID) -> PayrollRecord:
        record = await self.record_repo.get_by_id(record_id)
        if not record:
            raise NotFoundException("Payroll record")

        if record.status != PayrollRecordStatus.APPROVED:
            raise BadRequestException(
                error_code="RECORD_NOT_APPROVED",
                message="Hanya record berstatus APPROVED yang bisa di-mark paid.",
            )

        return await self.record_repo.update(record, {
            "status": PayrollRecordStatus.PAID,
            "paid_at": datetime.now(timezone.utc),
        })

    # ── Component ──────────────────────────────────────────────────────────────

    async def add_component(
        self, record_id: uuid.UUID, data: dict
    ) -> PayrollRecord:
        record = await self.record_repo.get_by_id(record_id)
        if not record:
            raise NotFoundException("Payroll record")

        if record.status != PayrollRecordStatus.DRAFT:
            raise BadRequestException(
                error_code="RECORD_NOT_DRAFT",
                message="Komponen hanya bisa diubah saat record berstatus DRAFT.",
            )

        await self.component_repo.create({
            "payroll_record_id": record_id,
            **data,
        })

        # Recalculate totals
        return await self._recalculate(record)

    async def delete_component(
        self, record_id: uuid.UUID, component_id: uuid.UUID
    ) -> PayrollRecord:
        record = await self.record_repo.get_by_id(record_id)
        if not record:
            raise NotFoundException("Payroll record")

        if record.status != PayrollRecordStatus.DRAFT:
            raise BadRequestException(
                error_code="RECORD_NOT_DRAFT",
                message="Komponen hanya bisa diubah saat record berstatus DRAFT.",
            )

        component = await self.component_repo.get_by_id(component_id)
        if not component or component.payroll_record_id != record_id:
            raise NotFoundException("Komponen payroll")

        await self.component_repo.delete(component)
        return await self._recalculate(record)

    # ── Private Helpers ────────────────────────────────────────────────────────

    async def _recalculate(self, record: PayrollRecord) -> PayrollRecord:
        """
        Hitung ulang total_allowances, total_deductions, net_salary
        setelah ada perubahan komponen.
        """
        # Reload dengan components terbaru
        record = await self.record_repo.get_by_id(record.id)

        total_allowances = sum(
            float(c.amount) for c in record.components if c.type.value == "allowance"
        )
        total_deductions = sum(
            float(c.amount) for c in record.components if c.type.value == "deduction"
        )
        net_salary = float(record.gross_salary) + total_allowances - total_deductions

        return await self.record_repo.update(record, {
            "total_allowances": round(total_allowances, 2),
            "total_deductions": round(total_deductions, 2),
            "net_salary": round(net_salary, 2),
        })

    def _count_working_days(self, start: date, end: date) -> int:
        """Hitung hari kerja (Senin-Jumat) dalam rentang tanggal."""
        count = 0
        current = start
        while current <= end:
            if current.weekday() < 5:  # 0=Mon, 4=Fri
                count += 1
            from datetime import timedelta
            current += timedelta(days=1)
        return count

    async def _get_period_or_404(self, period_id: uuid.UUID) -> PayrollPeriod:
        period = await self.period_repo.get_by_id(period_id)
        if not period:
            raise NotFoundException("Periode payroll")
        return period