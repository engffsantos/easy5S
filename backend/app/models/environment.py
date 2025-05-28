from app import db

class Environment(db.Model):
    __tablename__ = 'environments'
    id = db.Column(db.String, primary_key=True)
    name = db.Column(db.String, nullable=False)
    type = db.Column(db.String, nullable=False)
    block = db.Column(db.String, nullable=False)
    description = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)
