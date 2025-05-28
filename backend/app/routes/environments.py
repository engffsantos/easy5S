# backend/app/routes/environments.py
from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from app.controllers.environment_controller import get_all_environments, create_environment

environments_bp = Blueprint('environments', __name__, url_prefix='/api/environments')

@environments_bp.route('/', methods=['GET'])
@jwt_required()
def list_environments():
    return get_all_environments()

@environments_bp.route('/', methods=['POST'])
@jwt_required()
def new_environment():
    data = request.get_json()
    return create_environment(data)