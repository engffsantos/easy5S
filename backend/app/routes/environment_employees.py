#app/routes/environment_employees.py
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from flask_cors import cross_origin
from app.models.environment_employee import EnvironmentEmployee  # ✅ Correto agora
from app import db

environment_employees_bp = Blueprint('environment_employees', __name__)

@environment_employees_bp.route('/api/environment_employees', methods=['GET', 'OPTIONS'])
@cross_origin(origin='http://localhost:3000', supports_credentials=True)
@jwt_required()
def get_environment_employees():
    if request.method == 'OPTIONS':
        return '', 200

    env_emps = EnvironmentEmployee.query.all()
    result = [
        {
            'id': e.id,
            'environmentId': e.environment_id,
            'employeeId': e.employee_id
        }
        for e in env_emps
    ]
    return jsonify(result), 200
