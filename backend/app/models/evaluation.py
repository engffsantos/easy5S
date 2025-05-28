# backend/app/models/evaluation.py
from app import db

class Evaluation(db.Model):
    __tablename__ = 'evaluations'
    id = db.Column(db.String, primary_key=True)
    environment_id = db.Column(db.String, db.ForeignKey('environments.id'))
    inspector_id = db.Column(db.String, db.ForeignKey('users.id'))
    date = db.Column(db.Date)
    average_score = db.Column(db.Float)
    status = db.Column(db.String)