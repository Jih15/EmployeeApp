"""
FaceDataService — kelola registrasi data wajah karyawan.

Flow register/update:
1. Validasi employee ada
2. Simpan foto ke disk (save_upload_file) → dapat bytes
3. Encode wajah dari bytes (encode_face) → raise jika wajah tidak terdeteksi
4. Hapus foto lama dari disk jika ada
5. Upsert ke DB (tidak commit di sini — commit ada di get_db dependency)

Jika step 3 gagal (tidak ada wajah), foto baru dihapus dari disk agar tidak junk.
"""
import json
import uuid

from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundException
from app.core.face_utils import encode_face
from app.core.file_handler import delete_file, save_upload_file
from app.models.employee_face_data import EmployeeFaceData
from app.repositories.face_data_repository import FaceDataRepository
from app.repositories.user_repository import UserRepository


class FaceDataService:
    def __init__(self, db: AsyncSession):
        self.repo = FaceDataRepository(db)
        self.user_repo = UserRepository(db)

    async def register_or_update(
        self,
        employee_id: uuid.UUID,
        photo: UploadFile,
        registrar_id: uuid.UUID,
    ) -> EmployeeFaceData:
        # Pastikan karyawan ada
        user = await self.user_repo.get_by_id(employee_id)
        if not user:
            raise NotFoundException("Karyawan")

        # Simpan foto ke disk & baca bytes sekaligus
        photo_path, image_bytes = await save_upload_file(photo, subdirectory="faces")

        try:
            encoding = encode_face(image_bytes)
        except Exception:
            # Rollback file jika deteksi wajah gagal
            delete_file(photo_path)
            raise

        # Hapus foto lama setelah encoding baru berhasil
        existing = await self.repo.get_by_employee_id(employee_id)
        if existing and existing.photo_path and existing.photo_path != photo_path:
            delete_file(existing.photo_path)

        return await self.repo.upsert(
            employee_id=employee_id,
            photo_path=photo_path,
            encoding_json=json.dumps(encoding),
            registrar_id=registrar_id,
        )

    async def get(self, employee_id: uuid.UUID) -> EmployeeFaceData:
        face_data = await self.repo.get_by_employee_id(employee_id)
        if not face_data:
            raise NotFoundException("Data wajah karyawan")
        return face_data

    async def delete(self, employee_id: uuid.UUID) -> None:
        face_data = await self.repo.get_by_employee_id(employee_id)
        if not face_data:
            raise NotFoundException("Data wajah karyawan")

        # Hapus foto dari disk dulu sebelum hapus record DB
        if face_data.photo_path:
            delete_file(face_data.photo_path)

        await self.repo.delete(employee_id)