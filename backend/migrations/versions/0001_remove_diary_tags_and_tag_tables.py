"""Remove diary_tags and tag tables

Revision ID: 0001_remove_diary_tags
Revises: 89ef0bc839c9
Create Date: 2026-09-02 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0001_remove_diary_tags'
down_revision = '89ef0bc839c9'
branch_labels = None
depends_on = None


def upgrade():
    op.drop_table('diary_tags')
    op.drop_table('tag')


def downgrade():
    op.create_table('tag',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('name', sa.String(length=50), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_general_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    with op.batch_alter_table('tag', schema=None) as batch_op:
        batch_op.create_index('ix_tag_name', ['name'], unique=True)

    op.create_table('diary_tags',
    sa.Column('diary_id', sa.Integer(), autoincrement=False, nullable=False),
    sa.Column('tag_id', sa.Integer(), autoincrement=False, nullable=False),
    sa.ForeignKeyConstraint(['diary_id'], ['diary.id'], name='fk_diary_tags_diary_id', ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['tag_id'], ['tag.id'], name='fk_diary_tags_tag_id', ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('diary_id', 'tag_id'),
    mysql_collate='utf8mb4_general_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
