import uuid 
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User, UserRole
from app.models.employee_profile import EmployeeProfile


class EmployeeRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    # Lookups
    async def get_user_with_profile(self, user_id:uuid.UUID)-> User | None:
        result = await self.db.execute(
            select(User).options(selectinload(User.profile)).where(User.id == user_id)
        )
        return result.scalar_one_or_none()
    
    async def get_all_with_profile(
        self,
        skip: int = 0,
        limit: int = 20,
        role: UserRole | None = None,
        is_active: bool | None = None
    ) -> tuple[list[User], int]:
        """Return (users, total_count) untuk pagination."""
        query = select(User).options(selectinload(User.profile))

        if role is not None:
            query = query.where(User.role == role)
        if is_active is not None:
            query = query.where(User.is_active == is_active)

        # Total Count
        count_result = await self.db.execute(
            select(func.count()).select_from(query.subquery())
        )
        total = count_result.scalar_one()

        # Paginated result
        result = await self.db.execute(
            query.order_by(User.created_at.desc()).offset(skip).limit(limit)
        )
        users = result.scalars().all()

        return list(users), total

    async def get_profile(self, user_id: uuid.UUID) -> EmployeeProfile | None:
        result = await self.db.execute(
            select(EmployeeProfile).where(EmployeeProfile.employee_id == user_id)
        )
        return result.scalar_one_or_none()
 
    async def employee_number_exists(self, employee_number: str) -> bool:
        result = await self.db.execute(
            select(EmployeeProfile.employee_id).where(
                EmployeeProfile.employee_number == employee_number
            )
        )
        return result.scalar_one_or_none() is not None
 
    # ── Write ──────────────────────────────────────────────────────────────────
 
    async def create_profile(self, user_id: uuid.UUID, data: dict) -> EmployeeProfile:
        profile = EmployeeProfile(employee_id=user_id, **data)
        self.db.add(profile)
        await self.db.flush()
        await self.db.refresh(profile)
        return profile
 
    async def update_profile(self, profile: EmployeeProfile, data: dict) -> EmployeeProfile:
        for field, value in data.items():
            if hasattr(profile, field):
                setattr(profile, field, value)
        await self.db.flush()
        await self.db.refresh(profile)
        return profile
 
    async def set_active(self, user: User, is_active: bool) -> User:
        user.is_active = is_active
        await self.db.flush()
        return user