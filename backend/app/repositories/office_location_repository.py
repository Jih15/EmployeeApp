import uuid
from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.office_location import OfficeLocation


class OfficeLocationRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self, active_only: bool = True) -> list[OfficeLocation]:
        query = select(OfficeLocation)
        if active_only:
            query = query.where(OfficeLocation.is_active == True)  # noqa: E712
        result = await self.db.execute(query.order_by(OfficeLocation.name))
        return list(result.scalars().all())

    async def get_by_id(self, location_id: uuid.UUID) -> Optional[OfficeLocation]:
        result = await self.db.execute(
            select(OfficeLocation).where(OfficeLocation.id == location_id)
        )
        return result.scalar_one_or_none()

    async def name_exists(
        self, name: str, exclude_id: Optional[uuid.UUID] = None
    ) -> bool:
        """Cek nama duplikat, opsional exclude record yang sedang diupdate."""
        query = select(OfficeLocation.id).where(OfficeLocation.name == name)
        if exclude_id:
            query = query.where(OfficeLocation.id != exclude_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none() is not None

    async def create(self, data: dict) -> OfficeLocation:
        location = OfficeLocation(**data)
        self.db.add(location)
        await self.db.flush()
        await self.db.refresh(location)
        return location

    async def update(self, location: OfficeLocation, data: dict) -> OfficeLocation:
        for field, value in data.items():
            if hasattr(location, field):
                setattr(location, field, value)
        await self.db.flush()
        await self.db.refresh(location)
        return location