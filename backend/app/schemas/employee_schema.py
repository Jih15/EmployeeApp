import uuid
from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel, EmailStr, field_validator
from app.models.user import UserRole
from app.config.settings import settings


# ── Create Employee (Profile-first, akun auto-generate) ───────────────────────

class EmployeeCreateRequest(BaseModel):
    """
    HR/Admin membuat karyawan baru.
    User (akun login) dibuat otomatis bersamaan.
    
    Email & password opsional:
    - Jika tidak diisi → email = employee_number@company.com, password random
    - Karyawan wajib ganti password saat login pertama (handled di Flutter)
    """
    # ── Profile (wajib) ──────────────────────────────────────────────────────
    full_name: str
    employee_number: str

    # ── Profile (opsional) ───────────────────────────────────────────────────
    phone: Optional[str] = None
    address: Optional[str] = None
    birth_date: Optional[date] = None
    gender: Optional[str] = None

    department: Optional[str] = None
    position: Optional[str] = None
    employment_type: str = "full_time"
    join_date: Optional[date] = None
    end_date: Optional[date] = None

    office_location_id: Optional[uuid.UUID] = None

    base_salary: float = 0
    bank_name: Optional[str] = None
    bank_account_number: Optional[str] = None
    bank_account_name: Optional[str] = None
    tax_id: Optional[str] = None

    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    emergency_contact_relation: Optional[str] = None

    # ── Akun login (opsional) ────────────────────────────────────────────────
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    role: UserRole = UserRole.EMPLOYEE

    @field_validator("gender")
    @classmethod
    def validate_gender(cls, v):
        if v and v not in ("M", "F"):
            raise ValueError("Gender harus 'M' atau 'F'.")
        return v

    @field_validator("employment_type")
    @classmethod
    def validate_employment_type(cls, v):
        allowed = ("full_time", "part_time", "contract")
        if v not in allowed:
            raise ValueError(f"Employment type harus salah satu dari: {', '.join(allowed)}.")
        return v

    @field_validator("password")
    @classmethod
    def validate_password(cls, v):
        if v is not None and len(v) < settings.PASSWORD_MIN_LENGTH:
            raise ValueError(f"Password minimal {settings.PASSWORD_MIN_LENGTH} karakter.")
        return v


# ── Update Account (email / password / role) ──────────────────────────────────

class AccountUpdateRequest(BaseModel):
    """
    HR/Super Admin update kredensial akun karyawan.
    Semua field opsional — hanya field yang dikirim yang diupdate.
    """
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    role: Optional[UserRole] = None

    @field_validator("password")
    @classmethod
    def validate_password(cls, v):
        if v is not None and len(v) < settings.PASSWORD_MIN_LENGTH:
            raise ValueError(f"Password minimal {settings.PASSWORD_MIN_LENGTH} karakter.")
        return v


# ── Profile Update (HR/Admin) ─────────────────────────────────────────────────

class ProfileUpdateRequest(BaseModel):
    """HR/Admin update profile — semua field opsional."""
    full_name: Optional[str] = None
    employee_number: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    birth_date: Optional[date] = None
    gender: Optional[str] = None

    department: Optional[str] = None
    position: Optional[str] = None
    employment_type: Optional[str] = None
    join_date: Optional[date] = None
    end_date: Optional[date] = None

    office_location_id: Optional[uuid.UUID] = None

    base_salary: Optional[float] = None
    bank_name: Optional[str] = None
    bank_account_number: Optional[str] = None
    bank_account_name: Optional[str] = None
    tax_id: Optional[str] = None

    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    emergency_contact_relation: Optional[str] = None

    @field_validator("gender")
    @classmethod
    def validate_gender(cls, v):
        if v and v not in ("M", "F"):
            raise ValueError("Gender harus 'M' atau 'F'.")
        return v

    @field_validator("employment_type")
    @classmethod
    def validate_employment_type(cls, v):
        if v is not None:
            allowed = ("full_time", "part_time", "contract")
            if v not in allowed:
                raise ValueError(f"Employment type harus salah satu dari: {', '.join(allowed)}.")
        return v


# ── Profile Update (Self / Employee) ─────────────────────────────────────────

class SelfProfileUpdateRequest(BaseModel):
    """
    Karyawan update profile sendiri — field terbatas.
    Tidak boleh ubah: salary, employee_number, office_location, employment_type, role.
    """
    phone: Optional[str] = None
    address: Optional[str] = None
    bank_name: Optional[str] = None
    bank_account_number: Optional[str] = None
    bank_account_name: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    emergency_contact_relation: Optional[str] = None


# ── Response Schemas ──────────────────────────────────────────────────────────

class AccountResponse(BaseModel):
    """Info akun login — tanpa password."""
    id: uuid.UUID
    email: str
    role: UserRole
    is_active: bool
    is_verified: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class ProfileResponse(BaseModel):
    employee_id: uuid.UUID
    employee_number: str
    full_name: str
    phone: Optional[str] = None
    address: Optional[str] = None
    birth_date: Optional[date] = None
    gender: Optional[str] = None

    department: Optional[str] = None
    position: Optional[str] = None
    employment_type: str
    join_date: Optional[date] = None
    end_date: Optional[date] = None

    office_location_id: Optional[uuid.UUID] = None

    base_salary: float
    bank_name: Optional[str] = None
    bank_account_number: Optional[str] = None
    bank_account_name: Optional[str] = None
    tax_id: Optional[str] = None

    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    emergency_contact_relation: Optional[str] = None

    updated_at: datetime

    model_config = {"from_attributes": True}


class EmployeeResponse(BaseModel):
    """User + profile — untuk list dan detail endpoint."""
    id: uuid.UUID
    email: str
    role: UserRole
    is_active: bool
    is_verified: bool
    created_at: datetime
    profile: Optional[ProfileResponse] = None

    model_config = {"from_attributes": True}


class EmployeeListResponse(BaseModel):
    """Wrapper pagination list karyawan."""
    data: list[EmployeeResponse]
    total: int
    skip: int
    limit: int