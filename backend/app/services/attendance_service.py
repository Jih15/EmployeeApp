import math
import uuid
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import (
    BadRequestException,
    FaceVerificationException,
    NotFoundException,
    OutOfRadiusException,
)
from app.core.face_utils import compare_face
from app.core.file_handler import delete_file, save_upload_file
from app.models.attendance import Attendance, AttendanceStatus
from app.repositories.attendance_repository import AttendanceRepository
from app.repositories.employee_repository import EmployeeRepository
from app.repositories.face_data_repository import FaceDataRepository
from app.repositories.office_location_repository import OfficeLocationRepository

WORK_START_HOUR = 8
LATE_THRESHOLD_MINUTE = 15
WIB = ZoneInfo("Asia/Jakarta")


def _haversine_meters(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    R = 6_371_000
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lng2 - lng1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


class AttendanceService:
    def __init__(self, db: AsyncSession):
        self.repo = AttendanceRepository(db)
        self.employee_repo = EmployeeRepository(db)
        self.face_repo = FaceDataRepository(db)
        self.location_repo = OfficeLocationRepository(db)

    async def clock_in(
        self,
        employee_id: uuid.UUID,
        latitude: float,
        longitude: float,
        photo: UploadFile,
    ) -> Attendance:
        now = datetime.now(timezone.utc)
        now_wib = now.astimezone(WIB)

        existing = await self.repo.get_today(employee_id)
        if existing and existing.clock_in_at:
            raise BadRequestException(
                error_code="ALREADY_CLOCKED_IN",
                message="Anda sudah melakukan clock-in hari ini.",
            )

        profile = await self.employee_repo.get_profile(employee_id)
        if not profile or not profile.office_location_id:
            raise BadRequestException(
                error_code="NO_OFFICE_LOCATION",
                message="Lokasi kantor belum dikonfigurasi. Hubungi HR.",
            )

        location = await self.location_repo.get_by_id(profile.office_location_id)
        if not location:
            raise NotFoundException("Office location")

        distance = _haversine_meters(
            latitude, longitude, location.latitude, location.longitude
        )
        if distance > location.radius_meters:
            raise OutOfRadiusException(distance)

        face_data = await self.face_repo.get_by_employee_id(employee_id)
        if not face_data or not face_data.encoding:
            raise BadRequestException(
                error_code="FACE_NOT_REGISTERED",
                message="Data wajah belum terdaftar. Hubungi HR.",
            )

        photo_path, image_bytes = await save_upload_file(photo, subdirectory="attendance")
        try:
            compare_face(face_data.encoding, image_bytes)
        except FaceVerificationException:
            delete_file(photo_path)
            raise

        total_minutes = now_wib.hour * 60 + now_wib.minute
        work_start_minutes = WORK_START_HOUR * 60 + LATE_THRESHOLD_MINUTE

        status = (
            AttendanceStatus.PRESENT
            if total_minutes <= work_start_minutes
            else AttendanceStatus.LATE
        )

        if existing:
            return await self.repo.update(existing, {
                "clock_in_at": now,
                "clock_in_lat": latitude,
                "clock_in_lng": longitude,
                "clock_in_photo_path": photo_path,
                "clock_in_distance_meters": round(distance, 2),
                "office_location_id": location.id,
                "status": status,
            })

        return await self.repo.create({
            "employee_id": employee_id,
            "office_location_id": location.id,
            "attendance_date": now_wib.date(),
            "clock_in_at": now,
            "clock_in_lat": latitude,
            "clock_in_lng": longitude,
            "clock_in_photo_path": photo_path,
            "clock_in_distance_meters": round(distance, 2),
            "status": status,
        })

    async def clock_out(
        self,
        employee_id: uuid.UUID,
        latitude: float,
        longitude: float,
        photo: UploadFile,
    ) -> Attendance:
        now = datetime.now(timezone.utc)

        attendance = await self.repo.get_today(employee_id)
        if not attendance or not attendance.clock_in_at:
            raise BadRequestException(
                error_code="NOT_CLOCKED_IN",
                message="Anda belum melakukan clock-in hari ini.",
            )
        if attendance.clock_out_at:
            raise BadRequestException(
                error_code="ALREADY_CLOCKED_OUT",
                message="Anda sudah melakukan clock-out hari ini.",
            )

        if attendance.office_location_id:
            location = await self.location_repo.get_by_id(attendance.office_location_id)
            if location:
                distance = _haversine_meters(
                    latitude, longitude, location.latitude, location.longitude
                )
                if distance > location.radius_meters:
                    raise OutOfRadiusException(distance)

        face_data = await self.face_repo.get_by_employee_id(employee_id)
        if not face_data or not face_data.encoding:
            raise BadRequestException(
                error_code="FACE_NOT_REGISTERED",
                message="Data wajah belum terdaftar. Hubungi HR.",
            )

        photo_path, image_bytes = await save_upload_file(photo, subdirectory="attendance")
        try:
            compare_face(face_data.encoding, image_bytes)
        except FaceVerificationException:
            delete_file(photo_path)
            raise

        return await self.repo.update(attendance, {
            "clock_out_at": now,
            "clock_out_lat": latitude,
            "clock_out_lng": longitude,
            "clock_out_photo_path": photo_path,
        })

    async def get_today(self, employee_id: uuid.UUID) -> dict:
        attendance = await self.repo.get_today(employee_id)
        return {
            "attendance": attendance,
            "has_clocked_in": attendance is not None and attendance.clock_in_at is not None,
            "has_clocked_out": attendance is not None and attendance.clock_out_at is not None,
        }

    async def get_all(
        self,
        skip: int,
        limit: int,
        employee_id=None,
        date_from=None,
        date_to=None,
        status=None,
    ) -> dict:
        records, total = await self.repo.get_all(
            skip, limit, employee_id, date_from, date_to, status
        )
        return {"data": records, "total": total, "skip": skip, "limit": limit}

    async def get_my_history(
        self,
        employee_id: uuid.UUID,
        skip: int,
        limit: int,
        date_from=None,
        date_to=None,
    ) -> dict:
        records, total = await self.repo.get_all(
            skip, limit, employee_id=employee_id, date_from=date_from, date_to=date_to
        )
        return {"data": records, "total": total, "skip": skip, "limit": limit}