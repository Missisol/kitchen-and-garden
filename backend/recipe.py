import sqlalchemy as sa
import sqlalchemy.orm as so
from app import create_app, db
from app.models import Category, Recipe, Reserve, ReserveCategory

app = create_app()

@app.shell_context_processor
def make_shell_context():
  return {'sa': sa, 'so': so, 'db': db, 'Category': Category, 'Recipe': Recipe,
          'Reserve': Reserve, 'ReserveCategory': ReserveCategory}