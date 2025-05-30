# backend/app/controllers/environment_controller.py

from flask import jsonify
from app import db
from app.models.environment import Environment
from app.models.environment_employee import EnvironmentEmployee
from app.models.user import User
import uuid

def get_all_environments():
    environments = Environment.query.all()
    return jsonify([
        {
            "id": env.id,
            "name": env.name,
            "type": env.type,
            "block": env.block,
            "description": env.description,
            "is_active": env.is_active,
            "responsibles": [
                {
                    "id": ee.employee.id,
                    "name": ee.employee.name,
                    "email": ee.employee.email,
                    "role": ee.employee.role
                }
                for ee in env.environment_employees
            ]
        } for env in environments
    ]), 200


def create_environment(data):
    env_id = str(uuid.uuid4())
    new_env = Environment(
        id=env_id,
        name=data.get("name"),
        type=data.get("type"),
        block=data.get("block"),
        description=data.get("description"),
        is_active=data.get("is_active", True)
    )
    db.session.add(new_env)

    # Associar responsáveis ao ambiente
    responsible_ids = data.get("responsibleIds", [])
    for emp_id in responsible_ids:
        association = EnvironmentEmployee(
            id=str(uuid.uuid4()),
            environment_id=env_id,
            employee_id=emp_id
        )
        db.session.add(association)

    db.session.commit()

    return jsonify({"msg": "Ambiente criado com sucesso."}), 201
