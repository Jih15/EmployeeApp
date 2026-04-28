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
        ForeignKey("users.id", ondelete="CASCADE"),
        primary_key=True
    )

    photo_path: Mapped[str | None] = mapped_column(Text, nullable=True)
    encoding: Mapped[str | None] = mapped_column(Text, nullable=True) #JSON Array

    # Audit Trail 
    registered_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    registered_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),  
        nullable=True
    )
    last_updated_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    # Relationship
    user: Mapped["User"] = relationship(
        back_populates="face_data",
        foreign_keys=[employee_id]
    )
    registrar: Mapped["User | None"] = relationship(
        back_populates="registered_face_data",
        foreign_keys=[registered_by]
    )

