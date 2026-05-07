import uuid
from datetime import datetime, date
from typing import Optional

from pydantic import BaseModel, field_validator, model_validator

from app.models.leave_request import LeaveStatus


# ── Leave Type ─────────────────────────────────────────────────────────────────

class LeaveTypeCreateRequest(BaseModel):
    name: str
    max_days_per_year: int = 12
    requires_document: bool = False
    is_paid: bool = True

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Nama tidak boleh kosong.")
        return v

    @field_validator("max_days_per_year")
    @classmethod
    def validate_days(cls, v: int) -> int:
        if v <= 0:
            raise ValueError("max_days_per_year harus lebih dari 0.")
        return v


class LeaveTypeUpdateRequest(BaseModel):
    name: Optional[str] = None
    max_days_per_year: Optional[int] = None
    requires_document: Optional[bool] = None
    is_paid: Optional[bool] = None
    is_active: Optional[bool] = None


class LeaveTypeResponse(BaseModel):
    id: uuid.UUID
    name: str
    max_days_per_year: int
    requires_document: bool
    is_paid: bool
    is_active: bool

    model_config = {"from_attributes": True}


# ── Leave Request ──────────────────────────────────────────────────────────────

class LeaveRequestCreateRequest(BaseModel):
    leave_type_id: uuid.UUID
    start_date: date
    end_date: date
    reason: Optional[str] = None
    # document dikirim terpisah via UploadFile jika requires_document=True

    @model_validator(mode="after")
    def validate_dates(self) -> "LeaveRequestCreateRequest":
        if self.end_date < self.start_date:
            raise ValueError("end_date tidak boleh sebelum start_date.")
        return self


class LeaveReviewRequest(BaseModel):
    """HR approve / reject pengajuan cuti."""
    status: LeaveStatus
    review_notes: Optional[str] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: LeaveStatus) -> LeaveStatus:
        allowed = {LeaveStatus.APPROVED, LeaveStatus.REJECTED}
        if v not in allowed:
            raise ValueError("Status harus 'approved' atau 'rejected'.")
        return v


class LeaveRequestResponse(BaseModel):
    id: uuid.UUID
    employee_id: uuid.UUID
    leave_type_id: uuid.UUID

    start_date: date
    end_date: date
    total_days: int
    reason: Optional[str] = None
    document_path: Optional[str] = None

    status: LeaveStatus
    reviewed_by: Optional[uuid.UUID] = None
    reviewed_at: Optional[datetime] = None
    review_notes: Optional[str] = None

    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class LeaveRequestListResponse(BaseModel):
    data: list[LeaveRequestResponse]
    total: int
    skip: int
    limit: int