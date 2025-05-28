# backend/app/routes/auth.py
from flask import Blueprint, request
from app.controllers.auth_controller import authenticate_user

auth_bp = Blueprint('auth', __name__, url_prefix='/api')

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    return authenticate_user(email, password)
