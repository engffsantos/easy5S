# backend/app/controllers/environment_controller.py
from flask import jsonify
from app import db
from app.models.environment import Environment
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
            "is_active": env.is_active
        } for env in environments
    ]), 200

def create_environment(data):
    new_env = Environment(
        id=str(uuid.uuid4()),
        name=data.get("name"),
        type=data.get("type"),
        block=data.get("block"),
        description=data.get("description"),
        is_active=data.get("is_active", True)
    )
    db.session.add(new_env)
    db.session.commit()

    return jsonify({"msg": "Ambiente criado com sucesso."}), 201
