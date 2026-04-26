import uuid
from datetime import datetime, timezone, date
from enum import Enum as PyEnum
from sqlalchemy import Date, DateTime, Float, Text, Enum, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.config.database import Base

class AttendanceStatus(str, PyEnum):
    PRESENT = "present"
    LATE = "late"
    LEAVE = "leave"
    ALPHA = "alpha"

class Attendance(Base):
    __tablename__ = "attendances"
    __table_args__ = (
        # 1 karyawan hanya 1 record per hari
        UniqueConstraint("employee_id", "attendance_date", name="uq_attendance_per_day"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    employee_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True
    )
    office_location_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("office_locations.id", ondelete="SET NULL"),
        nullable=True
    )
    attendance_date: Mapped[date] = mapped_column(Date, nullable=False)

    # Clock-In
    clock_in_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    clock_in_lat: Mapped[float | None] = mapped_column(Float, nullable=True)
    clock_in_lng: Mapped[float | None] = mapped_column(Float, nullable=True)
    clock_in_photo_path: Mapped[str | None] = mapped_column(Text, nullable=True)
    clock_in_distance_meters: Mapped[float | None] = mapped_column(Float, nullable=True)

    # Clock-Out
    clock_out_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    clock_out_lat: Mapped[float | None] = mapped_column(Float, nullable=True)
    clock_out_lng: Mapped[float | None] = mapped_column(Float, nullable=True)
    clock_out_photo_path: Mapped[str | None] = mapped_column(Text, nullable=True)

    status: Mapped[AttendanceStatus] = mapped_column(
        Enum(AttendanceStatus), default=AttendanceStatus.ALPHA
    )
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

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
    employee: Mapped["User"] = relationship(back_populates="attendances")
    office_location: Mapped["OfficeLocation | None"] = relationship(
        back_populates="attendances"
    )

    def __repr__(self) -> str:
        return f"<Attendance {self.employee_id} | {self.attendance_date} | {self.status}>"