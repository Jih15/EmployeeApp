import uuid

from fastapi import APIRouter, Depends, File, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.database import get_db
from app.core.dependencies import get_current_user, get_hr_or_above
from backend.app.schemas.face_data_schema import FaceDataResponse
from backend.app.services.face_data_service import FaceDataService

# Tag sama "Face Data", tapi prefix di-split:
# - /employees/{id}/face → HR action
# - /me/face             → self service
router = APIRouter(tags=["Face Data"])


@router.post(
    "/employees/{employee_id}/face",
    response_model=FaceDataResponse,
    status_code=status.HTTP_201_CREATED,
    summary="[HR/Admin] Register atau update data wajah karyawan",
)
async def register_face(
    employee_id: uuid.UUID,
    photo: UploadFile = File(..., description="Foto wajah jelas (JPEG/PNG/WebP, maks 5MB)"),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_hr_or_above),
):
    """
    Satu endpoint untuk register dan update — pakai upsert di DB.
    Foto lama otomatis dihapus dari disk jika update.

    Validasi yang terjadi di service:
    - Tipe & ukuran file (BadRequestException)
    - Deteksi wajah (FaceVerificationException.not_detected)
    """
    service = FaceDataService(db)
    return await service.register_or_update(employee_id, photo, current_user.id)


@router.get(
    "/employees/{employee_id}/face",
    response_model=FaceDataResponse,
    summary="[HR/Admin] Status data wajah karyawan",
)
async def get_face_data(
    employee_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_hr_or_above),
):
    service = FaceDataService(db)
    return await service.get(employee_id)


@router.delete(
    "/employees/{employee_id}/face",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="[HR/Admin] Hapus data wajah karyawan",
)
async def delete_face_data(
    employee_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_hr_or_above),
):
    service = FaceDataService(db)
    await service.delete(employee_id)


@router.get(
    "/me/face",
    response_model=FaceDataResponse,
    summary="Lihat status data wajah sendiri",
)
async def get_own_face_data(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """
    Karyawan bisa cek apakah wajahnya sudah terdaftar (has_encoding).
    Tidak perlu akses HR — semua role bisa.
    """
    service = FaceDataService(db)
    return await service.get(current_user.id)