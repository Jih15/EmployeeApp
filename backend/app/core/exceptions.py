from fastapi import HTTPException
from typing import Any, Optional


# Base

class AppException(HTTPException):
    def __init__(
        self,
        status_code: int,
        error_code: str,
        message: str,
        details: Optional[Any] = None,
    ):
        super().__init__(status_code=status_code, detail={
            "error_code": error_code,
            "message": message,
            "details": details,
        })


# Shortcut

class BadRequestException(AppException):
    def __init__(self, error_code: str, message: str, details: Any = None):
        super().__init__(400, error_code, message, details)

class UnauthorizedException(AppException):
    def __init__(self, message: str = "Tidak terautentikasi.", error_code: str = "UNAUTHORIZED"):
        super().__init__(401, error_code, message)

class ForbiddenException(AppException):
    def __init__(self, message: str = "Akses ditolak."):
        super().__init__(403, "FORBIDDEN", message)

class NotFoundException(AppException):
    def __init__(self, resource: str = "Data"):
        super().__init__(404, "NOT_FOUND", f"{resource} tidak ditemukan.")

class ConflictException(AppException):
    def __init__(self, message: str):
        super().__init__(409, "CONFLICT", message)


# Specific

class TokenExpiredException(AppException):
    """
    Spesifik karena Flutter perlu bedain ini dari token invalid
    untuk trigger silent refresh otomatis.
    """
    def __init__(self):
        super().__init__(401, "TOKEN_EXPIRED", "Token telah kedaluwarsa.")


class TokenInvalidException(AppException):
    """
    Spesifik karena Flutter perlu bedain ini dari expired
    untuk force logout (bukan retry).
    """
    def __init__(self):
        super().__init__(401, "TOKEN_INVALID", "Token tidak valid.")


class OutOfRadiusException(AppException):
    """
    Spesifik karena selalu membawa details.distance_meters —
    Flutter butuh angka ini untuk tampilkan "Anda sejauh Xm dari kantor".
    """
    def __init__(self, distance: float):
        super().__init__(
            400,
            "OUT_OF_RADIUS",
            f"Lokasi Anda terlalu jauh dari kantor ({distance:.0f}m).",
            {"distance_meters": round(distance, 2)},
        )


class FaceVerificationException(AppException):
    """
    Spesifik karena ada dua sub-case yang perlu dibedain di service layer:
    - FACE_NOT_DETECTED: tidak ada wajah di foto → minta foto ulang
    - FACE_MISMATCH: wajah ada tapi bukan orangnya → log sebagai security event

    Ditangkap di attendance_service untuk logic yang berbeda per sub-case.
    """
    def __init__(self, error_code: str, message: str):
        super().__init__(400, error_code, message)

    @classmethod
    def not_detected(cls) -> "FaceVerificationException":
        return cls("FACE_NOT_DETECTED", "Wajah tidak terdeteksi. Pastikan pencahayaan cukup.")

    @classmethod
    def mismatch(cls) -> "FaceVerificationException":
        return cls("FACE_MISMATCH", "Wajah tidak cocok dengan data terdaftar.")