python -m venv <env name>

pip install -r requirements.txt
pip freeze > requirements.txt

flask run --host=0.0.0.0 -p 5002


#### Database (examples)

flask db migrate -m "..."
flask db upgrade

flask db downgrade base
flask db upgrade

from app import app, db
from app.models import Category, Recipe
import sqlalchemy as sa

r = Recipe(title='Пирог', ingredients='Яблоки', instructions='Печь')
db.session.add(r)
db.session.commit()

query = sa.select(Recipe)
recipe = db.session.scalars(query).all()

c = db.session.get(Category, 3)



