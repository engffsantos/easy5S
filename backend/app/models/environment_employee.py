# backend/app/models/environment_employee.py
from app import db

class EnvironmentEmployee(db.Model):
    __tablename__ = 'environment_employees'

    id = db.Column(db.String, primary_key=True)
    environment_id = db.Column(db.String, db.ForeignKey('environments.id'), nullable=False)
    employee_id = db.Column(db.String, db.ForeignKey('users.id'), nullable=False)

    environment = db.relationship('Environment', back_populates='responsible_employees')
    employee = db.relationship('User', back_populates='environments_responsible')
