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
    id: Mapped[uuid.UUID] = mapped_column(
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

    attendances: Mapped[list["Attendance"]] = relationship(
        back_populates="employee",
        foreign_keys="Attendance.employee_id"
    )

    leave_requests: Mapped[list["LeaveRequest"]] = relationship(
        back_populates="employee",
        foreign_keys="LeaveRequest.employee_id"
    )

    reviewed_leaves: Mapped[list["LeaveRequest"]] = relationship(
        back_populates="reviewer",
        foreign_keys="LeaveRequest.reviewed_by"
    )

    payroll_records: Mapped[list["PayrollRecord"]] = relationship(
        back_populates="employee",
        foreign_keys="PayrollRecord.employee_id"
    )

    finalized_periods: Mapped[list["PayrollPeriod"]] = relationship(
        back_populates="finalizer",
        foreign_keys="PayrollPeriod.finalized_by"
    )
    
    registered_face_data: Mapped[list["EmployeeFaceData"]] = relationship(
        back_populates="registrar",
        foreign_keys="EmployeeFaceData.registered_by"
    )

    def __repr__(self) -> str:
        return f"<User {self.id} | {self.role}>"