# backend/app/routes/environment_employees.py
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from flask_cors import cross_origin
from app.models.environment_employee import EnvironmentEmployee
from app import db

# ✅ Definir o blueprint primeiro
environment_employees_bp = Blueprint(
    'environment_employees',
    __name__,
    url_prefix='/api/environment_employees'
)

@environment_employees_bp.route('/', methods=['GET', 'OPTIONS'])
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
@environment_employees_bp.route('/', methods=['POST'])
@cross_origin(origin='http://localhost:3000', supports_credentials=True)
@jwt_required()
def create_environment_employees():
    data = request.get_json()

    # Validação básica
    environment_id = data.get('environmentId')
    employee_ids = data.get('employeeIds', [])

    if not environment_id or not isinstance(employee_ids, list):
        return jsonify({'error': 'Dados inválidos'}), 400

    for emp_id in employee_ids:
        new_relation = EnvironmentEmployee(environment_id=environment_id, employee_id=emp_id)
        db.session.add(new_relation)

    db.session.commit()
    return jsonify({'message': 'Relacionamentos criados com sucesso'}), 201
