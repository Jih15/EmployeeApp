import uuid 
from datetime import datetime, timezone
from sqlalchemy import String, Float, Boolean, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.config.database import Base


class OfficeLocation(Base):
    __tablename__ = "office_locations"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(100))
    address: Mapped[str | None] = mapped_column(Text, nullable=True)
    latitude: Mapped[float] = mapped_column(Float)
    longitude: Mapped[float] = mapped_column(Float)
    radius_meters: Mapped[float] = mapped_column(Float, default=100.0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Timestamp 
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    employees: Mapped[list["EmployeeProfile"]] = relationship(
        back_populates="office_location", lazy="select"
    )

    attendances: Mapped[list["Attendance"]] = relationship(
        back_populates="office_location", lazy="select"
    )

    def __repr__(self):
        return f"<OfficeLocation {self.name}>"