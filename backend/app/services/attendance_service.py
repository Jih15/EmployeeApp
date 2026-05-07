"""
AttendanceService — clock-in / clock-out dengan validasi:
1. GPS: pastikan employee dalam radius kantor
2. Face: bandingkan foto selfie dengan encoding tersimpan
3. Status otomatis: PRESENT jika tepat waktu, LATE jika terlambat

Jam kerja dan batas terlambat dikonfigurasi hardcode untuk MVP,
bisa dipindah ke tabel settings nanti.
"""
import math
import uuid
from datetime import datetime, timezone

from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import (
    BadRequestException,
    FaceVerificationException,
    NotFoundException,
    OutOfRadiusException,
)
from app.core.face_utils import compare_face
from app.core.file_handler import save_upload_file
from app.models.attendance import Attendance, AttendanceStatus
from app.models.employee_profile import EmployeeProfile
from app.repositories.attendance_repository import AttendanceRepository
from app.repositories.employee_repository import EmployeeRepository
from app.repositories.face_data_repository import FaceDataRepository
from app.repositories.office_location_repository import OfficeLocationRepository

# ── Config (pindah ke DB settings nanti) ──────────────────────────────────────
WORK_START_HOUR = 8       # 08:00 WIB → jam masuk
LATE_THRESHOLD_MINUTE = 15  # toleransi 15 menit → > 08:15 = LATE


def _haversine_meters(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Hitung jarak dua titik GPS dalam meter (Haversine formula)."""
    R = 6_371_000  # radius bumi dalam meter
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

    # ── Clock In ───────────────────────────────────────────────────────────────

    async def clock_in(
        self,
        employee_id: uuid.UUID,
        latitude: float,
        longitude: float,
        photo: UploadFile,
    ) -> Attendance:
        now = datetime.now(timezone.utc)

        # 1. Cek sudah clock-in hari ini
        existing = await self.repo.get_today(employee_id)
        if existing and existing.clock_in_at:
            raise BadRequestException(
                error_code="ALREADY_CLOCKED_IN",
                message="Anda sudah melakukan clock-in hari ini.",
            )

        # 2. Ambil profile → dapat office_location_id
        profile = await self.employee_repo.get_profile(employee_id)
        if not profile or not profile.office_location_id:
            raise BadRequestException(
                error_code="NO_OFFICE_LOCATION",
                message="Lokasi kantor belum dikonfigurasi. Hubungi HR.",
            )

        # 3. Validasi GPS radius
        location = await self.location_repo.get_by_id(profile.office_location_id)
        if not location:
            raise NotFoundException("Office location")

        distance = _haversine_meters(
            latitude, longitude, location.latitude, location.longitude
        )
        if distance > location.radius_meters:
            raise OutOfRadiusException(distance)

        # 4. Validasi face recognition
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
            # Foto tidak tersimpan jika face mismatch/not detected
            from app.core.file_handler import delete_file
            delete_file(photo_path)
            raise

        # 5. Tentukan status: PRESENT atau LATE
        # Konversi ke WIB (UTC+7) untuk logika jam kerja
        # Untuk produksi: gunakan pytz / zoneinfo per kantor
        wib_hour = (now.hour + 7) % 24
        wib_minute = now.minute
        total_minutes = wib_hour * 60 + wib_minute
        work_start_minutes = WORK_START_HOUR * 60 + LATE_THRESHOLD_MINUTE

        status = (
            AttendanceStatus.PRESENT
            if total_minutes <= work_start_minutes
            else AttendanceStatus.LATE
        )

        # 6. Buat atau update record
        if existing:
            # Record sudah ada (misal dibuat alpha oleh cron), update clock-in
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
            "attendance_date": now.date(),
            "clock_in_at": now,
            "clock_in_lat": latitude,
            "clock_in_lng": longitude,
            "clock_in_photo_path": photo_path,
            "clock_in_distance_meters": round(distance, 2),
            "status": status,
        })

    # ── Clock Out ──────────────────────────────────────────────────────────────

    async def clock_out(
        self,
        employee_id: uuid.UUID,
        latitude: float,
        longitude: float,
        photo: UploadFile,
    ) -> Attendance:
        now = datetime.now(timezone.utc)

        # 1. Harus sudah clock-in dulu
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

        # 2. Validasi GPS (pakai office location yang sama saat clock-in)
        if attendance.office_location_id:
            location = await self.location_repo.get_by_id(attendance.office_location_id)
            if location:
                distance = _haversine_meters(
                    latitude, longitude, location.latitude, location.longitude
                )
                if distance > location.radius_meters:
                    raise OutOfRadiusException(distance)

        # 3. Validasi face (sama seperti clock-in)
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
            from app.core.file_handler import delete_file
            delete_file(photo_path)
            raise

        return await self.repo.update(attendance, {
            "clock_out_at": now,
            "clock_out_lat": latitude,
            "clock_out_lng": longitude,
            "clock_out_photo_path": photo_path,
        })

    # ── Queries ────────────────────────────────────────────────────────────────

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