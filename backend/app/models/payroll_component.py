import uuid
from enum import Enum as PyEnum
from sqlalchemy import String, Enum, ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.config.database import Base


class ComponentType(str, PyEnum):
    ALLOWANCE = "allowance"    # tunjangan: transport, makan, jabatan, dll
    DEDUCTION = "deduction"    # potongan: BPJS, PPh21, kasbon, alpha, dll


class PayrollComponent(Base):
    __tablename__ = "payroll_components"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    payroll_record_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("payroll_records.id", ondelete="CASCADE"),
        index=True,
    )
    name: Mapped[str] = mapped_column(String(100))    # "Tunjangan Transport", "BPJS TK", dll
    type: Mapped[ComponentType] = mapped_column(Enum(ComponentType))
    amount: Mapped[float] = mapped_column(Numeric(15, 2))

    # Relationships
    payroll_record: Mapped["PayrollRecord"] = relationship(back_populates="components")

    def __repr__(self) -> str:
        return f"<PayrollComponent {self.name} | {self.type} | {self.amount}>"