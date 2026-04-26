import uuid
from datetime import datetime, timezone, date
from enum import Enum as PyEnum
from sqlalchemy import Integer, Date, DateTime, Enum, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.config.database import Base


class PayrollPeriodStatus(str, PyEnum):
    OPEN = "open"
    PROCESSING = "processing"
    FINALIZED = "finalized"

class PayrollPeriod(Base):
    __tablename__ = "payroll_periods"
    __table_args__ = (
        UniqueConstraint("month", "year", name="uq_period_month_year"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    month: Mapped[int] = mapped_column(Integer)
    year: Mapped[int] = mapped_column(Integer)
    start_date: Mapped[date] = mapped_column(Date)
    end_date: Mapped[date] = mapped_column(Date)
    status: Mapped[PayrollPeriodStatus] = mapped_column(
        Enum(PayrollPeriodStatus), default=PayrollPeriodStatus.OPEN
    )

    finalized_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    finalized_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True
    )

    # Timestamp
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )


    # Relationship
    records: Mapped[list["PayrollRecord"]] = relationship(
        back_populates="period", lazy="select"
    )

    finalizer: Mapped["User | None"] = relationship(
        back_populates="finalized_periods"
    )

    def __repr__(self) -> str:
        return f"<PayrollPeriod {self.month}/{self.year} | {self.status}>"