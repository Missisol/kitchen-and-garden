import os
from flask import  flash, abort, current_app, jsonify, request, send_from_directory, Response
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
    
# TODO добавить пагинацию 
@bp.route('/recipes', methods=['GET'])
def get_recipes():
    category_id = request.args.get('category_id', type=int)
    search_query = request.args.get('search', '', type=str).lower()
    favorite = request.args.get('favorite', type=str)
    page = request.args.get('page', 1, type=int)
    per_page = current_app.config['RECIPES_PER_PAGE']

    try:
        query = Recipe.query
        if category_id:
            query = query.filter(Recipe.category_id == category_id)

        if search_query:
            query = query.filter(Recipe.ingredients.collate("NOCASE").like(f'%{search_query}%'))

        # Filter by favorite status
        if favorite is not None:
            if favorite.lower() == 'true':
                query = query.filter(Recipe.favorite == True)
            elif favorite.lower() == 'false':
                query = query.filter(Recipe.favorite == False)

        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        recipes = pagination.items
        total_pages = pagination.pages
        total_items = pagination.total

        return jsonify({
            'recipes': [{
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
            } for r in recipes],
            'total_pages': total_pages,
            'total_items': total_items,
            'page': page,
            'per_page': per_page
        })

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
        print(f'secure filename: {filename}')
        file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
        return jsonify({'filename': filename}), 201


@bp.route('/static/uploads/<path:filename>')
def download_file(filename):
    """Serve uploaded files directly and keep compatibility with Nginx accel."""
    safe_filename = secure_filename(filename)
    upload_folder = current_app.config["UPLOAD_FOLDER"]
    file_path = os.path.join(upload_folder, safe_filename)

    if not os.path.isfile(file_path):
        abort(404, description="File not found")

    print(f'file_path: {file_path}')
    print(f'safe_filename: {safe_filename}')

    response = send_from_directory(upload_folder, safe_filename)
    # Keep support for X-Accel-Redirect when the request is proxied through nginx.
    response.headers['X-Accel-Redirect'] = f'/internal_files/{safe_filename}'
    return response
    
    
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
        recipe.add_to_favorites()
        return jsonify({'id': recipe.id, 'favorite': recipe.favorite}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@bp.route('/recipe/<int:id>/favorite', methods=['DELETE'])
def remove_recipe_from_favorites(id):
    try:
        recipe = Recipe.query.get_or_404(id)
        recipe.remove_from_favorites()
        return jsonify({'id': recipe.id, 'favorite': recipe.favorite}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
