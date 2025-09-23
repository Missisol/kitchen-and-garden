from flask import jsonify
from app.errors import bp

@bp.app_errorhandler(404)
def resource_not_found(e):
    return jsonify(error=str(e)), 404


@bp.app_errorhandler(500)
def internal_server_error(e):
    return jsonify(error=str(e)), 500

