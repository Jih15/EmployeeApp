import uuid
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import (
    NotFoundException,
    ConflictException,
    BadRequestException,
    ForbiddenException
)

from app.models.user import User, UserRole
from app.models.employee_profile import EmployeeProfile
from app.repositories.employee_repository import EmployeeRepository
from app.repositories.user_repository import UserRepository


class EmployeeService: 
    def __init__(self, db: AsyncSession):
        self.repo = EmployeeRepository(db)
        self.user_repo = UserRepository(db)

    # List
    async def get_all(
        self,
        skip: int = 0,
        limit: int = 20,
        role: UserRole | None = None,
        is_active: bool | None = None,
    )-> dict:
        users, total = await self.repo.get_all_with_profile(skip, limit, role, is_active)
        return {
            "data": users,
            "total": total,
            "skip": skip,
            "limit": limit
        }
    
    # Detail
    async def get_by_id(self, user_id: uuid.UUID) -> User:
        user = await self.repo.get_user_with_profile(user_id)
        if not user: 
            raise NotFoundException("Karyawan")
        return user
    
    # Create Profile
    async def create_profile(self, user_id: uuid.UUID, data: dict) -> EmployeeProfile:
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            raise NotFoundException("User")
        
        # Cek profil sudah ada
        existing = await self.repo.get_profile(user_id)
        if existing:
            raise ConflictException("Profil karyawan sudah ada. Gunakan PUT untuk update.")
        
        # Cek employee_number uniq
        emp_number = data.get("employee_number")
        if emp_number and await self.repo.employee_number_exists(emp_number):
            raise ConflictException(f"Employee Number '{emp_number}' sudah digunakan.")
        
        return await self.repo.create_profile(user_id, data)
    
    # Update Profile (HR/Admin)
    async def update_profile(self, user_id: uuid.UUID, data: dict) -> EmployeeProfile:
        profile = await self.repo.get_profile(user_id)
        if not profile:
            raise NotFoundException("Profil karyawan")
        
        # Kalau employee_number diubah, unique check
        new_number = data.get("employee_number")
        if new_number and new_number != profile.employee_number:
            if await self.repo.employee_number_exists(new_number):
                raise ConflictException(f"Employee number '{new_number}' sudah digunakan.")
            
        # Buang field none agar tidak overwrite data yang ada
        clean_data = {k: v for k, v in data.items() if v is not None}
        return await self.repo.update_profile(profile,clean_data)
    
    # Update Profile Self
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
    
    # Get own profile
    async def get_own_profile(self, user_id: uuid.UUID) -> User:
        user = await self.repo.get_user_with_profile(user_id)
        if not user:
            raise NotFoundException("User")
        return user
    
    # Deactivate
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
                message="Tidak dapat mengubah status akun sendiri."
            )
        
        user  =await self.user_repo.get_by_id(target_id)
        if not user:
            raise NotFoundException("Karyawan")
        

        # HR tidak bisa nonaktifkan superadmin
        if actor.role == UserRole.HR and user.role == UserRole.SUPER_ADMIN:
            raise ForbiddenException("HR Tidak dapat mengubah status Super Admin.")
        
        return await self.repo.set_active(user, is_active)