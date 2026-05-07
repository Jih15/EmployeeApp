import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, field_validator


class OfficeLocationCreateRequest(BaseModel):
    name: str
    address: Optional[str] = None
    latitude: float
    longitude: float
    radius_meters: float = 100.0

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Nama tidak boleh kosong.")
        return v

    @field_validator("radius_meters")
    @classmethod
    def validate_radius(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("Radius harus lebih dari 0 meter.")
        if v > 10_000:
            raise ValueError("Radius maksimal 10.000 meter.")
        return v

    @field_validator("latitude")
    @classmethod
    def validate_lat(cls, v: float) -> float:
        if not -90 <= v <= 90:
            raise ValueError("Latitude harus antara -90 dan 90.")
        return v

    @field_validator("longitude")
    @classmethod
    def validate_lng(cls, v: float) -> float:
        if not -180 <= v <= 180:
            raise ValueError("Longitude harus antara -180 dan 180.")
        return v


class OfficeLocationUpdateRequest(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    radius_meters: Optional[float] = None
    is_active: Optional[bool] = None

    @field_validator("radius_meters")
    @classmethod
    def validate_radius(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and v <= 0:
            raise ValueError("Radius harus lebih dari 0 meter.")
        return v


class OfficeLocationResponse(BaseModel):
    id: uuid.UUID
    name: str
    address: Optional[str] = None
    latitude: float
    longitude: float
    radius_meters: float
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}