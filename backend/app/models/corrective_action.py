# backend/app/models/corrective_action.py
from app import db

class CorrectiveAction(db.Model):
    __tablename__ = 'corrective_actions'
    id = db.Column(db.String, primary_key=True)
    environment_id = db.Column(db.String, db.ForeignKey('environments.id'))
    employee_id = db.Column(db.String, db.ForeignKey('users.id'))
    description = db.Column(db.Text)
    deadline_type = db.Column(db.String)
    deadline_date = db.Column(db.Date)
    observation = db.Column(db.Text)
    proof_image_url = db.Column(db.String)
    status = db.Column(db.String)