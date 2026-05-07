import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse

from app.config.settings import settings
from app.core.exceptions import AppException

from app.routers import (
    attendances_router, 
    auth_router, 
    employee_router, 
    face_data_router, 
    leave_request_router, 
    leave_type_router, 
    office_location_router, 
    payroll_router
)

logger = logging.getLogger(__name__)


# ── Lifespan ───────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up %s v%s [%s]", settings.APP_NAME, settings.APP_VERSION, settings.ENVIRONMENT)
    yield
    # Graceful shutdown — tutup Redis connection pool
    from app.core.security import redis_client
    if redis_client:
        await redis_client.aclose()
    logger.info("Shutdown complete.")


# ── App ────────────────────────────────────────────────────────────────────────

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
    docs_url="/docs" if not settings.is_production else None,
    redoc_url="/redoc" if not settings.is_production else None,
    lifespan=lifespan,
)


# ── Middleware ─────────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.ALLOWED_HOSTS,
)


# ── Exception Handlers ─────────────────────────────────────────────────────────
# Urutan penting — FastAPI match dari yang paling spesifik ke paling umum:
#   RequestValidationError → 422
#   AppException           → 4xx (unwrap detail ke root)
#   Exception              → 500

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Konversi Pydantic validation error ke format error standar kita.
    Flutter expect struktur { error_code, message, details } yang konsisten.
    """
    errors = [
        {
            "field": ".".join(str(loc) for loc in e["loc"] if loc != "body"),
            "message": e["msg"].replace("Value error, ", ""),
        }
        for e in exc.errors()
    ]
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error_code": "VALIDATION_ERROR",
            "message": "Data yang dikirim tidak valid.",
            "details": errors,
        },
    )


@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    """
    Flatten AppException.detail ke root response.
    Tanpa ini FastAPI wrap jadi {"detail": {"error_code": ...}}
    — Flutter tidak expect struktur itu.

    Semua subclass (NotFoundException, ConflictException, dll)
    tertangkap di sini karena extends AppException.
    """
    return JSONResponse(status_code=exc.status_code, content=exc.detail)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    """
    Tangkap semua error tak terduga.
    Jangan leak stack trace ke client — log saja di server.
    """
    logger.exception("Unhandled exception on %s %s", request.method, request.url.path)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error_code": "INTERNAL_ERROR",
            "message": "Terjadi kesalahan internal. Silakan coba lagi.",
            "details": None,
        },
    )


# ── Routers ────────────────────────────────────────────────────────────────────

PREFIX = "/api/v1"

app.include_router(auth_router.router, prefix=PREFIX)
app.include_router(employee_router.router, prefix=PREFIX)
app.include_router(office_location_router.router, prefix=PREFIX)
app.include_router(face_data_router.router, prefix=PREFIX)
app.include_router(attendances_router.router, prefix=PREFIX)
app.include_router(leave_type_router.router, prefix=PREFIX)
app.include_router(leave_request_router.router, prefix=PREFIX)
app.include_router(payroll_router.router, prefix=PREFIX)
 
 
# ── Health ─────────────────────────────────────────────────────────────────────

@app.get("/health", tags=["Health"], include_in_schema=not settings.is_production)
async def health_check():
    return {"status": "ok", "app": settings.APP_NAME, "version": settings.APP_VERSION}