import uuid
from datetime import datetime, timezone, date
from sqlalchemy import String, Float, DateTime, Date, ForeignKey, Text, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.config.database import Base

class EmployeeProfile(Base):
    __tablename__ = "employee_profiles"

    # FK ke Users sekaligus jadi PK (user_id sudah cukup jadi identifier)
    employee_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id", ondelete="CASCADE"),
        primary_key=True
    )

    # Identity
    employee_number: Mapped[str] = mapped_column(
        String(20), unique=True, index=True # EMP-001
    )
    full_name: Mapped[str] = mapped_column(String(255))
    phone: Mapped[str | None] = mapped_column(String(20), nullable=True)
    address: Mapped[str | None] = mapped_column(Text, nullable=True)
    birth_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    gender: Mapped[str | None] = mapped_column(String(10), nullable=True) # M/F

    # Job Info
    department: Mapped[str | None] = mapped_column(String(100), nullable=True)
    position: Mapped[str | None] = mapped_column(String(100), nullable=True)
    employment_type: Mapped[str] = mapped_column(
        String(20), default="full_time" # full_time | part_time | contract
    )
    join_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    end_date: Mapped[date | None] = mapped_column(Date, nullable=True) #resign | kontrak habis

    # Office Loc
    office_location_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("office_locations.id"),
        nullable=True
    )

    # Finance
    base_salary: Mapped[float] = mapped_column(Numeric(15, 2), default=0)
    bank_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    bank_account_number: Mapped[str | None] = mapped_column(String(50), nullable=True)
    bank_account_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    tax_id: Mapped[str | None] = mapped_column(String(30), nullable=True) #NPWP

    # Emergency Contact
    emergency_contact_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    emergency_contact_phone: Mapped[str | None] = mapped_column(String(20), nullable=True)
    emergency_contact_relation: Mapped[str | None] = mapped_column(String(50), nullable=True)

    # Timestamp
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )


    # Relationship
    user: Mapped["User"] = relationship(back_populates="profile")
    office_location: Mapped["OfficeLocation | None"] = relationship(
        back_populates="employees"
    )

    def __repr__(self)-> str:
        return f"<EmployeeProfile {self.employee_number or self.full_name}>"