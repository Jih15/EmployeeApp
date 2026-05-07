from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import (
    verify_password,
    hash_password,
    create_access_token,
    create_refresh_token,
    decode_token,
    blacklist_token,
)
from app.core.exceptions import (
    UnauthorizedException,
    ConflictException,
    TokenInvalidException,
    NotFoundException,
)
from app.models.user import User, UserRole
from app.repositories.user_repository import UserRepository


class AuthService:
    def __init__(self, db: AsyncSession):
        self.repo = UserRepository(db)

    # ── Login ──────────────────────────────────────────────────────────────────

    async def login(self, email: str, password: str) -> dict:
        user = await self.repo.get_by_email(email)

        # Sengaja satu pesan untuk dua kondisi — cegah user enumeration
        if not user or not verify_password(password, user.hashed_password):
            raise UnauthorizedException(
                message="Email atau password salah.",
                error_code="INVALID_CREDENTIALS",
            )

        if not user.is_active:
            raise UnauthorizedException(message="Akun Anda telah dinonaktifkan.")

        return {
            "access_token": create_access_token(str(user.id), user.role.value),
            "refresh_token": create_refresh_token(str(user.id)),
            "token_type": "bearer",
            "user": user,
        }

    # ── Logout ─────────────────────────────────────────────────────────────────

    async def logout(self, access_token: str) -> None:
        """
        Blacklist JTI access token di Redis sampai token alami expiry.
        Flutter juga wajib hapus refresh token dari secure storage.
        """
        payload = await decode_token(access_token)
        jti = payload.get("jti")
        exp = payload.get("exp")

        if not jti or not exp:
            raise TokenInvalidException()

        now = int(datetime.now(timezone.utc).timestamp())
        ttl = exp - now

        if ttl > 0:
            await blacklist_token(jti, ttl)

    # ── Refresh ────────────────────────────────────────────────────────────────

    async def refresh(self, refresh_token: str) -> dict:
        """
        Refresh token rotation:
        1. Validasi refresh token
        2. Blacklist refresh token lama (one-time use)
        3. Issue access token baru + refresh token baru
        """
        payload = await decode_token(refresh_token)

        if payload.get("type") != "refresh":
            raise TokenInvalidException()

        user_id = payload.get("sub")
        user = await self.repo.get_by_id(user_id)

        if not user:
            raise NotFoundException("User")
        if not user.is_active:
            raise UnauthorizedException("Akun Anda telah dinonaktifkan.")

        # Invalidasi refresh token lama — cegah replay attack
        await self._blacklist_payload(payload)

        return {
            "access_token": create_access_token(str(user.id), user.role.value),
            "refresh_token": create_refresh_token(str(user.id)),
            "token_type": "bearer",
        }

    # ── Register ───────────────────────────────────────────────────────────────

    async def register(self, email: str, password: str, role: UserRole) -> User:
        """
        Buat akun baru — hanya dipanggil oleh Super Admin.
        Profile karyawan (nama, dept, dll) diisi terpisah via endpoint /employees.
        """
        if await self.repo.email_exists(email):
            raise ConflictException(f"Email {email} sudah terdaftar.")

        return await self.repo.create(
            email=email.lower().strip(),
            hashed_password=hash_password(password),
            role=role,
        )

    # ── Change Password ────────────────────────────────────────────────────────

    async def change_password(
        self, user: User, old_password: str, new_password: str
    ) -> None:
        if not verify_password(old_password, user.hashed_password):
            raise UnauthorizedException(
                message="Password lama tidak sesuai.",
                error_code="INVALID_PASSWORD",
            )

        if old_password == new_password:
            from app.core.exceptions import BadRequestException
            raise BadRequestException(
                error_code="SAME_PASSWORD",
                message="Password baru tidak boleh sama dengan password lama.",
            )

        await self.repo.update(user, {
            "hashed_password": hash_password(new_password)
        })

    # ── Private Helpers ────────────────────────────────────────────────────────

    async def _blacklist_payload(self, payload: dict) -> None:
        jti = payload.get("jti")
        exp = payload.get("exp")
        if not jti or not exp:
            return
        now = int(datetime.now(timezone.utc).timestamp())
        ttl = exp - now
        if ttl > 0:
            await blacklist_token(jti, ttl)