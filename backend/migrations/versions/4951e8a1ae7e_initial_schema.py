"""Initial schema

Revision ID: 4951e8a1ae7e
Revises: 
Create Date: 2025-05-28 15:52:04.126692

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4951e8a1ae7e'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('environments',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('type', sa.String(), nullable=False),
    sa.Column('block', sa.String(), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('questions',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('text', sa.Text(), nullable=False),
    sa.Column('pillar', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('users',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('password', sa.String(), nullable=False),
    sa.Column('role', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('corrective_actions',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('environment_id', sa.String(), nullable=True),
    sa.Column('employee_id', sa.String(), nullable=True),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('deadline_type', sa.String(), nullable=True),
    sa.Column('deadline_date', sa.Date(), nullable=True),
    sa.Column('observation', sa.Text(), nullable=True),
    sa.Column('proof_image_url', sa.String(), nullable=True),
    sa.Column('status', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['employee_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['environment_id'], ['environments.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('environment_employees',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('environment_id', sa.String(), nullable=True),
    sa.Column('employee_id', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['employee_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['environment_id'], ['environments.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('evaluations',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('environment_id', sa.String(), nullable=True),
    sa.Column('inspector_id', sa.String(), nullable=True),
    sa.Column('date', sa.Date(), nullable=True),
    sa.Column('average_score', sa.Float(), nullable=True),
    sa.Column('status', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['environment_id'], ['environments.id'], ),
    sa.ForeignKeyConstraint(['inspector_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('answers',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('evaluation_id', sa.String(), nullable=True),
    sa.Column('question_id', sa.String(), nullable=True),
    sa.Column('score', sa.Integer(), nullable=True),
    sa.Column('observation', sa.Text(), nullable=True),
    sa.ForeignKeyConstraint(['evaluation_id'], ['evaluations.id'], ),
    sa.ForeignKeyConstraint(['question_id'], ['questions.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('answers')
    op.drop_table('evaluations')
    op.drop_table('environment_employees')
    op.drop_table('corrective_actions')
    op.drop_table('users')
    op.drop_table('questions')
    op.drop_table('environments')
    # ### end Alembic commands ###
