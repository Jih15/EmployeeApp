import uuid
from datetime import datetime, date
from typing import Optional

from pydantic import BaseModel, field_validator

from app.models.payroll_component import ComponentType
from app.models.payroll_period import PayrollPeriodStatus
from app.models.payroll_record import PayrollRecordStatus


# ── Payroll Period ─────────────────────────────────────────────────────────────

class PayrollPeriodCreateRequest(BaseModel):
    month: int
    year: int

    @field_validator("month")
    @classmethod
    def validate_month(cls, v: int) -> int:
        if not 1 <= v <= 12:
            raise ValueError("Bulan harus antara 1 dan 12.")
        return v

    @field_validator("year")
    @classmethod
    def validate_year(cls, v: int) -> int:
        if v < 2020 or v > 2100:
            raise ValueError("Tahun tidak valid.")
        return v


class PayrollPeriodResponse(BaseModel):
    id: uuid.UUID
    month: int
    year: int
    start_date: date
    end_date: date
    status: PayrollPeriodStatus
    finalized_at: Optional[datetime] = None
    finalized_by: Optional[uuid.UUID] = None
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Payroll Component ──────────────────────────────────────────────────────────

class PayrollComponentRequest(BaseModel):
    """Tambah/edit komponen tunjangan atau potongan manual."""
    name: str
    type: ComponentType
    amount: float

    @field_validator("amount")
    @classmethod
    def validate_amount(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("Amount harus lebih dari 0.")
        return v


class PayrollComponentResponse(BaseModel):
    id: uuid.UUID
    payroll_record_id: uuid.UUID
    name: str
    type: ComponentType
    amount: float

    model_config = {"from_attributes": True}


# ── Payroll Record ─────────────────────────────────────────────────────────────

class PayrollRecordResponse(BaseModel):
    id: uuid.UUID
    employee_id: uuid.UUID
    period_id: uuid.UUID

    base_salary: float
    working_days: int
    present_days: int
    leave_days: int
    alpha_days: int

    gross_salary: float
    total_allowances: float
    total_deductions: float
    net_salary: float

    status: PayrollRecordStatus
    paid_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    components: list[PayrollComponentResponse] = []

    model_config = {"from_attributes": True}


class PayrollRecordListResponse(BaseModel):
    data: list[PayrollRecordResponse]
    total: int
    skip: int
    limit: int


class PayrollSummaryResponse(BaseModel):
    """
    Summary slip gaji untuk Flutter — ditampilkan di payslip screen.
    Breakdown komponen dipisah per type agar mudah di-render.
    """
    record: PayrollRecordResponse
    allowances: list[PayrollComponentResponse]
    deductions: list[PayrollComponentResponse]
    period: PayrollPeriodResponse