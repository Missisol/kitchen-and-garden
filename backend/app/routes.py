from flask import jsonify, request
from app import app, db
from app.models import Category, Recipe

fields = ['title', 'ingredients', 'instructions', 'image', 'links', 'comment', 'category_id']

@app.route('/')
def index():
    return "Hello, recipes!"


@app.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([{
        'id': c.id,
        'name': c.name,
    } for c in categories])


@app.route('/categories', methods=['POST'])
def create_category():
    data = request.json
    category = Category(name=data['name'])
    db.session.add(category)
    db.session.commit()
    return jsonify({'id': category.id}), 201


@app.route('/recipes', methods=['GET'])
def get_recipes():
    id = request.args.get('id')
    print(f'id: {id}')

    if id:
        recipes = Recipe.query.filter_by(category_id=id).all()
        return jsonify([{
            'id': r.id,
            'title': r.title,
            'ingredients': r.ingredients,
            'instructions': r.instructions,
            'image': r.image if r.image else None, 
            'category_id': r.category_id,
            'category_name': r.recipe_name.name,
            'links': r.links,
        } for r in recipes])
    else:
        recipes = Recipe.query.all()
        return jsonify([{
            'id': r.id,
            'title': r.title,
            'ingredients': r.ingredients,
            'instructions': r.instructions,
            'image': r.image if r.image else None, 
            'category_id': r.category_id,
            'category_name': r.recipe_name.name if r.recipe_name else None,
            'links': r.links,
        } for r in recipes])


@app.route('/recipes', methods=['POST'])
def create_recipe():
    data = request.json
    recipe_data = {}
    if data.get('title'):
        for field in fields:
            recipe_data[field] = data.get(field)

        recipe = Recipe(**recipe_data)
        db.session.add(recipe)
        db.session.commit()
    return jsonify({'id': recipe.id}), 201

@app.route('/recipes/<int:id>', methods=['PUT'])
def update_recipe(id):
    recipe = Recipe.query.get_or_404(id)
    data = request.json
    
    # Проверка версии
    if 'version' not in data or recipe.version != data['version']:
        return jsonify({
            'error': 'Conflict',
            'message': 'Рецепт был изменен другим пользователем',
            'server_version': recipe.version,
            'server_data': {
                'title': recipe.title,
                'ingredients': recipe.ingredients,
                'instructions': recipe.instructions,
                'image': recipe.image,
            }
        }), 409
    
    # Обновление данных
    recipe.title = data.get('title', recipe.title)
    recipe.ingredients = data.get('ingredients', recipe.ingredients)
    recipe.instructions = data.get('instructions', recipe.instructions)
    recipe.version += 1
    db.session.commit()
    return jsonify({
        'message': 'Recipe updated',
        'version': recipe.version
    })

@app.route('/recipes/<int:id>', methods=['DELETE'])
def delete_recipe(id):
    recipe = Recipe.query.get_or_404(id)
    db.session.delete(recipe)
    db.session.commit()
    return '', 204