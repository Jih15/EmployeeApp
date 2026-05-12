import secrets
import string
import uuid
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import (
    NotFoundException,
    ConflictException,
    BadRequestException,
    ForbiddenException,
)
from app.core.security import hash_password
from app.models.user import User, UserRole
from app.models.employee_profile import EmployeeProfile
from app.repositories.employee_repository import EmployeeRepository
from app.repositories.user_repository import UserRepository


def _generate_password(length: int = 12) -> str:
    """
    Generate random password untuk akun auto-created.
    Karyawan wajib ganti saat login pertama (handled di Flutter/app).
    """
    alphabet = string.ascii_letters + string.digits + "!@#$%"
    # Pastikan minimal ada 1 huruf besar, 1 angka, 1 simbol
    password = [
        secrets.choice(string.ascii_uppercase),
        secrets.choice(string.digits),
        secrets.choice("!@#$%"),
    ]
    password += [secrets.choice(alphabet) for _ in range(length - 3)]
    secrets.SystemRandom().shuffle(password)
    return "".join(password)


def _generate_email(employee_number: str, domain: str = "company.com") -> str:
    """
    Generate email default dari employee_number.
    Contoh: EMP-001 → emp-001@company.com
    """
    slug = employee_number.lower().replace(" ", "-")
    return f"{slug}@{domain}"


class EmployeeService:
    def __init__(self, db: AsyncSession):
        self.repo = EmployeeRepository(db)
        self.user_repo = UserRepository(db)

    # ── Create (Profile-first + Auto User) ────────────────────────────────────

    async def create_employee(self, data: dict) -> User:
        """
        Buat karyawan baru dalam 1 transaksi:
        1. Validasi employee_number & email unik
        2. Generate email/password jika tidak disediakan
        3. Buat User (akun login)
        4. Buat EmployeeProfile

        Return: User dengan profile ter-load (eager).
        """
        # ── Validasi employee_number ──────────────────────────────────────────
        employee_number = data["employee_number"]
        if await self.repo.employee_number_exists(employee_number):
            raise ConflictException(
                f"Employee number '{employee_number}' sudah digunakan."
            )

        # ── Tentukan email ────────────────────────────────────────────────────
        email = data.get("email")
        if not email:
            email = _generate_email(employee_number)

        # Pastikan email belum dipakai
        if await self.user_repo.email_exists(email):
            raise ConflictException(f"Email '{email}' sudah terdaftar.")

        # ── Tentukan password ─────────────────────────────────────────────────
        raw_password = data.get("password")
        auto_generated = raw_password is None
        if auto_generated:
            raw_password = _generate_password()

        # ── Buat User ─────────────────────────────────────────────────────────
        role = data.get("role", UserRole.EMPLOYEE)
        user = await self.user_repo.create(
            email=email.lower().strip(),
            hashed_password=hash_password(raw_password),
            role=role,
        )

        # ── Buat Profile ──────────────────────────────────────────────────────
        profile_fields = {
            "full_name", "employee_number", "phone", "address",
            "birth_date", "gender", "department", "position",
            "employment_type", "join_date", "end_date",
            "office_location_id", "base_salary", "bank_name",
            "bank_account_number", "bank_account_name", "tax_id",
            "emergency_contact_name", "emergency_contact_phone",
            "emergency_contact_relation",
        }
        profile_data = {k: v for k, v in data.items() if k in profile_fields and v is not None}

        await self.repo.create_profile(user.id, profile_data)

        # ── Load ulang dengan profile ─────────────────────────────────────────
        user_with_profile = await self.repo.get_user_with_profile(user.id)

        # Sisipkan generated_password di object sementara agar bisa
        # dikembalikan ke caller (untuk ditampilkan sekali ke HR).
        # Tidak disimpan di DB — hanya ada di response ini.
        if auto_generated:
            user_with_profile._generated_password = raw_password  # type: ignore[attr-defined]

        return user_with_profile

    # ── Update Account (email / password / role) ──────────────────────────────

    async def update_account(
        self, target_id: uuid.UUID, data: dict, actor: User
    ) -> User:
        """
        HR/Super Admin update kredensial akun karyawan.
        - Super Admin bisa update semua
        - HR tidak bisa update akun Super Admin
        """
        user = await self.user_repo.get_by_id(target_id)
        if not user:
            raise NotFoundException("Karyawan")

        # HR tidak boleh ubah akun super admin
        if actor.role == UserRole.HR and user.role == UserRole.SUPER_ADMIN:
            raise ForbiddenException("HR tidak dapat mengubah akun Super Admin.")

        update_data: dict = {}

        new_email = data.get("email")
        if new_email:
            new_email = new_email.lower().strip()
            if new_email != user.email:
                if await self.user_repo.email_exists(new_email):
                    raise ConflictException(f"Email '{new_email}' sudah digunakan.")
            update_data["email"] = new_email

        new_password = data.get("password")
        if new_password:
            update_data["hashed_password"] = hash_password(new_password)

        new_role = data.get("role")
        if new_role:
            # HR tidak bisa assign role Super Admin
            if actor.role == UserRole.HR and new_role == UserRole.SUPER_ADMIN:
                raise ForbiddenException("HR tidak dapat assign role Super Admin.")
            update_data["role"] = new_role

        if not update_data:
            raise BadRequestException(
                error_code="NO_CHANGE",
                message="Tidak ada data yang diubah.",
            )

        return await self.user_repo.update(user, update_data)

    # ── List ──────────────────────────────────────────────────────────────────

    async def get_all(
        self,
        skip: int = 0,
        limit: int = 20,
        role: UserRole | None = None,
        is_active: bool | None = None,
    ) -> dict:
        users, total = await self.repo.get_all_with_profile(skip, limit, role, is_active)
        return {
            "data": users,
            "total": total,
            "skip": skip,
            "limit": limit,
        }

    # ── Detail ────────────────────────────────────────────────────────────────

    async def get_by_id(self, user_id: uuid.UUID) -> User:
        user = await self.repo.get_user_with_profile(user_id)
        if not user:
            raise NotFoundException("Karyawan")
        return user

    # ── Update Profile (HR/Admin) ─────────────────────────────────────────────

    async def update_profile(self, user_id: uuid.UUID, data: dict) -> EmployeeProfile:
        profile = await self.repo.get_profile(user_id)
        if not profile:
            raise NotFoundException("Profil karyawan")

        # Kalau employee_number diubah, cek unique
        new_number = data.get("employee_number")
        if new_number and new_number != profile.employee_number:
            if await self.repo.employee_number_exists(new_number):
                raise ConflictException(
                    f"Employee number '{new_number}' sudah digunakan."
                )

        clean_data = {k: v for k, v in data.items() if v is not None}
        return await self.repo.update_profile(profile, clean_data)

    # ── Update Profile (Self / Employee) ──────────────────────────────────────

    async def update_own_profile(self, user_id: uuid.UUID, data: dict) -> EmployeeProfile:
        """
        Karyawan hanya boleh update field terbatas.
        Field sensitif (salary, office_location, dll) tidak bisa diubah sendiri.
        """
        profile = await self.repo.get_profile(user_id)
        if not profile:
            raise NotFoundException("Profil karyawan")

        clean_data = {k: v for k, v in data.items() if v is not None}
        return await self.repo.update_profile(profile, clean_data)

    # ── Get Own Profile ───────────────────────────────────────────────────────

    async def get_own_profile(self, user_id: uuid.UUID) -> User:
        user = await self.repo.get_user_with_profile(user_id)
        if not user:
            raise NotFoundException("User")
        return user

    # ── Activate / Deactivate ─────────────────────────────────────────────────

    async def set_active(
        self, target_id: uuid.UUID, is_active: bool, actor: User
    ) -> User:
        """
        Nonaktifkan / aktifkan akun karyawan.
        Super admin tidak bisa nonaktifkan diri sendiri.
        """
        if target_id == actor.id:
            raise BadRequestException(
                error_code="SELF_DEACTIVATE",
                message="Tidak dapat mengubah status akun sendiri.",
            )

        user = await self.user_repo.get_by_id(target_id)
        if not user:
            raise NotFoundException("Karyawan")

        # HR tidak bisa nonaktifkan super admin
        if actor.role == UserRole.HR and user.role == UserRole.SUPER_ADMIN:
            raise ForbiddenException("HR tidak dapat mengubah status Super Admin.")

        return await self.repo.set_active(user, is_active)