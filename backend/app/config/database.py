from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from app.config.settings import settings

# Engine
engine = create_async_engine(
    settings.DATABASE_URL,
    pool_size = settings.DATABASE_POOL_SIZE,
    max_overflow = settings.DATABASE_MAX_OVERFLOW,
    pool_pre_ping=True,
    echo=settings.DEBUG,
)

# Session Factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

# Base Model
class Base(DeclarativeBase):
    pass

# Dependency
async def get_db() -> AsyncSession:
    """
    Dependency yang dipakai di setiap endpoint.
    Otomatis close session setelah request selesai.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()