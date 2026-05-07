import uuid
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import BadRequestException, ConflictException, NotFoundException
from app.models.office_location import OfficeLocation
from app.repositories.office_location_repository import OfficeLocationRepository


class OfficeLocationService:
    def __init__(self, db:AsyncSession):
        self.repo = OfficeLocationRepository(db)

    async def get_all(self, active_only: bool = True) -> list[OfficeLocation]:
        return await self.repo.get_all(active_only)
    
    async def get_by_id(self, location_id: uuid.UUID) -> OfficeLocation:
        loc = await self.repo.get_by_id(location_id)
        if not loc:
            raise NotFoundException("Office location")
        return loc
    
    async def create(self, data: dict) -> OfficeLocation:
        if await self.repo.name_exists(data["name"]):
            raise ConflictException(f"Office location '{data['name']}' sudah ada.")
        return await self.repo.create(data)
    
    async def update(self, location_id: uuid.UUID, data: dict) -> OfficeLocation:
        loc = await self.repo.get_by_id(location_id)
        if not loc:
            raise NotFoundException("Office Location")
        
        new_name = data.get("name")
        if new_name and await self.repo.name_exists(new_name, exclude_id=location_id):
            raise ConflictException(f"Name '{new_name}' sudah digunakan.")
        
        return await self.repo.update(loc, data)
    
    async def set_active(self, location_id: uuid.UUID, is_active: bool) -> OfficeLocation:
        """
        Soft delete via is_active = False.
        Tidak bisa hapus permanen karena office_location bisa punya FK ke attendance history.
        """
        loc = await self.repo.get_by_id(location_id)
        if not loc:
            raise NotFoundException("Office location")
        
        if loc.is_active == is_active:
            state = "aktif" if is_active else "nonaktif"
            raise BadRequestException(
                error_code="NO_CHANGE",
                message=f"Office location sudah dalam status {state}."
            )
        
        return await self.repo.update(loc, {"is_active": is_active})