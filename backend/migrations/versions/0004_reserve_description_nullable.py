"""make reserve.description nullable

Revision ID: 0004_reserve_description_nullable
Revises: 0003_add_reserves
Create Date: 2026-11-04 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0004_reserve_description_nullable'
down_revision = '0003_add_reserves'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('reserve', schema=None) as batch_op:
        batch_op.alter_column(
            'description',
            existing_type=sa.Text(),
            nullable=True,
        )


def downgrade():
    # Заполнить пустые значения, иначе NOT NULL нельзя восстановить
    conn = op.get_bind()
    from sqlalchemy import text
    conn.execute(text(
        "UPDATE reserve SET description = '' WHERE description IS NULL"
    ))

    with op.batch_alter_table('reserve', schema=None) as batch_op:
        batch_op.alter_column(
            'description',
            existing_type=sa.Text(),
            nullable=False,
        )
