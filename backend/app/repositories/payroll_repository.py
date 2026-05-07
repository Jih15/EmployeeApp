import uuid
from typing import Optional

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.payroll_component import PayrollComponent
from app.models.payroll_period import PayrollPeriod
from app.models.payroll_record import PayrollRecord, PayrollRecordStatus


# ── Payroll Period ─────────────────────────────────────────────────────────────

class PayrollPeriodRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> list[PayrollPeriod]:
        result = await self.db.execute(
            select(PayrollPeriod).order_by(
                PayrollPeriod.year.desc(), PayrollPeriod.month.desc()
            )
        )
        return list(result.scalars().all())

    async def get_by_id(self, period_id: uuid.UUID) -> Optional[PayrollPeriod]:
        result = await self.db.execute(
            select(PayrollPeriod).where(PayrollPeriod.id == period_id)
        )
        return result.scalar_one_or_none()

    async def get_by_month_year(self, month: int, year: int) -> Optional[PayrollPeriod]:
        result = await self.db.execute(
            select(PayrollPeriod).where(
                PayrollPeriod.month == month,
                PayrollPeriod.year == year,
            )
        )
        return result.scalar_one_or_none()

    async def create(self, data: dict) -> PayrollPeriod:
        period = PayrollPeriod(**data)
        self.db.add(period)
        await self.db.flush()
        await self.db.refresh(period)
        return period

    async def update(self, period: PayrollPeriod, data: dict) -> PayrollPeriod:
        for field, value in data.items():
            if hasattr(period, field):
                setattr(period, field, value)
        await self.db.flush()
        await self.db.refresh(period)
        return period


# ── Payroll Record ─────────────────────────────────────────────────────────────

class PayrollRecordRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, record_id: uuid.UUID) -> Optional[PayrollRecord]:
        result = await self.db.execute(
            select(PayrollRecord)
            .options(selectinload(PayrollRecord.components))
            .where(PayrollRecord.id == record_id)
        )
        return result.scalar_one_or_none()

    async def get_by_employee_period(
        self, employee_id: uuid.UUID, period_id: uuid.UUID
    ) -> Optional[PayrollRecord]:
        result = await self.db.execute(
            select(PayrollRecord)
            .options(selectinload(PayrollRecord.components))
            .where(
                PayrollRecord.employee_id == employee_id,
                PayrollRecord.period_id == period_id,
            )
        )
        return result.scalar_one_or_none()

    async def get_all(
        self,
        skip: int = 0,
        limit: int = 20,
        period_id: Optional[uuid.UUID] = None,
        employee_id: Optional[uuid.UUID] = None,
        status: Optional[PayrollRecordStatus] = None,
    ) -> tuple[list[PayrollRecord], int]:
        base_query = select(PayrollRecord)

        if period_id:
            base_query = base_query.where(PayrollRecord.period_id == period_id)
        if employee_id:
            base_query = base_query.where(PayrollRecord.employee_id == employee_id)
        if status:
            base_query = base_query.where(PayrollRecord.status == status)

        count_result = await self.db.execute(
            select(func.count()).select_from(base_query.subquery())
        )
        total = count_result.scalar_one()

        result = await self.db.execute(
            base_query
            .options(selectinload(PayrollRecord.components))
            .order_by(PayrollRecord.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all()), total

    async def get_my_records(
        self,
        employee_id: uuid.UUID,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[PayrollRecord], int]:
        base_query = (
            select(PayrollRecord)
            .where(PayrollRecord.employee_id == employee_id)
        )

        count_result = await self.db.execute(
            select(func.count()).select_from(base_query.subquery())
        )
        total = count_result.scalar_one()

        result = await self.db.execute(
            base_query
            .options(selectinload(PayrollRecord.components))
            .order_by(PayrollRecord.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all()), total

    async def create(self, data: dict) -> PayrollRecord:
        record = PayrollRecord(**data)
        self.db.add(record)
        await self.db.flush()
        await self.db.refresh(record)
        return record

    async def update(self, record: PayrollRecord, data: dict) -> PayrollRecord:
        for field, value in data.items():
            if hasattr(record, field):
                setattr(record, field, value)
        await self.db.flush()
        await self.db.refresh(record)
        return record


# ── Payroll Component ──────────────────────────────────────────────────────────

class PayrollComponentRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, component_id: uuid.UUID) -> Optional[PayrollComponent]:
        result = await self.db.execute(
            select(PayrollComponent).where(PayrollComponent.id == component_id)
        )
        return result.scalar_one_or_none()

    async def create(self, data: dict) -> PayrollComponent:
        component = PayrollComponent(**data)
        self.db.add(component)
        await self.db.flush()
        await self.db.refresh(component)
        return component

    async def delete(self, component: PayrollComponent) -> None:
        await self.db.delete(component)
        await self.db.flush()