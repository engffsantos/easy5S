# backend/app/controllers/auth_controller.py
from flask import jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash
from app.models.user import User
from app import db

def authenticate_user(email, password):
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"msg": "Usuário não encontrado."}), 404

    # Para produção, use check_password_hash(user.password, password)
    from werkzeug.security import check_password_hash

    if not check_password_hash(user.password, password):
        return jsonify({"msg": "Senha incorreta."}), 401

    access_token = create_access_token(identity=user.id)

    return jsonify({
        "access_token": access_token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }), 200
