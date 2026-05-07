import uuid
from typing import Optional

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.database import get_db
from app.core.dependencies import get_hr_or_above, get_super_admin
from app.schemas.office_location_schema import (
    OfficeLocationCreateRequest,
    OfficeLocationResponse,
    OfficeLocationUpdateRequest,
)
from app.services.office_location_service import OfficeLocationService

router = APIRouter(prefix="/office-locations", tags=["Office Locations"])


@router.get(
    "",
    response_model=list[OfficeLocationResponse],
    summary="[HR/Admin] List semua office location",
)
async def list_locations(
    active_only: bool = Query(True, description="True = hanya yang aktif"),
    db: AsyncSession = Depends(get_db),
    _=Depends(get_hr_or_above),
):
    service = OfficeLocationService(db)
    return await service.get_all(active_only)


@router.post(
    "",
    response_model=OfficeLocationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="[Super Admin] Tambah office location baru",
)
async def create_location(
    body: OfficeLocationCreateRequest,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_super_admin),
):
    service = OfficeLocationService(db)
    return await service.create(body.model_dump())


@router.get(
    "/{location_id}",
    response_model=OfficeLocationResponse,
    summary="[HR/Admin] Detail office location",
)
async def get_location(
    location_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_hr_or_above),
):
    service = OfficeLocationService(db)
    return await service.get_by_id(location_id)


@router.put(
    "/{location_id}",
    response_model=OfficeLocationResponse,
    summary="[Super Admin] Update office location",
)
async def update_location(
    location_id: uuid.UUID,
    body: OfficeLocationUpdateRequest,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_super_admin),
):
    service = OfficeLocationService(db)
    return await service.update(location_id, body.model_dump(exclude_none=True))


@router.patch(
    "/{location_id}/deactivate",
    response_model=OfficeLocationResponse,
    summary="[Super Admin] Nonaktifkan office location",
)
async def deactivate_location(
    location_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_super_admin),
):
    service = OfficeLocationService(db)
    return await service.set_active(location_id, False)


@router.patch(
    "/{location_id}/activate",
    response_model=OfficeLocationResponse,
    summary="[Super Admin] Aktifkan kembali office location",
)
async def activate_location(
    location_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_super_admin),
):
    service = OfficeLocationService(db)
    return await service.set_active(location_id, True)