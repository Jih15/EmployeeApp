import uuid
from datetime import datetime, timezone
from enum import Enum as PyEnum
from sqlalchemy import String, Boolean, DateTime, Enum, Text, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.config.database import Base

class UserRole(str, PyEnum):
    SUPER_ADMIN = "super_admin"
    HR = "hr"
    EMPLOYEE = "employee"

class User(Base):
    __tablename__ = "users"

    # PK
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), default=UserRole.EMPLOYEE)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # Timestamp
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )


    # Relationship
    profile: Mapped["EmployeeProfile | None"] = relationship(
        back_populates="user",
        uselist=False,
        lazy="select"
    )

    face_data: Mapped["EmployeeFaceData | None"] = relationship(
        back_populates="user",
        uselist=False,
        lazy="select"
    )

    def __repr__(self) -> str:
        return f"<User {self.user_id} | {self.role}>"