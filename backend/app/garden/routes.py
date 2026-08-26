import os
from flask import jsonify, request, current_app
from app import db
from app.models import Tag, Diary, diary_tags
from app.garden import bp


@bp.route('/tags', methods=['GET'])
def get_tags():
    """Get all tags sorted alphabetically
    
    Returns:
        JSON response with list of tags
    """
    try:
        tags = Tag.query.order_by(Tag.name.asc()).all()
        return jsonify([{
            'id': t.id,
            'name': t.name,
        } for t in tags]), 200
    except Exception as e:
        current_app.logger.error(f'Error fetching tags: {str(e)}')
        return jsonify({'error': 'Internal server error'}), 500


@bp.route('/tags', methods=['POST'])
def create_tag():
    """Create a new tag
    
    Request body:
        name: str - tag name (required, max 50 chars)
    
    Returns:
        JSON response with created tag id
    """
    data = request.json
    
    if not data or not data.get('name'):
        return jsonify({'error': 'Tag name is required'}), 400
    
    name = data['name'].strip()
    if not name:
        return jsonify({'error': 'Tag name cannot be empty'}), 400
    
    if len(name) > 50:
        return jsonify({'error': 'Tag name must not exceed 50 characters'}), 400
    
    try:
        tag = Tag(name=name)
        db.session.add(tag)
        db.session.commit()
        return jsonify({'id': tag.id}), 201
    except Exception as e:
        db.session.rollback()
        if 'UNIQUE constraint failed' in str(e) or 'duplicate key' in str(e).lower():
            return jsonify({'error': 'Tag with this name already exists'}), 409
        current_app.logger.error(f'Error creating tag: {str(e)}')
        return jsonify({'error': 'Internal server error'}), 500


@bp.route('/tags/<int:id>', methods=['GET'])
def get_tag(id):
    """Get a specific tag by ID
    
    Returns:
        JSON response with tag details or 404
    """
    try:
        tag = Tag.query.get_or_404(id)
        return jsonify({
            'id': tag.id,
            'name': tag.name,
        }), 200
    except Exception as e:
        current_app.logger.error(f'Error fetching tag {id}: {str(e)}')
        return jsonify({'error': 'Internal server error'}), 500


@bp.route('/tags/<int:id>', methods=['PATCH'])
def update_tag(id):
    """Update a tag's name
    
    Request body:
        name: str - new tag name (optional)
        action: str - 'delete' to remove the tag (optional)
    
    Returns:
        JSON response with updated tag or 204 on delete
    """
    try:
        tag = Tag.query.get_or_404(id)
        data = request.json
        
        if data.get('action') == 'delete':
            db.session.delete(tag)
            db.session.commit()
            return '', 204
        
        if 'name' in data:
            new_name = data['name'].strip()
            if not new_name:
                return jsonify({'error': 'Tag name cannot be empty'}), 400
            
            if len(new_name) > 50:
                return jsonify({'error': 'Tag name must not exceed 50 characters'}), 400
            
            tag.name = new_name
            db.session.commit()
            return jsonify({'id': tag.id, 'name': tag.name}), 200
        
        return jsonify({'error': 'Missing name or action parameter'}), 400
    except Exception as e:
        db.session.rollback()
        if 'UNIQUE constraint failed' in str(e) or 'duplicate key' in str(e).lower():
            return jsonify({'error': 'Tag with this name already exists'}), 409
        current_app.logger.error(f'Error updating tag {id}: {str(e)}')
        return jsonify({'error': 'Internal server error'}), 500


@bp.route('/tags/<int:id>', methods=['DELETE'])
def delete_tag(id):
    """Delete a tag by ID
    
    Returns:
        204 No Content on success
    """
    try:
        tag = Tag.query.get_or_404(id)
        db.session.delete(tag)
        db.session.commit()
        return '', 204
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error deleting tag {id}: {str(e)}')
        return jsonify({'error': 'Internal server error'}), 500


# Diary routes
diary_fields = ['title', 'description', 'links', 'file']


@bp.route('/diaries', methods=['GET'])
def get_diaries():
    """Get all diary entries with optional filtering
    
    Query params:
        tag_id: int - filter by tag
        search: str - search in title and description (case-insensitive)
        page: int - page number (default: 1)
        per_page: int - items per page (default from config)
    
    Returns:
        JSON response with paginated list of diaries
    """
    tag_id = request.args.get('tag_id', type=int)
    search_query = request.args.get('search', '', type=str).lower()
    page = request.args.get('page', 1, type=int)
    per_page = current_app.config.get('DIARIES_PER_PAGE', 10)

    try:
        query = Diary.query
        
        if tag_id:
            query = query.filter(Diary.tags.any(id=tag_id))

        if search_query:
            query = query.filter(
                db.or_(
                    Diary.title.collate("NOCASE").like(f'%{search_query}%'),
                    Diary.description.collate("NOCASE").like(f'%{search_query}%')
                )
            )

        pagination = query.order_by(Diary.timestamp.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        diaries = pagination.items
        total_pages = pagination.pages
        total_items = pagination.total

        return jsonify({
            'diaries': [{
                'id': d.id,
                'title': d.title,
                'description': d.description,
                'links': d.links,
                'timestamp': d.timestamp.isoformat(),
                'file': d.file,
                'tags': [{'id': t.id, 'name': t.name} for t in d.tags],
            } for d in diaries],
            'total_pages': total_pages,
            'total_items': total_items,
            'page': page,
            'per_page': per_page
        })

    except Exception as e:
        current_app.logger.error(f'Error fetching diaries: {str(e)}')
        return jsonify({'error': 'Internal server error'}), 500


@bp.route('/diaries', methods=['POST'])
def create_diary():
    """Create a new diary entry
    
    Request body:
        title: str - entry title (required, unique, max 100 chars)
        description: str - entry description (optional)
        links: str - related links (optional)
        file: str - attached file name (optional)
        tag_ids: list[int] - list of tag IDs to associate (optional)
    
    Returns:
        JSON response with created diary id
    """
    data = request.json
    
    if not data or not data.get('title'):
        return jsonify({'error': 'Title is required'}), 400
    
    title = data['title'].strip()
    if not title:
        return jsonify({'error': 'Title cannot be empty'}), 400
    
    if len(title) > 100:
        return jsonify({'error': 'Title must not exceed 100 characters'}), 400
    
    try:
        diary_data = {
            'title': title,
            'description': data.get('description'),
            'links': data.get('links'),
            'file': data.get('file'),
        }
        
        diary = Diary(**diary_data)
        
        # Associate tags if provided
        if 'tag_ids' in data and data['tag_ids']:
            tag_ids = data['tag_ids']
            if isinstance(tag_ids, list):
                tags = Tag.query.filter(Tag.id.in_(tag_ids)).all()
                for tag in tags:
                    diary.tags.append(tag)
        
        db.session.add(diary)
        db.session.commit()
        return jsonify({'id': diary.id}), 201
    except Exception as e:
        db.session.rollback()
        if 'UNIQUE constraint failed' in str(e) or 'duplicate key' in str(e).lower():
            return jsonify({'error': 'Diary with this title already exists'}), 409
        current_app.logger.error(f'Error creating diary: {str(e)}')
        return jsonify({'error': 'Internal server error'}), 500


@bp.route('/diaries/<int:id>', methods=['GET'])
def get_diary(id):
    """Get a specific diary entry by ID
    
    Returns:
        JSON response with diary details or 404
    """
    try:
        diary = Diary.query.get_or_404(id)
        return jsonify({
            'id': diary.id,
            'title': diary.title,
            'description': diary.description,
            'links': diary.links,
            'timestamp': diary.timestamp.isoformat(),
            'file': diary.file,
            'tags': [{'id': t.id, 'name': t.name} for t in diary.tags],
        }), 200
    except Exception as e:
        current_app.logger.error(f'Error fetching diary {id}: {str(e)}')
        return jsonify({'error': 'Internal server error'}), 500


@bp.route('/diaries/<int:id>', methods=['PUT'])
def update_diary(id):
    """Update a diary entry
    
    Request body:
        title: str - new title (optional)
        description: str - new description (optional)
        links: str - new links (optional)
        file: str - new file name (optional)
        tag_ids: list[int] - new list of tag IDs (optional, replaces existing)
    
    Returns:
        JSON response with updated diary id
    """
    try:
        diary = Diary.query.get_or_404(id)
        data = request.json
        
        # Handle file deletion if set to null
        if 'file' in data and data['file'] is None and diary.file:
            file_path = current_app.config.get('UPLOAD_FOLDER', 'uploads')
            file_path = os.path.join(file_path, diary.file)
            try:
                if os.path.exists(file_path):
                    os.remove(file_path)
            except OSError as e:
                current_app.logger.error(f"Error deleting file {file_path}: {e}")
        
        # Update basic fields
        if 'title' in data:
            new_title = data['title'].strip()
            if not new_title:
                return jsonify({'error': 'Title cannot be empty'}), 400
            if len(new_title) > 100:
                return jsonify({'error': 'Title must not exceed 100 characters'}), 400
            diary.title = new_title
        
        if 'description' in data:
            diary.description = data['description']
        
        if 'links' in data:
            diary.links = data['links']
        
        if 'file' in data and data['file'] is not None:
            diary.file = data['file']
        
        # Update tags if provided
        if 'tag_ids' in data:
            # Clear existing tags
            diary.tags.clear()
            # Add new tags
            tag_ids = data['tag_ids']
            if isinstance(tag_ids, list):
                tags = Tag.query.filter(Tag.id.in_(tag_ids)).all()
                for tag in tags:
                    diary.tags.append(tag)
        
        db.session.commit()
        return jsonify({'id': diary.id}), 200
    except Exception as e:
        db.session.rollback()
        if 'UNIQUE constraint failed' in str(e) or 'duplicate key' in str(e).lower():
            return jsonify({'error': 'Diary with this title already exists'}), 409
        current_app.logger.error(f'Error updating diary {id}: {str(e)}')
        return jsonify({'error': 'Internal server error'}), 500


@bp.route('/diaries/<int:id>', methods=['DELETE'])
def delete_diary(id):
    """Delete a diary entry by ID
    
    Returns:
        204 No Content on success
    """
    try:
        diary = Diary.query.get_or_404(id)
        
        # Delete attached file if exists
        if diary.file:
            file_path = current_app.config.get('UPLOAD_FOLDER', 'uploads')
            file_path = os.path.join(file_path, diary.file)
            try:
                if os.path.exists(file_path):
                    os.remove(file_path)
            except OSError as e:
                current_app.logger.error(f"Error deleting file {file_path}: {e}")
        
        db.session.delete(diary)
        db.session.commit()
        return '', 204
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error deleting diary {id}: {str(e)}')
        return jsonify({'error': 'Internal server error'}), 500