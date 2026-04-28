from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse

from app.config.settings import settings
from app.core.exceptions import AppException
import app.models

# Import Routers
from app.routers import auth_routers


# Lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    from app.core.security import get_redis
    await get_redis()
    print(f"[{settings.APP_NAME}] v{settings.APP_VERSION} started — {settings.ENVIRONMENT}")
    yield

    # Shutdown
    from app.core.security import redis_client
    if redis_client:
        await redis_client.aclose()


# App Instance

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    docs_url="/docs" if not settings.is_production else None,
    redoc_url="/redoc" if not settings.is_production else None,
    lifespan=lifespan
)

# Middleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],    
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.ALLOWED_HOSTS
)

# Global Exception Handler
@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    """
    Semua AppException → format JSON konsisten.
    Flutter bisa selalu expect struktur yang sama untuk error handling.
    """
    return JSONResponse(
        status_code=exc.status_code,
        content=exc.detail
    )   

# Routers
app.include_router(auth_routers.router, prefix="/api/v1")

# Health Check
@app.get("/health", tags=["Health"])
async def health():
    return {"statis": "ok", "version": settings.APP_VERSION}