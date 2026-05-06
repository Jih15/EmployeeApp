import uuid
from datetime import date, datetime, timezone
from typing import Optional

from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.leave_request import LeaveRequest, LeaveStatus


class LeaveRequestRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, leave_id: uuid.UUID) -> Optional[LeaveRequest]:
        result = await self.db.execute(
            select(LeaveRequest).where(LeaveRequest.id == leave_id)
        )
        return result.scalar_one_or_none()

    async def get_all(
        self,
        skip: int = 0,
        limit: int = 20,
        employee_id: Optional[uuid.UUID] = None,
        status: Optional[LeaveStatus] = None,
        date_from: Optional[date] = None,
        date_to: Optional[date] = None,
    ) -> tuple[list[LeaveRequest], int]:
        query = select(LeaveRequest)

        if employee_id:
            query = query.where(LeaveRequest.employee_id == employee_id)
        if status:
            query = query.where(LeaveRequest.status == status)
        if date_from:
            query = query.where(LeaveRequest.start_date >= date_from)
        if date_to:
            query = query.where(LeaveRequest.end_date <= date_to)

        count_result = await self.db.execute(
            select(func.count()).select_from(query.subquery())
        )
        total = count_result.scalar_one()

        result = await self.db.execute(
            query.order_by(LeaveRequest.created_at.desc()).offset(skip).limit(limit)
        )
        return list(result.scalars().all()), total

    async def count_approved_days(
        self,
        employee_id: uuid.UUID,
        leave_type_id: uuid.UUID,
        year: int,
    ) -> int:
        """Hitung total hari cuti yang sudah approved tahun ini."""
        result = await self.db.execute(
            select(func.sum(LeaveRequest.total_days)).where(
                and_(
                    LeaveRequest.employee_id == employee_id,
                    LeaveRequest.leave_type_id == leave_type_id,
                    LeaveRequest.status == LeaveStatus.APPROVED,
                    func.extract("year", LeaveRequest.start_date) == year,
                )
            )
        )
        return result.scalar_one() or 0

    async def has_overlapping(
        self,
        employee_id: uuid.UUID,
        start_date: date,
        end_date: date,
        exclude_id: Optional[uuid.UUID] = None,
    ) -> bool:
        """Cek overlap dengan pengajuan cuti lain yang masih pending/approved."""
        query = select(LeaveRequest.id).where(
            and_(
                LeaveRequest.employee_id == employee_id,
                LeaveRequest.status.in_([LeaveStatus.PENDING, LeaveStatus.APPROVED]),
                LeaveRequest.start_date <= end_date,
                LeaveRequest.end_date >= start_date,
            )
        )
        if exclude_id:
            query = query.where(LeaveRequest.id != exclude_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none() is not None

    async def create(self, data: dict) -> LeaveRequest:
        leave = LeaveRequest(**data)
        self.db.add(leave)
        await self.db.flush()
        await self.db.refresh(leave)
        return leave

    async def update(self, leave: LeaveRequest, data: dict) -> LeaveRequest:
        for field, value in data.items():
            if hasattr(leave, field):
                setattr(leave, field, value)
        await self.db.flush()
        await self.db.refresh(leave)
        return leave