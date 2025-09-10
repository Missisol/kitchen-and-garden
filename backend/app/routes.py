import os
from flask import  flash, jsonify, request, redirect, current_app, url_for, send_from_directory
from app import app, db
from app.models import Category, Recipe
# from werkzeug.utils import secure_filename
from app.utils.secure_filename import secure_filename

fields = ['title', 'ingredients', 'instructions', 'links', 'comment', 'category_id', 'file']

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']


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
    try:
        db.session.add(category)
        db.session.commit()
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    return jsonify({'id': category.id}), 201


@app.route('/categories', methods=['DELETE'])
def delete_category():
    data = request.get_json(silent=True)
    # или
    # data = request.json

    if 'id' not in data:
        return jsonify({'error': 'Missing id parameter'}), 400

    try:
        category = Category.query.get_or_404(data['id'])
        db.session.delete(category)
        db.session.commit()
        return '', 204
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/recipes', methods=['GET'])
def get_recipes():
    category_id = request.args.get('category_id')
    if category_id:
        recipes = Recipe.query.filter_by(category_id=category_id).all()
        return jsonify([{
            'id': r.id,
            'title': r.title,
            'ingredients': r.ingredients,
            'instructions': r.instructions,
            'category_id': r.category_id,
            'category_name': r.recipe_name.name,
            'links': r.links,
            'comment': r.comment,
            'file': r.file,
        } for r in recipes])
    else:
        recipes = Recipe.query.all()
        return jsonify([{
            'id': r.id,
            'title': r.title,
            'ingredients': r.ingredients,
            'instructions': r.instructions,
            'category_id': r.category_id,
            'category_name': r.recipe_name.name,
            'links': r.links,
            'comment': r.comment,
            'file': r.file,
        } for r in recipes])


@app.route('/recipes/<int:id>', methods=['POST'])
def get_recipe(id):
    print(f'id: {id}')
    recipe = Recipe.query.get_or_404(id)
    return jsonify({
        'id': recipe.id,
        'title': recipe.title,
        'ingredients': recipe.ingredients,
        'instructions': recipe.instructions,
        'category_id': recipe.category_id,
        'category_name': recipe.recipe_name.name,
        'links': recipe.links,
        'comment': recipe.comment,
        'file': recipe.file,
    })


@app.route('/recipe/file', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        flash('No file part')
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        flash('No selected file')
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        print(f'filename: {file.filename}')
        filename = secure_filename(file.filename)
        file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
        return jsonify({'filename': filename}), 201


@app.route('/static/uploads/<name>')
def download_file(name):
    return send_from_directory(app.config["UPLOAD_FOLDER"], name)

    
@app.route('/recipe', methods=['POST'])
def create_recipe():
    data = request.json
    recipe_data = {}
    if data.get('title'):
        for field in fields:
            recipe_data[field] = data.get(field)

        try:
            recipe = Recipe(**recipe_data)
            db.session.add(recipe)
            db.session.commit()
            return jsonify({'id': recipe.id}), 201
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'Title is required'}), 400


@app.route('/recipe/<int:id>', methods=['PUT'])
def update_recipe(id):
    recipe = Recipe.query.get_or_404(id)
    data = request.json
    
    # Проверка версии
    # if 'version' not in data or recipe.version != data['version']:
    #     return jsonify({
    #         'error': 'Conflict',
    #         'message': 'Рецепт был изменен другим пользователем',
    #         'server_version': recipe.version,
    #         'server_data': {
    #             'title': recipe.title,
    #             'ingredients': recipe.ingredients,
    #             'instructions': recipe.instructions,
    #             'image': recipe.image,
    #         }
    #     }), 409
    
    # Обновление данных
    recipe.title = data.get('title', recipe.title)
    recipe.ingredients = data.get('ingredients', recipe.ingredients)
    recipe.instructions = data.get('instructions', recipe.instructions)
    # recipe.version += 1
    db.session.commit()
    return jsonify({
        'message': 'Recipe updated',
        # 'version': recipe.version
    })

@app.route('/recipe/<int:id>', methods=['DELETE'])
def delete_recipe(id):
    recipe = Recipe.query.get_or_404(id)
    try:
        db.session.delete(recipe)
        db.session.commit()
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    return '', 204