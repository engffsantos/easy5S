# backend/app/models/question.py
from app import db

class Question(db.Model):
    __tablename__ = 'questions'
    id = db.Column(db.String, primary_key=True)
    text = db.Column(db.Text, nullable=False)
    pillar = db.Column(db.String, nullable=False)