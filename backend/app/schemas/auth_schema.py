import uuid
from datetime import datetime
from pydantic import BaseModel, EmailStr, field_validator
from app.config.settings import settings
from app.models.user import UserRole

# Request schemas

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RefreshRequest(BaseModel):
    refresh_token: str

class RegisterRequest(BaseModel):
    """Hanya super admin bisa hit endpoint ini"""
    email: EmailStr
    password: str
    role: UserRole = UserRole.EMPLOYEE

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        min_len = settings.PASSWORD_MIN_LENGTH
        if len(v) < min_len:
            raise ValueError(f"Password minimal {min_len} karakter.")
        return v
    
class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, v: str) -> str:
        if len(v) < settings.PASSWORD_MIN_LENGTH:
            raise ValueError(f"Password baru minimal {settings.PASSWORD_MIN_LENGTH} karakter.")
        return v
    

# Response Schemas
class UserResponse(BaseModel):
    id: uuid.UUID
    email: str
    role: UserRole
    is_active: bool
    is_verified: bool
    created_at: datetime

    model_config = {
        "from_attributes" : True
    }

class TokenResponse(BaseModel):
    """Response login - Flutter simpan kedua token di secure storage."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse

class AccessTokenResponse(BaseModel):
    """Response refresh - hanya issue access token baru + rotasi refresh token."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"