import uuid
from typing import Optional

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.database import get_db
from app.core.dependencies import get_current_user, get_hr_or_above, get_super_admin
from app.schemas.leave_schema import (
    LeaveTypeCreateRequest,
    LeaveTypeUpdateRequest,
    LeaveTypeResponse,
)
from app.services.leave_service import LeaveTypeService

router = APIRouter(prefix="/leave-types", tags=["Leave Types"])


@router.get(
    "",
    response_model=list[LeaveTypeResponse],
    summary="List jenis cuti (semua role bisa akses)",
)
async def list_leave_types(
    active_only: bool = Query(True),
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    """
    Employee perlu list ini saat mengajukan cuti.
    HR/Admin bisa lihat semua termasuk yang nonaktif.
    """
    service = LeaveTypeService(db)
    return await service.get_all(active_only)


@router.post(
    "",
    response_model=LeaveTypeResponse,
    status_code=status.HTTP_201_CREATED,
    summary="[Super Admin] Tambah jenis cuti baru",
)
async def create_leave_type(
    body: LeaveTypeCreateRequest,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_super_admin),
):
    service = LeaveTypeService(db)
    return await service.create(body.model_dump())


@router.get(
    "/{leave_type_id}",
    response_model=LeaveTypeResponse,
    summary="[HR/Admin] Detail jenis cuti",
)
async def get_leave_type(
    leave_type_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_hr_or_above),
):
    service = LeaveTypeService(db)
    return await service.get_by_id(leave_type_id)


@router.put(
    "/{leave_type_id}",
    response_model=LeaveTypeResponse,
    summary="[Super Admin] Update jenis cuti",
)
async def update_leave_type(
    leave_type_id: uuid.UUID,
    body: LeaveTypeUpdateRequest,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_super_admin),
):
    service = LeaveTypeService(db)
    return await service.update(leave_type_id, body.model_dump(exclude_none=True))