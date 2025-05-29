# backend/app/routes/employees.py
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from app.models.user import User

employees_bp = Blueprint('employees', __name__, url_prefix='/api/employees')

@employees_bp.route('/', methods=['GET'])
@jwt_required()
def list_employees():
    employees = User.query.all()
    result = [
        {
            "id": user.id,
            "fullName": user.name,
            "email": user.email,
            "role": user.role
        } for user in employees
    ]
    return jsonify(result), 200
