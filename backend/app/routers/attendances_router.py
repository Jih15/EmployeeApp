import uuid
from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, Query, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.database import get_db
from app.core.dependencies import get_current_user, get_hr_or_above
from app.models.attendance import AttendanceStatus
from backend.app.schemas.attendance_schema import (
    AttendanceListResponse,
    AttendanceResponse,
    TodayAttendanceResponse,
)
from backend.app.services.attendance_service import AttendanceService

router = APIRouter(tags=["Attendance"])


# ── Self (Employee) ────────────────────────────────────────────────────────────

@router.post(
    "/me/attendance/clock-in",
    response_model=AttendanceResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Clock-in dengan foto selfie + GPS",
)
async def clock_in(
    latitude: float = Form(...),
    longitude: float = Form(...),
    photo: UploadFile = File(..., description="Foto selfie wajah (JPEG/PNG/WebP, maks 5MB)"),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """
    Multipart form karena gabungan data JSON (lat/lng) + file (photo).
    Flutter kirim via dio MultipartFile.

    Validasi berurutan:
    1. Sudah clock-in hari ini? → 400
    2. GPS dalam radius kantor? → 400 OUT_OF_RADIUS
    3. Wajah cocok? → 400 FACE_MISMATCH / FACE_NOT_DETECTED
    """
    service = AttendanceService(db)
    return await service.clock_in(current_user.id, latitude, longitude, photo)


@router.post(
    "/me/attendance/clock-out",
    response_model=AttendanceResponse,
    summary="Clock-out dengan foto selfie + GPS",
)
async def clock_out(
    latitude: float = Form(...),
    longitude: float = Form(...),
    photo: UploadFile = File(..., description="Foto selfie wajah (JPEG/PNG/WebP, maks 5MB)"),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = AttendanceService(db)
    return await service.clock_out(current_user.id, latitude, longitude, photo)


@router.get(
    "/me/attendance/today",
    response_model=TodayAttendanceResponse,
    summary="Status kehadiran hari ini",
)
async def get_today(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Flutter pakai ini untuk tampilkan tombol Clock-In / Clock-Out di home screen."""
    service = AttendanceService(db)
    return await service.get_today(current_user.id)


@router.get(
    "/me/attendance",
    response_model=AttendanceListResponse,
    summary="Riwayat kehadiran saya",
)
async def get_my_history(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    date_from: Optional[date] = Query(None),
    date_to: Optional[date] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = AttendanceService(db)
    return await service.get_my_history(
        current_user.id, skip, limit, date_from, date_to
    )


# ── HR / Admin ─────────────────────────────────────────────────────────────────

@router.get(
    "/attendance",
    response_model=AttendanceListResponse,
    summary="[HR/Admin] List semua absensi dengan filter",
)
async def list_attendance(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    employee_id: Optional[uuid.UUID] = Query(None),
    date_from: Optional[date] = Query(None),
    date_to: Optional[date] = Query(None),
    status: Optional[AttendanceStatus] = Query(None),
    db: AsyncSession = Depends(get_db),
    _=Depends(get_hr_or_above),
):
    service = AttendanceService(db)
    return await service.get_all(skip, limit, employee_id, date_from, date_to, status)