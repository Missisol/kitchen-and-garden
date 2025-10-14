import os
from flask import  flash, abort, current_app, jsonify, request, send_from_directory
from app import db
from app.models import Category, Recipe
# from werkzeug.utils import secure_filename
from app.utils.secure_filename import secure_filename
from app.recipes import bp

fields = ['title', 'ingredients', 'instructions', 'links', 'comment', 'category_id', 'file']

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']


@bp.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([{
        'id': c.id,
        'name': c.name,
    } for c in categories])


@bp.route('/categories', methods=['POST'])
def create_category():
    data = request.json
    category = Category(name=data['name'])
    try:
        db.session.add(category)
        db.session.commit()
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    return jsonify({'id': category.id}), 201


@bp.route('/categories', methods=['DELETE'])
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
    

@bp.route('/recipes', methods=['GET'])
def get_recipes():
    category_id = request.args.get('category_id', type=int)
    search_query = request.args.get('search', '', type=str).lower()

    try:
        query = Recipe.query
        if category_id:
            query = query.filter(Recipe.category_id == category_id)

        if search_query:
            query = query.filter(Recipe.ingredients.collate("NOCASE").like(f'%{search_query}%'))

        recipes = query.all()
        return jsonify([{
            'id': r.id,
            'title': r.title,
            'ingredients': r.ingredients,
            'instructions': r.instructions,
            'category_id': r.category_id,
            'links': r.links,
            'comment': r.comment,
            'file': r.file,
            'category_name': r.recipe_name.name,
            'favorite': r.favorite,
        } for r in recipes])

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@bp.route('/recipes/<int:id>', methods=['POST'])
def get_recipe(id):
    print(f'id: {id}')
    # recipe = Recipe.query.get_or_404(id)
    recipe = Recipe.query.get(id)

    if recipe is not None:
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
            'favorite': recipe.favorite,
        })
    
    else:
        abort(404, description="Resource not found")
        return jsonify(recipe)
    

@bp.route('/recipe/file', methods=['POST'])
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


@bp.route('/static/uploads/<name>')
def download_file(name):
    return send_from_directory(current_app.config["UPLOAD_FOLDER"], name)

    
@bp.route('/recipe', methods=['POST'])
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


@bp.route('/recipe/<int:id>', methods=['PUT'])
def update_recipe(id):
    try:
        recipe = Recipe.query.get_or_404(id)
        data = request.json
        
        # Проверяем, пришел ли file: null и есть ли текущий файл
        if 'file' in data and data['file'] is None and recipe.file:
            # Удаляем существующий файл
            file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], recipe.file)
            try:
                if os.path.exists(file_path):
                    os.remove(file_path)
            except OSError as e:
                current_app.logger.error(f"Error deleting file {file_path}: {e}")
        
        # Обновляем поля рецепта
        for field in fields:
            if field in data:
                setattr(recipe, field, data[field])
        
        db.session.commit()
        return jsonify({'id': recipe.id}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@bp.route('/recipe/<int:id>', methods=['DELETE'])
def delete_recipe(id):
    try:
        recipe = Recipe.query.get_or_404(id)
        
        # Удаляем прикреплённый файл, если он есть
        if recipe.file:
            file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], recipe.file)
            try:
                if os.path.exists(file_path):
                    os.remove(file_path)
            except OSError as e:
                current_app.logger.error(f"Error deleting file {file_path}: {e}")
                # Продолжаем удаление рецепта даже если файл не удалён
        
        db.session.delete(recipe)
        db.session.commit()
        return '', 204
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@bp.route('/recipe/<int:id>/favorite', methods=['POST'])
def add_recipe_to_favorites(id):
    try:
        recipe = Recipe.query.get_or_404(id)
        recipe.favorite = True
        db.session.commit()
        return jsonify({'id': recipe.id, 'favorite': recipe.favorite}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@bp.route('/recipe/<int:id>/favorite', methods=['DELETE'])
def remove_recipe_from_favorites(id):
    try:
        recipe = Recipe.query.get_or_404(id)
        recipe.favorite = False
        db.session.commit()
        return jsonify({'id': recipe.id, 'favorite': recipe.favorite}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
