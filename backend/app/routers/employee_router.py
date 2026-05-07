import uuid
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.config.database import get_db
from app.core.dependencies import (
    get_current_user,
    get_hr_or_above,
    get_super_admin
)

from app.models.user import UserRole
from app.schemas.employee_schema import (
    ProfileCreateRequest,
    ProfileUpdateRequest,
    SelfProfileUpdateRequest,
    EmployeeResponse,
    EmployeeListResponse,
    ProfileResponse
)

from app.services.employee_service import EmployeeService


router = APIRouter(prefix="/employees", tags=["Employees"])


@router.get(
    "",
    response_model=EmployeeListResponse,
    summary="[HR/Admin] List semua karyawan dengan pagination",
)
async def list_employee(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    role: Optional[UserRole] = Query(None),
    is_active: Optional[bool] = Query(None),
    db: AsyncSession = Depends(get_db),
    _=Depends(get_hr_or_above),
):
    service = EmployeeService(db)
    return await service.get_all(skip, limit, role, is_active)


@router.get(
    "/me/profile",
    response_model=EmployeeResponse,
    summary="Lihat profile sendiri",
)
async def get_own_profile(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user)
):
    service = EmployeeService(db)
    return await service.get_own_profile(current_user.id)


@router.put(
    "/me/profile",
    response_model=ProfileResponse,
    summary="Update profile sendiri - limited field",
)
async def update_own_profile(
    body: SelfProfileUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = EmployeeService(db)
    return await service.update_own_profile(
        current_user.id,
        body.model_dump(exclude_none=True)
    )


@router.get(
    "/{employee_id}",
    response_model=EmployeeResponse,
    summary="[HR/Admin] Detail Karyawan",
)
async def get_employee(
    employee_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_hr_or_above),
):
    service = EmployeeService(db)
    return await service.get_by_id(employee_id)


@router.post(
    "/{employee_id}/profile",
    response_model=ProfileResponse,
    status_code=status.HTTP_201_CREATED,
    summary="[HR/Admin] Buat profile karyawan setelah register",
)
async def create_profile(
    employee_id: uuid.UUID,
    body: ProfileCreateRequest,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_hr_or_above)
):
    service = EmployeeService(db)
    return await service.create_profile(
        employee_id,
        body.model_dump(exclude_none=True)
    )


@router.put(
    "/{employee_id}/profile",
    response_model=ProfileResponse,
    summary="[HR/Admin] Update profile karyawan",
)
async def update_profile(
    employee_id: uuid.UUID,
    body: ProfileUpdateRequest,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_hr_or_above)
):
    service = EmployeeService(db)
    return await service.update_profile(
        employee_id,
        body.model_dump(exclude_none=True)
    )


@router.patch(
    "/{employee_id}/deactivate",
    response_model=EmployeeResponse,
    summary="[Super Admin] Nonaktifkan akun karyawan",
)
async def deactivate_employee(
    employee_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_super_admin)
):
    service = EmployeeService(db)
    return await service.set_active(employee_id, False, current_user)


@router.patch(
    "/{employee_id}/activate",
    response_model=EmployeeResponse,
    summary="[Super Admin] Aktifkan kembali akun karyawan",
)
async def activate_employee(
    employee_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_super_admin)
):
    service = EmployeeService(db)
    return await service.set_active(employee_id, True, current_user)