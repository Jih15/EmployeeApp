import uuid
from datetime import datetime, date
from typing import Optional

from pydantic import BaseModel, field_validator

from app.models.attendance import AttendanceStatus


# ── Request ────────────────────────────────────────────────────────────────────

class ClockInRequest(BaseModel):
    """
    Flutter kirim lat/lng dari GPS device.
    Photo dikirim terpisah sebagai UploadFile (multipart/form-data).
    """
    latitude: float
    longitude: float

    @field_validator("latitude")
    @classmethod
    def validate_lat(cls, v: float) -> float:
        if not -90 <= v <= 90:
            raise ValueError("Latitude tidak valid.")
        return v

    @field_validator("longitude")
    @classmethod
    def validate_lng(cls, v: float) -> float:
        if not -180 <= v <= 180:
            raise ValueError("Longitude tidak valid.")
        return v


class ClockOutRequest(BaseModel):
    latitude: float
    longitude: float

    @field_validator("latitude")
    @classmethod
    def validate_lat(cls, v: float) -> float:
        if not -90 <= v <= 90:
            raise ValueError("Latitude tidak valid.")
        return v

    @field_validator("longitude")
    @classmethod
    def validate_lng(cls, v: float) -> float:
        if not -180 <= v <= 180:
            raise ValueError("Longitude tidak valid.")
        return v


class AttendanceFilterRequest(BaseModel):
    """Query params untuk HR list attendance."""
    employee_id: Optional[uuid.UUID] = None
    date_from: Optional[date] = None
    date_to: Optional[date] = None
    status: Optional[AttendanceStatus] = None


# ── Response ───────────────────────────────────────────────────────────────────

class AttendanceResponse(BaseModel):
    id: uuid.UUID
    employee_id: uuid.UUID
    office_location_id: Optional[uuid.UUID] = None
    attendance_date: date

    clock_in_at: Optional[datetime] = None
    clock_in_lat: Optional[float] = None
    clock_in_lng: Optional[float] = None
    clock_in_photo_path: Optional[str] = None
    clock_in_distance_meters: Optional[float] = None

    clock_out_at: Optional[datetime] = None
    clock_out_lat: Optional[float] = None
    clock_out_lng: Optional[float] = None
    clock_out_photo_path: Optional[str] = None

    status: AttendanceStatus
    notes: Optional[str] = None

    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class AttendanceListResponse(BaseModel):
    data: list[AttendanceResponse]
    total: int
    skip: int
    limit: int


class TodayAttendanceResponse(BaseModel):
    """
    Ringkasan kehadiran hari ini untuk Flutter home screen.
    Bisa null jika belum ada record sama sekali hari ini.
    """
    attendance: Optional[AttendanceResponse] = None
    has_clocked_in: bool = False
    has_clocked_out: bool = False