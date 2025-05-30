# backend/app/routes/employees.py
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from flask_cors import cross_origin
from werkzeug.security import generate_password_hash
from app.models.user import User
from app import db
import uuid

employees_bp = Blueprint('employees', __name__, url_prefix='/api/employees')


@employees_bp.route('/', methods=['GET'])
@cross_origin(origin='http://localhost:3000', supports_credentials=True)
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


@employees_bp.route('/', methods=['POST'])
@cross_origin(origin='http://localhost:3000', supports_credentials=True)
@jwt_required()
def create_employee():
    data = request.get_json()

    if not all(key in data for key in ('fullName', 'email', 'password', 'role')):
        return jsonify({'error': 'Campos obrigatórios ausentes'}), 400

    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({'error': 'Email já cadastrado'}), 409

    new_user = User(
        id=str(uuid.uuid4()),
        name=data['fullName'],
        email=data['email'],
        password=generate_password_hash(data['password']),
        role=data['role']
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'Funcionário criado com sucesso'}), 201


@employees_bp.route('/<employee_id>', methods=['PUT'])
@cross_origin(origin='http://localhost:3000', supports_credentials=True)
@jwt_required()
def update_employee(employee_id):
    data = request.get_json()
    user = User.query.get(employee_id)

    if not user:
        return jsonify({'error': 'Funcionário não encontrado'}), 404

    user.name = data.get('fullName', user.name)
    user.email = data.get('email', user.email)
    user.role = data.get('role', user.role)

    if data.get('password'):
        user.password = generate_password_hash(data['password'])

    db.session.commit()
    return jsonify({'message': 'Funcionário atualizado com sucesso'}), 200
