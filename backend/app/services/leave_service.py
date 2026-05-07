import uuid
from datetime import datetime, timezone
from typing import Optional

from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import (
    BadRequestException,
    ConflictException,
    ForbiddenException,
    NotFoundException,
)
from app.core.file_handler import delete_file, save_upload_file
from app.models.leave_request import LeaveRequest, LeaveStatus
from app.models.leave_type import LeaveType
from app.models.user import User, UserRole
from app.repositories.leave_request_repository import LeaveRequestRepository
from app.repositories.leave_type_repository import LeaveTypeRepository


# ── Leave Type ─────────────────────────────────────────────────────────────────

class LeaveTypeService:
    def __init__(self, db: AsyncSession):
        self.repo = LeaveTypeRepository(db)

    async def get_all(self, active_only: bool = True) -> list[LeaveType]:
        return await self.repo.get_all(active_only)

    async def get_by_id(self, leave_type_id: uuid.UUID) -> LeaveType:
        lt = await self.repo.get_by_id(leave_type_id)
        if not lt:
            raise NotFoundException("Jenis cuti")
        return lt

    async def create(self, data: dict) -> LeaveType:
        if await self.repo.name_exists(data["name"]):
            raise ConflictException(f"Jenis cuti '{data['name']}' sudah ada.")
        return await self.repo.create(data)

    async def update(self, leave_type_id: uuid.UUID, data: dict) -> LeaveType:
        lt = await self.repo.get_by_id(leave_type_id)
        if not lt:
            raise NotFoundException("Jenis cuti")

        new_name = data.get("name")
        if new_name and await self.repo.name_exists(new_name, exclude_id=leave_type_id):
            raise ConflictException(f"Jenis cuti '{new_name}' sudah ada.")

        return await self.repo.update(lt, data)


# ── Leave Request ──────────────────────────────────────────────────────────────

class LeaveRequestService:
    def __init__(self, db: AsyncSession):
        self.repo = LeaveRequestRepository(db)
        self.type_repo = LeaveTypeRepository(db)

    async def create(
        self,
        employee_id: uuid.UUID,
        data: dict,
        document: Optional[UploadFile] = None,
    ) -> LeaveRequest:
        leave_type = await self.type_repo.get_by_id(data["leave_type_id"])
        if not leave_type or not leave_type.is_active:
            raise NotFoundException("Jenis cuti")

        start_date = data["start_date"]
        end_date = data["end_date"]
        total_days = (end_date - start_date).days + 1

        year = start_date.year
        used_days = await self.repo.count_approved_days(
            employee_id, leave_type.id, year
        )
        if used_days + total_days > leave_type.max_days_per_year:
            remaining = leave_type.max_days_per_year - used_days
            raise BadRequestException(
                error_code="QUOTA_EXCEEDED",
                message=(
                    f"Kuota cuti '{leave_type.name}' tidak mencukupi. "
                    f"Sisa: {remaining} hari, diminta: {total_days} hari."
                ),
            )

        if await self.repo.has_overlapping(employee_id, start_date, end_date):
            raise ConflictException(
                "Terdapat pengajuan cuti yang overlap dengan tanggal yang dipilih."
            )

        document_path = None
        if leave_type.requires_document:
            if not document:
                raise BadRequestException(
                    error_code="DOCUMENT_REQUIRED",
                    message=f"Jenis cuti '{leave_type.name}' memerlukan dokumen pendukung.",
                )
            document_path, _ = await save_upload_file(document, subdirectory="leave_docs")

        try:
            return await self.repo.create({
                "employee_id": employee_id,
                "leave_type_id": leave_type.id,
                "start_date": start_date,
                "end_date": end_date,
                "total_days": total_days,
                "reason": data.get("reason"),
                "document_path": document_path,
                "status": LeaveStatus.PENDING,
            })
        except Exception:
            if document_path:
                delete_file(document_path)
            raise

    async def cancel(self, leave_id: uuid.UUID, current_user: User) -> LeaveRequest:
        leave = await self._get_or_404(leave_id)

        if current_user.role == UserRole.EMPLOYEE and leave.employee_id != current_user.id:
            raise ForbiddenException()

        if leave.status != LeaveStatus.PENDING:
            raise BadRequestException(
                error_code="CANNOT_CANCEL",
                message="Hanya pengajuan berstatus pending yang bisa dibatalkan.",
            )

        return await self.repo.update(leave, {"status": LeaveStatus.CANCELLED})

    async def review(
        self,
        leave_id: uuid.UUID,
        reviewer: User,
        status: LeaveStatus,
        review_notes: Optional[str],
    ) -> LeaveRequest:
        leave = await self._get_or_404(leave_id)

        if leave.status != LeaveStatus.PENDING:
            raise BadRequestException(
                error_code="ALREADY_REVIEWED",
                message="Pengajuan sudah diproses sebelumnya.",
            )

        return await self.repo.update(leave, {
            "status": status,
            "reviewed_by": reviewer.id,
            "reviewed_at": datetime.now(timezone.utc),
            "review_notes": review_notes,
        })

    async def get_all(
        self,
        skip: int,
        limit: int,
        employee_id=None,
        status=None,
        date_from=None,
        date_to=None,
    ) -> dict:
        records, total = await self.repo.get_all(
            skip, limit, employee_id, status, date_from, date_to
        )
        return {"data": records, "total": total, "skip": skip, "limit": limit}

    async def get_my_requests(
        self,
        employee_id: uuid.UUID,
        skip: int,
        limit: int,
        status=None,
    ) -> dict:
        records, total = await self.repo.get_all(
            skip, limit, employee_id=employee_id, status=status
        )
        return {"data": records, "total": total, "skip": skip, "limit": limit}

    async def get_by_id(self, leave_id: uuid.UUID) -> LeaveRequest:
        return await self._get_or_404(leave_id)

    async def _get_or_404(self, leave_id: uuid.UUID) -> LeaveRequest:
        leave = await self.repo.get_by_id(leave_id)
        if not leave:
            raise NotFoundException("Pengajuan cuti")
        return leave