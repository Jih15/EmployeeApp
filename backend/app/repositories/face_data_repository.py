import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.employee_face_data import EmployeeFaceData


class FaceDataRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_employee_id(self, employee_id: uuid.UUID) -> Optional[EmployeeFaceData]:
        result = await self.db.execute(
            select(EmployeeFaceData).where(EmployeeFaceData.employee_id == employee_id)
        )
        return result.scalar_one_or_none()

    async def upsert(
        self,
        employee_id: uuid.UUID,
        photo_path: str,
        encoding_json: str,
        registrar_id: uuid.UUID,
    ) -> EmployeeFaceData:
        """
        Insert jika belum ada, update jika sudah ada.
        registered_by & registered_at hanya diset saat pertama kali.
        last_updated_at selalu diupdate.
        """
        now = datetime.now(timezone.utc)
        existing = await self.get_by_employee_id(employee_id)

        if existing:
            existing.photo_path = photo_path
            existing.encoding = encoding_json
            existing.last_updated_at = now
            await self.db.flush()
            await self.db.refresh(existing)
            return existing

        face_data = EmployeeFaceData(
            employee_id=employee_id,
            photo_path=photo_path,
            encoding=encoding_json,
            registered_at=now,
            registered_by=registrar_id,
            last_updated_at=now,
        )
        self.db.add(face_data)
        await self.db.flush()
        await self.db.refresh(face_data)
        return face_data

    async def delete(self, employee_id: uuid.UUID) -> bool:
        """Returns True jika berhasil dihapus, False jika tidak ada."""
        face_data = await self.get_by_employee_id(employee_id)
        if not face_data:
            return False
        await self.db.delete(face_data)
        await self.db.flush()
        return True