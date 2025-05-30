# backend/app/routes/environment_controller.py

from flask import Blueprint, request, jsonify
from app.models.environment import Environment
from app.models.environment_employee import EnvironmentEmployee
from app.models.user import User
from app import db
import uuid

environments_bp = Blueprint('environments', __name__, url_prefix='/api/environments')

@environments_bp.route('/', methods=['GET'])
def list_environments():
    return get_all_environments()

@environments_bp.route('/', methods=['POST'])
def create_environment_route():
    data = request.get_json()
    return create_environment(data)

def get_all_environments():
    environments = Environment.query.all()
    result = []

    for env in environments:
        responsible_ids = [ee.employee_id for ee in env.responsible_employees]
        result.append({
            'id': env.id,
            'name': env.name,
            'description': env.description,
            'block': env.block,
            'type': env.type,
            'responsibleIds': responsible_ids
        })

    return jsonify(result), 200

def create_environment(data):
    required_fields = ['name', 'type', 'block', 'description', 'responsibleIds']
    if not all(field in data and data[field] for field in required_fields):
        return jsonify({'error': 'Campos obrigatórios ausentes'}), 400

    try:
        env_id = str(uuid.uuid4())
        environment = Environment(
            id=env_id,
            name=data['name'],
            type=data['type'],
            block=data['block'],
            description=data['description']
        )
        db.session.add(environment)
        db.session.flush()  # Garante o ID para uso nas associações

        for emp_id in data['responsibleIds']:
            if not emp_id:
                continue  # Ignora IDs vazios
            user = User.query.get(str(emp_id))
            if user:
                association = EnvironmentEmployee(
                    id=str(uuid.uuid4()),
                    environment_id=env_id,
                    employee_id=user.id
                )
                db.session.add(association)

        db.session.commit()
        return jsonify({'message': 'Ambiente criado com sucesso'}), 201

    except Exception as e:
        db.session.rollback()
        print("Erro ao criar ambiente:", e)
        return jsonify({'error': str(e)}), 500
