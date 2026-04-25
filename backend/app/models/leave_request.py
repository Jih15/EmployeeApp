import uuid
from datetime import datetime, timezone, date
from enum import Enum as PyEnum
from sqlalchemy import Date, DateTime, Integer, Text, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.config.database import Base

class LeaveStatus(str, PyEnum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    CANCELLED = "cancelled"

class LeaveRequest(Base):
    __tablename__ = "leave_requests"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    employee_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("users.user_id", ondelete="CASCADE"),
        index=True
    )

    leave_type_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("leave_types.id", ondelete="RESTRICT"),
        index=True
    )

    start_date: Mapped[date] = mapped_column(date)
    end_date: Mapped[date] = mapped_column(date)
    total_days: Mapped[int] = mapped_column(Integer)
    reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    document_path: Mapped[str | None] = mapped_column(Text, nullable=True)

    status: Mapped[LeaveStatus] = mapped_column(
        Enum(LeaveStatus), default=LeaveStatus.PENDING, index=True
    )

    # Review
    reviewed_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("users.user_id", ondelete="SET NULL"), 
        nullable=True
    )
    reviewed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    review_notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Timestamp
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda : datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )


    # Relationship
    employee: Mapped["User"] = relationship(
        back_populates="leave_requests", 
        foreign_keys=[employee_id]
    )

    reviewer: Mapped["User | None"] = relationship(
        back_populates="reviewed_leaves",
        foreign_keys=[reviewed_by]
    )

    leave_type: Mapped["LeaveType"] = relationship(
        back_populates="leave_requests"
    )

    def __repr__(self)-> str:
        return f"<LeaveRequest {self.employee_id} | {self.start_date} -> {self.end_date} | {self.status}>"