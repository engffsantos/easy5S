from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from app.models.corrective_action import CorrectiveAction

actions_bp = Blueprint('actions', __name__, url_prefix='/api/actions')

@actions_bp.route('/', methods=['GET', 'OPTIONS'])
@jwt_required()
def list_actions():
    actions = CorrectiveAction.query.all()
    result = [
        {
            'id': action.id,
            'description': action.description,
            'environmentId': action.environment_id,
            'status': action.status
        }
        for action in actions
    ]
    return jsonify(result), 200
