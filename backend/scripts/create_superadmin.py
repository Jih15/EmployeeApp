import asyncio
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.config.database import AsyncSessionLocal
from app.repositories.user_repository import UserRepository
from app.core.security import hash_password
from app.models.user import UserRole

async def create_superadmin():
    email = input("Email: ")
    password = input("Password: ")

    async with AsyncSessionLocal() as session:
        try:
            await session.begin()
            repo = UserRepository(session)

            if await repo.email_exists(email):
                print(f"❌ Email {email} sudah terdaftar.")
                return

            user = await repo.create(
                email=email.lower().strip(),
                hashed_password=hash_password(password),
                role=UserRole.SUPER_ADMIN,
                is_active=True,
                is_verified=True,
            )
            await session.commit()
            print(f"✅ Super Admin berhasil dibuat!")
            print(f"   ID    : {user.id}")
            print(f"   Email : {user.email}")
            print(f"   Role  : {user.role}")
        except Exception as e:
            await session.rollback()
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(create_superadmin())