# backend/app/models/answer.py
from app import db

class Answer(db.Model):
    __tablename__ = 'answers'
    id = db.Column(db.String, primary_key=True)
    evaluation_id = db.Column(db.String, db.ForeignKey('evaluations.id'))
    question_id = db.Column(db.String, db.ForeignKey('questions.id'))
    score = db.Column(db.Integer)
    observation = db.Column(db.Text)