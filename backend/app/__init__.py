import os
from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS


db = SQLAlchemy()
migrate = Migrate()
cors = CORS()


def create_app(config_class=Config):
  app = Flask(__name__)
  app.config.from_object(config_class)

  # Ensure upload directory exists
  upload_folder = app.config['UPLOAD_FOLDER']
  if not os.path.exists(upload_folder):
    os.makedirs(upload_folder, exist_ok=True)

  db.init_app(app)
  migrate.init_app(app, db)
  cors.init_app(app)


  from app.errors import bp as errors_bp
  app.register_blueprint(errors_bp)

  from app.recipes import bp as recipes_bp
  app.register_blueprint(recipes_bp)

  return app


from app import models