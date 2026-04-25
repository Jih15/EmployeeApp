import uuid
from datetime import datetime, timezone
from enum import Enum as PyEnum
from sqlalchemy import Integer, DateTime, Enum, ForeignKey, Numeric, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.config.database import Base


class PayrollRecordStatus(str, PyEnum):
    DRAFT = "draft"
    APPROVED = "approved"
    PAID = "paid"

class PayrollRecord(Base):
    __tablename__ = "payroll_records"
    __table_args__ = (
        # 1 karyawan 1 record per period
        UniqueConstraint("employee_id", "period_id", name="uq_payroll_employee_period")
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    employee_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id", ondelete="RESTRICT"),
        index=True
    )
    period_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("payroll_periods.id", ondelete="RESTRICT"),
        index=True
    )

    # Snapshot gaji pokok saat itu (bukan FK ke profile agar historis terjaga)
    base_salary: Mapped[float] = mapped_column(Numeric(15, 2))

    # Rekap Kehadiran dari attendances
    working_days: Mapped[int] = mapped_column(Integer, default=0) #Total hari kerja periode
    present_days: Mapped[int] = mapped_column(Integer, default=0)
    leave_days: Mapped[int] = mapped_column(Integer, default=0)
    alpha_days: Mapped[int] = mapped_column(Integer, default=0)

    # Kalkulasi
    gross_salary: Mapped[float] = mapped_column(Numeric(15, 2), default=0)
    total_allowances: Mapped[float] = mapped_column(Numeric(15 ,2), default=0)
    total_deductions: Mapped[float] = mapped_column(Numeric(15 ,2), default=0)
    net_salary: Mapped[float] = mapped_column(Numeric(15 ,2), default=0)

    status: Mapped[PayrollRecordStatus] = mapped_column(
        Enum(PayrollRecordStatus), default=PayrollRecordStatus.DRAFT
    )

    # Timestamp
    paid_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )


    # Relationship
    employee: Mapped["User"] = relationship(back_populates="payroll_records")
    period: Mapped["PayrollPeriod"] = relationship(back_populates="records")
    components: Mapped[list["PayrollComponent"]] = relationship(
        back_populates="payroll_record",
        cascade="all, delete-orphan",
        lazy="select"
    )

    def __repr__(self) -> str:
        return f"<PayrollRecord {self.employee_id} | period={self.period_id} | net={self.net_salary}>"