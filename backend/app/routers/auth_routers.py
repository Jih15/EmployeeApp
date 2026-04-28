from fastapi import APIRouter, Depends, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.database import get_db
from app.core.dependencies import get_current_user, get_super_admin
from app.schemas.auth_schemas import (
    LoginRequest, TokenResponse, RefreshRequest, AccessTokenResponse,
    RegisterRequest, ChangePasswordRequest, UserResponse
)
from app.services.auth_services import AuthService

router = APIRouter(prefix="/auth", tags=["Auth"])
bearer_scheme = HTTPBearer()

# Login
@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Login dan dapatkan access + refresh token",
)
async def login(
    body: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    service = AuthService(db)
    result = await service.login(body.email, body.password)
    return result

# Logout
@router.post(
    "/logout", 
    status_code=status.HTTP_200_OK,
    summary="Logout - blacklist access token aktif",
)
async def logout(
    credentials: HTTPAuthorizationCredentials = Security(bearer_scheme),
    db: AsyncSession = Depends(get_db)
):
    """
    Flutter wajib:
    1. Kirim access token di header Authorization
    2. Hapus refresh token dari secure storage secara lokal
    """
    service = AuthService(db)
    await service.logout(credentials.credentials)
    return {
        "message" : "Logout Berhasil."
    }

@router.post(
    "/refresh",
    response_model=AccessTokenResponse,
    summary="Issue token baru via refresh token (rotations)",
)
async def refresh(
    body: RefreshRequest, 
    db: AsyncSession = Depends(get_db),
):
    """
    Refresh token rotation — setiap refresh menghasilkan refresh token baru.
    Flutter wajib simpan refresh token baru dan buang yang lama.
    """
    service = AuthService(db)
    return await service.refresh(body.refresh_token)

@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="[Super Admin] Buat akun user baru.",
)
async def register(
    body: RegisterRequest,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_super_admin),
):
    """
    Hanya Super Admin yang dapat membuat akun.
    Setelah akun dibuat, data profil karyawan diisi via POST /employees/{id}/profile.    
    """
    service = AuthService(db)
    return await service.register(body.email, body.password, body.role)

@router.get(
    "/me",
    response_model=UserResponse,
    summary="Ambil data user yang sedang login",
)
async def me(current_user=Depends(get_current_user)):
    return current_user

@router.put(
    "/change-password",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Ganti password - semua role bisa akses"
)
async def change_password(
    body: ChangePasswordRequest,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = AuthService(db)
    await service.change_password(current_user, body.old_password, body.new_password)