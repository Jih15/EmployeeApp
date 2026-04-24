from fastapi import Depends, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from app.config.database import get_db
from app.core.security import decode_token
from app.core.exceptions import UnauthorizedException, ForbiddenException, NotFoundException
from app.models.user import UserRole
from app.repositories.user_repository import UserRepository

bearer_scheme = HTTPBearer(auto_error=False)

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(bearer_scheme),
    db: AsyncSession = Depends(get_db),
):
    if not credentials:
        raise UnauthorizedException("Token tidak ditemukan.")

    payload = await decode_token(credentials.credentials)
    user_id = payload.get("sub")

    if not user_id or payload.get("type") != "access":
        raise UnauthorizedException()

    repo = UserRepository(db)

    # ✅ Hanya load kolom auth — tidak ada join ke profile/face
    user = await repo.get_by_id(user_id)

    if not user:
        raise NotFoundException("User")
    if not user.is_active:
        raise UnauthorizedException("Akun Anda telah dinonaktifkan.")

    return user


def require_roles(*roles: UserRole):
    """
    Factory dependency: batasi akses berdasarkan role.

    Penggunaan di endpoint:
        current_user = Depends(require_roles(UserRole.SUPER_ADMIN, UserRole.HR))
    """
    async def role_checker(current_user=Depends(get_current_user)):
        if current_user.role not in roles:
            raise ForbiddenException(
                f"Hanya {', '.join(r.value for r in roles)} yang dapat mengakses ini."
            )
        return current_user
    return role_checker

# Shortcut Dependencies
async def get_current_active_user(current_user=Depends(get_current_user)):
    return current_user

async def get_super_admin(current_user=Depends(require_roles(UserRole.SUPER_ADMIN))):
    return current_user

async def get_hr_or_above(current_user=Depends(require_roles(UserRole.SUPER_ADMIN, UserRole.HR))):
    return current_user

async def get_current_user_with_profile(
  current_user=Depends(get_current_user),
  db: AsyncSession = Depends(get_db)      
):
    """
    Gunakan dependency ini hanya di endpoint yang butuh data profile.
    Misal: update profile, tampil profil lengkap.
    """
    repo = UserRepository(db)
    return await repo.get_with_profile(current_user.id)    

async def get_current_user_with_face(
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Gunakan dependency ini hanya di endpoint attendance.
    Load face_data secara eksplisit — tidak ikut tiap request.
    """
    repo = UserRepository(db)
    return await repo.get_with_face_data(current_user.id)