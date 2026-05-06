import uuid
from datetime import date, datetime, timezone
from typing import Optional

from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.attendance import Attendance, AttendanceStatus
from app.models.user import User


class AttendanceRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_today(self, employee_id: uuid.UUID) -> Optional[Attendance]:
        today = datetime.now(timezone.utc).date()
        result = await self.db.execute(
            select(Attendance).where(
                and_(
                    Attendance.employee_id == employee_id,
                    Attendance.attendance_date == today,
                )
            )
        )
        return result.scalar_one_or_none()

    async def get_by_id(self, attendance_id: uuid.UUID) -> Optional[Attendance]:
        result = await self.db.execute(
            select(Attendance).where(Attendance.id == attendance_id)
        )
        return result.scalar_one_or_none()

    async def get_by_date(
        self, employee_id: uuid.UUID, target_date: date
    ) -> Optional[Attendance]:
        result = await self.db.execute(
            select(Attendance).where(
                and_(
                    Attendance.employee_id == employee_id,
                    Attendance.attendance_date == target_date,
                )
            )
        )
        return result.scalar_one_or_none()

    async def get_all(
        self,
        skip: int = 0,
        limit: int = 20,
        employee_id: Optional[uuid.UUID] = None,
        date_from: Optional[date] = None,
        date_to: Optional[date] = None,
        status: Optional[AttendanceStatus] = None,
    ) -> tuple[list[Attendance], int]:
        query = select(Attendance)

        if employee_id:
            query = query.where(Attendance.employee_id == employee_id)
        if date_from:
            query = query.where(Attendance.attendance_date >= date_from)
        if date_to:
            query = query.where(Attendance.attendance_date <= date_to)
        if status:
            query = query.where(Attendance.status == status)

        count_result = await self.db.execute(
            select(func.count()).select_from(query.subquery())
        )
        total = count_result.scalar_one()

        result = await self.db.execute(
            query.order_by(Attendance.attendance_date.desc()).offset(skip).limit(limit)
        )
        return list(result.scalars().all()), total

    async def get_by_period(
        self,
        employee_id: uuid.UUID,
        date_from: date,
        date_to: date,
    ) -> list[Attendance]:
        """Dipakai payroll service untuk rekap kehadiran per periode."""
        result = await self.db.execute(
            select(Attendance).where(
                and_(
                    Attendance.employee_id == employee_id,
                    Attendance.attendance_date >= date_from,
                    Attendance.attendance_date <= date_to,
                )
            )
        )
        return list(result.scalars().all())

    async def create(self, data: dict) -> Attendance:
        attendance = Attendance(**data)
        self.db.add(attendance)
        await self.db.flush()
        await self.db.refresh(attendance)
        return attendance

    async def update(self, attendance: Attendance, data: dict) -> Attendance:
        for field, value in data.items():
            if hasattr(attendance, field):
                setattr(attendance, field, value)
        await self.db.flush()
        await self.db.refresh(attendance)
        return attendance