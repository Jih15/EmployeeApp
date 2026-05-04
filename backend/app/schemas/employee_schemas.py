import uuid
from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel, field_validator
from app.models.user import UserRole

# Profile Schema
class ProfileCreateRequest(BaseModel):
    """HR/Admin is profil karyawan setelah akun dibuat"""
    full_name: str
    employee_number: str
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


    @field_validator("gender")
    @classmethod
    def validate_gender(cls, v):
        if v and v not in("M", "F"):
            raise ValueError("Gender harus 'M' atau 'F'.")
        return v

    @field_validator("employment_type")
    @classmethod
    def validate_employment_type(cls, v):
        allowed = ("full_time", "part_time", "contract")
        if v not in allowed:
            raise ValueError(f"Employment type harus salah satu dari: {', '.join(allowed)}.")
        return v

class ProfileUpdateRequest(BaseModel):
    """HR/Admin update profile - semua field opsional."""
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
        if v and v not in("M", "F"):
            raise ValueError("Gender harus 'M' atau 'F'.")
        return v
    
class SelfProfileUpdateRequest(BaseModel):
    """
    Karyawan update profile sendiri - field terbatas.
    Tidak boleh ubah: salary, employee_number, office_location, employment_type
    """
    phone: Optional[str] = None
    address: Optional[str] = None
    bank_name: Optional[str] = None
    bank_account_number: Optional[str] = None
    bank_account_name: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    emergency_contact_relation: Optional[str] = None    

# Response Schema
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

    model_config = {
        "from_attributes": True
    }

class EmployeeResponse(BaseModel):
    """User + profile - untuk list dan detail endpoint."""
    id: uuid.UUID
    email: str
    role: UserRole
    is_active: bool
    is_verified: bool
    created_at: datetime
    profile: Optional[ProfileResponse] = None

    model_config = {
        "from_attributes" : True
    }

class EmployeeListResponse(BaseModel):
    """Wrapper pagination list karyawan."""
    data: list[EmployeeResponse]
    total: int
    skip: int
    limit: int