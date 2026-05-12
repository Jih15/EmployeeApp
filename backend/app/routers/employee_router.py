import uuid
from typing import Optional

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.database import get_db
from app.core.dependencies import (
    get_current_user,
    get_hr_or_above,
    get_super_admin,
)
from app.models.user import UserRole
from app.schemas.employee_schema import (
    AccountUpdateRequest,
    EmployeeCreateRequest,
    EmployeeListResponse,
    EmployeeResponse,
    ProfileResponse,
    ProfileUpdateRequest,
    SelfProfileUpdateRequest,
)
from app.services.employee_service import EmployeeService

router = APIRouter(prefix="/employees", tags=["Employees"])


# ── Self Endpoints (harus di atas /{employee_id} agar tidak konflik) ──────────

@router.get(
    "/me/profile",
    response_model=EmployeeResponse,
    summary="Lihat profil sendiri",
)
async def get_own_profile(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = EmployeeService(db)
    return await service.get_own_profile(current_user.id)


@router.put(
    "/me/profile",
    response_model=ProfileResponse,
    summary="Update profil sendiri — field terbatas",
)
async def update_own_profile(
    body: SelfProfileUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """
    Karyawan hanya bisa update: phone, address, bank info, emergency contact.
    Field sensitif (salary, office_location, role) hanya bisa diubah HR/Admin.
    """
    service = EmployeeService(db)
    return await service.update_own_profile(
        current_user.id,
        body.model_dump(exclude_none=True),
    )


# ── HR / Admin: Create ────────────────────────────────────────────────────────

@router.post(
    "",
    response_model=EmployeeResponse,
    status_code=status.HTTP_201_CREATED,
    summary="[HR/Admin] Buat karyawan baru (user + profile sekaligus)",
)
async def create_employee(
    body: EmployeeCreateRequest,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_hr_or_above),
):
    """
    Membuat karyawan baru dalam **1 transaksi**:
    - Buat `User` (akun login) → email & password opsional
    - Buat `EmployeeProfile` → full_name & employee_number wajib

    **Auto-generate jika tidak diisi:**
    - `email` → `{employee_number}@company.com`
    - `password` → random 12 karakter (HR wajib sampaikan ke karyawan)

    Response menyertakan `generated_password` jika password di-auto-generate,
    sehingga HR bisa langsung menyampaikan ke karyawan. Password ini hanya
    muncul **sekali** dan tidak disimpan di DB.
    """
    service = EmployeeService(db)
    user = await service.create_employee(body.model_dump())

    # Sisipkan generated_password ke response jika ada
    response = EmployeeResponse.model_validate(user)

    generated_pw = getattr(user, "_generated_password", None)
    if generated_pw:
        # Tambahkan sebagai field extra di response dict
        response_dict = response.model_dump()
        response_dict["generated_password"] = generated_pw
        return response_dict

    return response


# ── HR / Admin: List & Detail ─────────────────────────────────────────────────

@router.get(
    "",
    response_model=EmployeeListResponse,
    summary="[HR/Admin] List semua karyawan dengan pagination & filter",
)
async def list_employees(
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
    "/{employee_id}",
    response_model=EmployeeResponse,
    summary="[HR/Admin] Detail karyawan",
)
async def get_employee(
    employee_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_hr_or_above),
):
    service = EmployeeService(db)
    return await service.get_by_id(employee_id)


# ── HR / Admin: Update Profile ────────────────────────────────────────────────

@router.put(
    "/{employee_id}/profile",
    response_model=ProfileResponse,
    summary="[HR/Admin] Update profil karyawan",
)
async def update_profile(
    employee_id: uuid.UUID,
    body: ProfileUpdateRequest,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_hr_or_above),
):
    service = EmployeeService(db)
    return await service.update_profile(
        employee_id,
        body.model_dump(exclude_none=True),
    )


# ── HR / Admin: Update Account (email / password / role) ──────────────────────

@router.patch(
    "/{employee_id}/account",
    response_model=EmployeeResponse,
    summary="[HR/Admin] Update kredensial akun karyawan",
)
async def update_account(
    employee_id: uuid.UUID,
    body: AccountUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_hr_or_above),
):
    """
    Update email, password, atau role akun karyawan.
    - **Super Admin** bisa update semua karyawan
    - **HR** tidak bisa update akun Super Admin atau assign role Super Admin
    """
    service = EmployeeService(db)
    return await service.update_account(
        employee_id,
        body.model_dump(exclude_none=True),
        actor=current_user,
    )


# ── Super Admin: Activate / Deactivate ────────────────────────────────────────

@router.patch(
    "/{employee_id}/deactivate",
    response_model=EmployeeResponse,
    summary="[Super Admin] Nonaktifkan akun karyawan",
)
async def deactivate_employee(
    employee_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_super_admin),
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
    current_user=Depends(get_super_admin),
):
    service = EmployeeService(db)
    return await service.set_active(employee_id, True, current_user)