"""
Alembic env.py — async-compatible dengan asyncpg.

Cara pakai:
    # Generate migration dari model (pastikan semua model diimport di app/models/__init__.py)
    alembic revision --autogenerate -m "nama_migration"

    # Apply migration
    alembic upgrade head

    # Rollback 1 step
    alembic downgrade -1
"""
import asyncio
from logging.config import fileConfig

from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

from alembic import context

# Import settings & Base — harus sebelum import models
from app.config.settings import settings
from app.config.database import Base

# Import semua model agar metadata lengkap saat autogenerate
import app.models  # noqa: F401

config = context.config

# Override URL dari settings — jangan hardcode di alembic.ini
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


# ── Offline Mode ───────────────────────────────────────────────────────────────

def run_migrations_offline() -> None:
    """
    Offline mode: generate SQL script tanpa koneksi DB.
    Berguna untuk review SQL sebelum apply, atau deploy ke production.
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        # Render enum as native PostgreSQL ENUM, bukan VARCHAR
        render_as_batch=False,
    )
    with context.begin_transaction():
        context.run_migrations()


# ── Online Mode ────────────────────────────────────────────────────────────────

def do_run_migrations(connection: Connection) -> None:
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        # compare_type=True agar alembic deteksi perubahan kolom type
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    """Online mode dengan async engine — wajib karena kita pakai asyncpg."""
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,  # NullPool untuk migration — tidak butuh connection pool
    )
    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)
    await connectable.dispose()


def run_migrations_online() -> None:
    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()