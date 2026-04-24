import uuid
from datetime import datetime, timezone
from sqlalchemy import Text, DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.config.database import Base

class EmployeeFaceData(Base):
    __tablename__ = "employee_face_data"

    employee_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id", ondelete="CASCADE"),
        primary_key=True
    )

    photo_path: Mapped[str | None] = mapped_column(Text, nullable=True)
    encoding: Mapped[str | None] = mapped_column(Text, nullable=True) #JSON Array

    # Audit Trail 
    registered_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    registered_at: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), nullable=True # ID HR
    )
    last_updated_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    # Relationship
    user: Mapped["User"] = relationship(back_populates="face_data")