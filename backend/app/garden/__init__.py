from flask import Blueprint

bp = Blueprint('garden', __name__)

from app.garden import routes
