import uuid
from sqlalchemy import String, Integer, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.config.database import Base

class LeaveType(Base):
    __tablename__ = "leave_types"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    name: Mapped[str] = mapped_column(String(100), unique=True)
    max_days_per_year: Mapped[int] = mapped_column(Integer, default=12)
    requires_document: Mapped[bool] = mapped_column(Boolean, default=False)
    is_paid: Mapped[bool] = mapped_column(Boolean, default=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Relationship
    leave_request: Mapped[list["LeaveRequest"]] = relationship(
        back_populates="leave_type", lazy="select"
    )

    def __repr__(self) -> str:
        return f"<LeaveType {self.name} | {self.max_days_per_year}>"