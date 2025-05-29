from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from .config import Config

# Inicializações globais
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # CORS configurado para permitir origem do frontend
    #CORS(app, origins=["http://localhost:3000"], supports_credentials=True)
    from flask_cors import CORS

    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

    # Manipuladores para evitar redirects em erros de autenticação (CORS-safe)
    @jwt.unauthorized_loader
    def unauthorized_callback(callback):
        return jsonify({"error": "Não autorizado"}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(callback):
        return jsonify({"error": "Token inválido"}), 401

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({"error": "Token expirado"}), 401

    # Importação dos modelos
    from app.models import (
        User,
        EnvironmentEmployee,
        Question,
        Evaluation,
        Answer,
        CorrectiveAction
    )

    # Registro dos blueprints
    from app.routes.auth import auth_bp
    app.register_blueprint(auth_bp)

    from app.routes.environments import environments_bp
    app.register_blueprint(environments_bp)

    from app.routes.protected import protected_bp
    app.register_blueprint(protected_bp)

    from app.routes.environment_employees import environment_employees_bp
    app.register_blueprint(environment_employees_bp)

    from app.routes.employees import employees_bp
    app.register_blueprint(employees_bp)

    from app.routes.actions import actions_bp
    app.register_blueprint(actions_bp)

    @app.route('/')
    def index():
        return "Easy5S API rodando com Flask!"

    return app
