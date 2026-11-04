"""Remove diary table

Revision ID: 0002_remove_diary
Revises: 0001_remove_diary_tags
Create Date: 2026-09-02 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0002_remove_diary'
down_revision = '0001_remove_diary_tags'
branch_labels = None
depends_on = None


def upgrade():
    op.drop_table('diary')


def downgrade():
    op.create_table('diary',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('title', sa.String(length=100), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('links', sa.Text(), nullable=True),
    sa.Column('timestamp', sa.DateTime(), nullable=False),
    sa.Column('file', sa.String(length=255), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_general_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    with op.batch_alter_table('diary', schema=None) as batch_op:
        batch_op.create_index('ix_diary_timestamp', ['timestamp'], unique=False)
        batch_op.create_index('ix_diary_title', ['title'], unique=True)
