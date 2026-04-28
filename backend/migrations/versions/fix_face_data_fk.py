from alembic import op

revision = 'fix_face_data_fk'
down_revision = 'dad4e72591b9'  # ← sudah diisi
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.create_foreign_key(
        "fk_employee_face_data_registered_by",
        "employee_face_data",
        "users",
        ["registered_by"],
        ["id"],
        ondelete="SET NULL",
    )

def downgrade() -> None:
    op.drop_constraint(
        "fk_employee_face_data_registered_by",
        "employee_face_data",
        type_="foreignkey",
    )