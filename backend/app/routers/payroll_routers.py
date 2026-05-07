import uuid
from typing import Optional

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.database import get_db
from app.core.dependencies import get_current_user, get_hr_or_above, get_super_admin
from app.models.payroll_record import PayrollRecordStatus
from app.schemas.payroll_schemas import (
    PayrollComponentRequest,
    PayrollComponentResponse,
    PayrollPeriodCreateRequest,
    PayrollPeriodResponse,
    PayrollRecordListResponse,
    PayrollRecordResponse,
    PayrollSummaryResponse,
)
from app.services.payroll_services import PayrollService

router = APIRouter(prefix="/payroll", tags=["Payroll"])


# ── Self (Employee) ────────────────────────────────────────────────────────────

@router.get(
    "/me/records",
    response_model=PayrollRecordListResponse,
    summary="Riwayat slip gaji saya",
)
async def get_my_payroll_records(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = PayrollService(db)
    return await service.get_my_records(current_user.id, skip, limit)


@router.get(
    "/me/records/{record_id}",
    response_model=PayrollSummaryResponse,
    summary="Detail slip gaji saya (breakdown tunjangan & potongan)",
)
async def get_my_slip(
    record_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = PayrollService(db)
    return await service.get_my_slip(current_user.id, record_id)


# ── Period (HR/Admin) ──────────────────────────────────────────────────────────

@router.get(
    "/periods",
    response_model=list[PayrollPeriodResponse],
    summary="[HR/Admin] List semua periode payroll",
)
async def list_periods(
    db: AsyncSession = Depends(get_db),
    _=Depends(get_hr_or_above),
):
    service = PayrollService(db)
    return await service.get_all_periods()


@router.post(
    "/periods",
    response_model=PayrollPeriodResponse,
    status_code=status.HTTP_201_CREATED,
    summary="[HR/Admin] Buat periode payroll baru",
)
async def create_period(
    body: PayrollPeriodCreateRequest,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_hr_or_above),
):
    service = PayrollService(db)
    return await service.create_period(body.month, body.year)


@router.get(
    "/periods/{period_id}",
    response_model=PayrollPeriodResponse,
    summary="[HR/Admin] Detail periode payroll",
)
async def get_period(
    period_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_hr_or_above),
):
    service = PayrollService(db)
    return await service.get_period_by_id(period_id)


@router.post(
    "/periods/{period_id}/generate",
    response_model=list[PayrollRecordResponse],
    summary="[HR/Admin] Generate payroll record untuk semua karyawan aktif",
)
async def generate_records(
    period_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_hr_or_above),
):
    """
    Buat PayrollRecord untuk semua karyawan aktif berdasarkan data attendance.
    Idempotent — karyawan yang sudah punya record di-skip.
    Period status berubah: OPEN → PROCESSING.
    """
    service = PayrollService(db)
    return await service.generate_records(period_id, current_user)


@router.post(
    "/periods/{period_id}/finalize",
    response_model=PayrollPeriodResponse,
    summary="[Super Admin] Finalisasi periode payroll",
)
async def finalize_period(
    period_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_super_admin),
):
    """
    Finalisasi: semua record DRAFT → APPROVED, period → FINALIZED.
    Setelah finalized, tidak bisa ubah komponen lagi.
    """
    service = PayrollService(db)
    return await service.finalize_period(period_id, current_user)


# ── Record (HR/Admin) ──────────────────────────────────────────────────────────

@router.get(
    "/records",
    response_model=PayrollRecordListResponse,
    summary="[HR/Admin] List payroll record dengan filter",
)
async def list_records(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    period_id: Optional[uuid.UUID] = Query(None),
    employee_id: Optional[uuid.UUID] = Query(None),
    status: Optional[PayrollRecordStatus] = Query(None),
    db: AsyncSession = Depends(get_db),
    _=Depends(get_hr_or_above),
):
    service = PayrollService(db)
    return await service.get_all_records(skip, limit, period_id, employee_id, status)


@router.get(
    "/records/{record_id}",
    response_model=PayrollRecordResponse,
    summary="[HR/Admin] Detail payroll record",
)
async def get_record(
    record_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_hr_or_above),
):
    service = PayrollService(db)
    return await service.get_record_by_id(record_id)


@router.patch(
    "/records/{record_id}/paid",
    response_model=PayrollRecordResponse,
    summary="[HR/Admin] Mark record sebagai PAID",
)
async def mark_paid(
    record_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_hr_or_above),
):
    service = PayrollService(db)
    return await service.mark_paid(record_id)


# ── Components (HR/Admin) ──────────────────────────────────────────────────────

@router.post(
    "/records/{record_id}/components",
    response_model=PayrollRecordResponse,
    status_code=status.HTTP_201_CREATED,
    summary="[HR/Admin] Tambah komponen tunjangan/potongan ke record",
)
async def add_component(
    record_id: uuid.UUID,
    body: PayrollComponentRequest,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_hr_or_above),
):
    """
    Tambah tunjangan (transport, makan, jabatan) atau potongan (BPJS, kasbon).
    Net salary otomatis dihitung ulang setelah komponen ditambah.
    Hanya bisa dilakukan saat record berstatus DRAFT.
    """
    service = PayrollService(db)
    return await service.add_component(record_id, body.model_dump())


@router.delete(
    "/records/{record_id}/components/{component_id}",
    response_model=PayrollRecordResponse,
    summary="[HR/Admin] Hapus komponen dari record",
)
async def delete_component(
    record_id: uuid.UUID,
    component_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_hr_or_above),
):
    service = PayrollService(db)
    return await service.delete_component(record_id, component_id)