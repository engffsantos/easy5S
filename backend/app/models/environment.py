# backend/app/models/environment.py
from app import db

class Environment(db.Model):
    __tablename__ = 'environments'

    id = db.Column(db.String, primary_key=True)
    name = db.Column(db.String, nullable=False)
    type = db.Column(db.String, nullable=False)
    block = db.Column(db.String, nullable=False)
    description = db.Column(db.Text, nullable=True)

    responsible_employees = db.relationship('EnvironmentEmployee', back_populates='environment', cascade='all, delete-orphan')
