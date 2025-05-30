from app import create_app, db
from app.models.user import User
from werkzeug.security import generate_password_hash

app = create_app()

with app.app_context():
    user = User.query.filter_by(email="admin@senai.com").first()
    if user:
        user.password = generate_password_hash("123")
        db.session.commit()
        print("Senha atualizada com sucesso.")
    else:
        print("Usuário não encontrado.")
# backend/app/routes/employees.py

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from flask_cors import cross_origin
from app.models.user import User

employees_bp = Blueprint('employees', __name__, url_prefix='/api/employees')

@employees_bp.route('/', methods=['GET'])
@cross_origin(origin='http://localhost:3000', supports_credentials=True)
@jwt_required()
def get_employees():
    employees = User.query.filter(User.role.in_(['responsible', 'inspector', 'manager'])).all()
    result = [
        {
            'id': e.id,
            'name': e.name,
            'email': e.email,
            'role': e.role
        }
        for e in employees
    ]
    return jsonify(result), 200
