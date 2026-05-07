import uuid
from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.leave_type import LeaveType


class LeaveTypeRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self, active_only: bool = True) -> list[LeaveType]:
        query = select(LeaveType)
        if active_only:
            query = query.where(LeaveType.is_active == True)  # noqa: E712
        result = await self.db.execute(query.order_by(LeaveType.name))
        return list(result.scalars().all())

    async def get_by_id(self, leave_type_id: uuid.UUID) -> Optional[LeaveType]:
        result = await self.db.execute(
            select(LeaveType).where(LeaveType.id == leave_type_id)
        )
        return result.scalar_one_or_none()

    async def name_exists(
        self, name: str, exclude_id: Optional[uuid.UUID] = None
    ) -> bool:
        query = select(LeaveType.id).where(LeaveType.name == name)
        if exclude_id:
            query = query.where(LeaveType.id != exclude_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none() is not None

    async def create(self, data: dict) -> LeaveType:
        leave_type = LeaveType(**data)
        self.db.add(leave_type)
        await self.db.flush()
        await self.db.refresh(leave_type)
        return leave_type

    async def update(self, leave_type: LeaveType, data: dict) -> LeaveType:
        for field, value in data.items():
            if hasattr(leave_type, field):
                setattr(leave_type, field, value)
        await self.db.flush()
        await self.db.refresh(leave_type)
        return leave_type