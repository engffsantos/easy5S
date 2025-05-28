# backend/app/models/environment_employee.py
from app import db

class EnvironmentEmployee(db.Model):
    __tablename__ = 'environment_employees'
    id = db.Column(db.Integer, primary_key=True)
    environment_id = db.Column(db.String, db.ForeignKey('environments.id'))
    employee_id = db.Column(db.String, db.ForeignKey('users.id'))
