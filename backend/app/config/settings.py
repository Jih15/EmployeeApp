from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
from functools import lru_cache

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False        
    )

    # App
    APP_NAME: str = "Employee Management API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"

    # Database
    DATABASE_URL: str
    DATABASE_POOL_SIZE: int = 10
    DATABASE_MAX_OVERFLOW: int = 20

    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    PASSWORD_MIN_LENGTH: int = 8

    # Redis (token blacklist & rate limit)
    REDIS_URL: str = "redis://localhost:6379/0"

    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost"]
    ALLOWED_HOSTS: List[str] = ["*"]

    # File Upload
    MAX_UPLOAD_SIZE_MB: int = 5
    ALLOWED_IMAGE_TYPE: List[str] = ["image/jpeg", "image/png", "image/webp"]
    UPLOAD_DIR: str = "uploads"

    # Face Recognition
    FACE_RECOGNITION_TOLERANCE: float = 0.5
    FACE_RECOGNITION_MODEL: str = "hog" #hog (cpu) | cnn (gpu)

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    AUTH_RATE_LIMIT_PER_MINUTE: int = 10

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"
    
    @property
    def is_development(self) -> bool:
        return self.ENVIRONMENT == "development"
    
@lru_cache
def get_settings() -> Settings:
    """Cached — hanya instansiasi sekali selama app berjalan."""
    return Settings()

settings = get_settings()