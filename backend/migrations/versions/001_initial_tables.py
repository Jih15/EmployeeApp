"""initial tables

Revision ID: 001
Revises:
Create Date: 2025-01-01 00:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ── Enums ──────────────────────────────────────────────────────────────────
    user_role = postgresql.ENUM("super_admin", "hr", "employee", name="userrole", create_type=False)
    user_role.create(op.get_bind(), checkfirst=True)

    attendance_status = postgresql.ENUM("present", "late", "leave", "alpha", name="attendancestatus", create_type=False)
    attendance_status.create(op.get_bind(), checkfirst=True)

    leave_status = postgresql.ENUM("pending", "approved", "rejected", "cancelled", name="leavestatus", create_type=False)
    leave_status.create(op.get_bind(), checkfirst=True)

    payroll_period_status = postgresql.ENUM("open", "processing", "finalized", name="payrollperiodstatus", create_type=False)
    payroll_period_status.create(op.get_bind(), checkfirst=True)

    payroll_record_status = postgresql.ENUM("draft", "approved", "paid", name="payrollrecordstatus", create_type=False)
    payroll_record_status.create(op.get_bind(), checkfirst=True)

    component_type = postgresql.ENUM("allowance", "deduction", name="componenttype", create_type=False)
    component_type.create(op.get_bind(), checkfirst=True)

    # ── users ──────────────────────────────────────────────────────────────────
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("role", sa.Enum("super_admin", "hr", "employee", name="userrole"), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("is_verified", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    # ── office_locations ───────────────────────────────────────────────────────
    op.create_table(
        "office_locations",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("address", sa.Text(), nullable=True),
        sa.Column("latitude", sa.Float(), nullable=False),
        sa.Column("longitude", sa.Float(), nullable=False),
        sa.Column("radius_meters", sa.Float(), nullable=False, server_default="100.0"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )

    # ── employee_profiles ──────────────────────────────────────────────────────
    op.create_table(
        "employee_profiles",
        sa.Column("employee_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("employee_number", sa.String(20), nullable=False),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("phone", sa.String(20), nullable=True),
        sa.Column("address", sa.Text(), nullable=True),
        sa.Column("birth_date", sa.Date(), nullable=True),
        sa.Column("gender", sa.String(10), nullable=True),
        sa.Column("department", sa.String(100), nullable=True),
        sa.Column("position", sa.String(100), nullable=True),
        sa.Column("employment_type", sa.String(20), nullable=False, server_default="full_time"),
        sa.Column("join_date", sa.Date(), nullable=True),
        sa.Column("end_date", sa.Date(), nullable=True),
        sa.Column("office_location_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("office_locations.id"), nullable=True),
        sa.Column("base_salary", sa.Numeric(15, 2), nullable=False, server_default="0"),
        sa.Column("bank_name", sa.String(100), nullable=True),
        sa.Column("bank_account_number", sa.String(50), nullable=True),
        sa.Column("bank_account_name", sa.String(255), nullable=True),
        sa.Column("tax_id", sa.String(30), nullable=True),
        sa.Column("emergency_contact_name", sa.String(255), nullable=True),
        sa.Column("emergency_contact_phone", sa.String(20), nullable=True),
        sa.Column("emergency_contact_relation", sa.String(50), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_employee_profiles_employee_number", "employee_profiles", ["employee_number"], unique=True)

    # ── employee_face_data ─────────────────────────────────────────────────────
    op.create_table(
        "employee_face_data",
        sa.Column("employee_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("photo_path", sa.Text(), nullable=True),
        sa.Column("encoding", sa.Text(), nullable=True),
        sa.Column("registered_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("registered_by", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("last_updated_at", sa.DateTime(timezone=True), nullable=True),
    )

    # ── leave_types ────────────────────────────────────────────────────────────
    op.create_table(
        "leave_types",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("max_days_per_year", sa.Integer(), nullable=False, server_default="12"),
        sa.Column("requires_document", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("is_paid", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
    )
    op.create_index("ix_leave_types_name", "leave_types", ["name"], unique=True)

    # ── attendances ────────────────────────────────────────────────────────────
    op.create_table(
        "attendances",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("employee_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True),
        sa.Column("office_location_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("office_locations.id", ondelete="SET NULL"), nullable=True),
        sa.Column("attendance_date", sa.Date(), nullable=False),
        sa.Column("clock_in_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("clock_in_lat", sa.Float(), nullable=True),
        sa.Column("clock_in_lng", sa.Float(), nullable=True),
        sa.Column("clock_in_photo_path", sa.Text(), nullable=True),
        sa.Column("clock_in_distance_meters", sa.Float(), nullable=True),
        sa.Column("clock_out_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("clock_out_lat", sa.Float(), nullable=True),
        sa.Column("clock_out_lng", sa.Float(), nullable=True),
        sa.Column("clock_out_photo_path", sa.Text(), nullable=True),
        sa.Column("status", sa.Enum("present", "late", "leave", "alpha", name="attendancestatus"), nullable=False),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("employee_id", "attendance_date", name="uq_attendance_per_day"),
    )

    # ── leave_requests ─────────────────────────────────────────────────────────
    op.create_table(
        "leave_requests",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("employee_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True),
        sa.Column("leave_type_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("leave_types.id", ondelete="RESTRICT"), nullable=False, index=True),
        sa.Column("start_date", sa.Date(), nullable=False),
        sa.Column("end_date", sa.Date(), nullable=False),
        sa.Column("total_days", sa.Integer(), nullable=False),
        sa.Column("reason", sa.Text(), nullable=True),
        sa.Column("document_path", sa.Text(), nullable=True),
        sa.Column("status", sa.Enum("pending", "approved", "rejected", "cancelled", name="leavestatus"), nullable=False, index=True),
        sa.Column("reviewed_by", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("reviewed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("review_notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )

    # ── payroll_periods ────────────────────────────────────────────────────────
    op.create_table(
        "payroll_periods",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("month", sa.Integer(), nullable=False),
        sa.Column("year", sa.Integer(), nullable=False),
        sa.Column("start_date", sa.Date(), nullable=False),
        sa.Column("end_date", sa.Date(), nullable=False),
        sa.Column("status", sa.Enum("open", "processing", "finalized", name="payrollperiodstatus"), nullable=False),
        sa.Column("finalized_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("finalized_by", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("month", "year", name="uq_period_month_year"),
    )

    # ── payroll_records ────────────────────────────────────────────────────────
    op.create_table(
        "payroll_records",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("employee_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="RESTRICT"), nullable=False, index=True),
        sa.Column("period_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("payroll_periods.id", ondelete="RESTRICT"), nullable=False, index=True),
        sa.Column("base_salary", sa.Numeric(15, 2), nullable=False),
        sa.Column("working_days", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("present_days", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("leave_days", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("alpha_days", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("gross_salary", sa.Numeric(15, 2), nullable=False, server_default="0"),
        sa.Column("total_allowances", sa.Numeric(15, 2), nullable=False, server_default="0"),
        sa.Column("total_deductions", sa.Numeric(15, 2), nullable=False, server_default="0"),
        sa.Column("net_salary", sa.Numeric(15, 2), nullable=False, server_default="0"),
        sa.Column("status", sa.Enum("draft", "approved", "paid", name="payrollrecordstatus"), nullable=False),
        sa.Column("paid_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("employee_id", "period_id", name="uq_payroll_employee_period"),
    )

    # ── payroll_components ─────────────────────────────────────────────────────
    op.create_table(
        "payroll_components",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("payroll_record_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("payroll_records.id", ondelete="CASCADE"), nullable=False, index=True),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("type", sa.Enum("allowance", "deduction", name="componenttype"), nullable=False),
        sa.Column("amount", sa.Numeric(15, 2), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("payroll_components")
    op.drop_table("payroll_records")
    op.drop_table("payroll_periods")
    op.drop_table("leave_requests")
    op.drop_table("attendances")
    op.drop_table("leave_types")
    op.drop_table("employee_face_data")
    op.drop_table("employee_profiles")
    op.drop_table("office_locations")
    op.drop_table("users")

    # Drop enums
    for enum_name in ["userrole", "attendancestatus", "leavestatus", "payrollperiodstatus", "payrollrecordstatus", "componenttype"]:
        op.execute(f"DROP TYPE IF EXISTS {enum_name}")