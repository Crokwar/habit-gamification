"""add days_of_week column

Revision ID: c1fcdbda9ab7
Revises: 3abd0c263586
Create Date: 2026-03-17 15:32:34.961446

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c1fcdbda9ab7'
down_revision: Union[str, None] = '3abd0c263586'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # add column
    op.add_column('habits', sa.Column('days_of_week', sa.ARRAY(sa.Integer()), nullable=True))

    # update data
    op.execute("UPDATE habits SET days_of_week = ARRAY[0,1,2,3,4] WHERE days_of_week IS NULL")

    #
    op.alter_column('habits', 'days_of_week', nullable=False)


def downgrade() -> None:
    # revert change
    op.drop_column('habits', 'days_of_week')

