"""Тесты для CRUD категорий ReserveCategory."""
import pytest


class TestGetCategories:
    """GET /reserve_categories."""

    def test_returns_200(self, client):
        response = client.get('/reserve_categories')
        assert response.status_code == 200

    def test_returns_empty_list_when_no_categories(self, client):
        response = client.get('/reserve_categories')
        assert response.get_json() == []

    def test_returns_categories_sorted_by_name(self, client, make_category):
        make_category(name='Овощи')
        make_category(name='Крупы')
        make_category(name='Заморозка')

        response = client.get('/reserve_categories')
        data = response.get_json()

        assert len(data) == 3
        names = [c['name'] for c in data]
        assert names == sorted(names)

    def test_response_contains_id_and_name(self, client, make_category):
        cat = make_category(name='Крупы')

        response = client.get('/reserve_categories')
        data = response.get_json()

        assert len(data) == 1
        assert data[0]['id'] == cat.id
        assert data[0]['name'] == 'Крупы'


class TestCreateCategory:
    """POST /reserve_categories."""

    def test_missing_name(self, client):
        response = client.post('/reserve_categories', json={})
        assert response.status_code == 400
        assert response.get_json()['error'] == 'Name is required'

    def test_empty_name(self, client):
        response = client.post('/reserve_categories', json={'name': ''})
        assert response.status_code == 400
        assert response.get_json()['error'] == 'Name is required'

    def test_whitespace_name(self, client):
        response = client.post('/reserve_categories', json={'name': '   '})
        assert response.status_code == 400
        assert response.get_json()['error'] == 'Name is required'

    def test_duplicate_name(self, client, make_category):
        make_category(name='Крупы')
        response = client.post('/reserve_categories', json={'name': 'Крупы'})
        assert response.status_code == 409
        assert response.get_json()['error'] == 'Category with this name already exists'

    def test_successful_creation(self, client):
        response = client.post('/reserve_categories', json={'name': 'Крупы'})
        assert response.status_code == 201
        data = response.get_json()
        assert 'id' in data
        assert data['name'] == 'Крупы'

    def test_name_is_stripped(self, client):
        response = client.post('/reserve_categories', json={'name': '  Крупы  '})
        assert response.status_code == 201
        assert response.get_json()['name'] == 'Крупы'

    def test_duplicate_after_strip(self, client, make_category):
        make_category(name='Крупы')
        response = client.post('/reserve_categories', json={'name': '  Крупы  '})
        assert response.status_code == 409

    def test_no_data_sent(self, client):
        # Без body Flask возвращает request.json == None → 400
        response = client.post('/reserve_categories', json={})
        assert response.status_code == 400
        assert response.get_json()['error'] == 'Name is required'


class TestUpdateCategory:
    """PATCH /reserve_category/<id> — обновление имени."""

    def test_missing_name_and_action(self, client, make_category):
        cat = make_category(name='Крупы')
        response = client.patch(f'/reserve_category/{cat.id}', json={})
        assert response.status_code == 400
        assert response.get_json()['error'] == 'Missing name or action parameter'

    def test_successful_rename(self, client, make_category):
        cat = make_category(name='Крупы')
        response = client.patch(f'/reserve_category/{cat.id}', json={'name': 'Крупы и бобовые'})
        assert response.status_code == 200
        data = response.get_json()
        assert data['name'] == 'Крупы и бобовые'

    def test_name_stripped_on_update(self, client, make_category):
        cat = make_category(name='Крупы')
        response = client.patch(f'/reserve_category/{cat.id}', json={'name': '  Крупы и бобовые  '})
        assert response.status_code == 200
        assert response.get_json()['name'] == 'Крупы и бобовые'

    def test_duplicate_name(self, client, make_category):
        cat1 = make_category(name='Крупы')
        cat2 = make_category(name='Овощи')
        response = client.patch(f'/reserve_category/{cat2.id}', json={'name': 'Крупы'})
        assert response.status_code == 409
        assert response.get_json()['error'] == 'Category with this name already exists'

    def test_same_name_not_duplicate(self, client, make_category):
        cat = make_category(name='Крупы')
        response = client.patch(f'/reserve_category/{cat.id}', json={'name': 'Крупы'})
        assert response.status_code == 200

    def test_empty_name_keeps_old(self, client, make_category):
        cat = make_category(name='Крупы')
        response = client.patch(f'/reserve_category/{cat.id}', json={'name': ''})
        assert response.status_code == 200
        assert response.get_json()['name'] == 'Крупы'

    def test_nonexistent_id(self, client):
        response = client.patch('/reserve_category/999', json={'name': 'Крупы'})
        assert response.status_code == 404


class TestDeleteCategory:
    """PATCH /reserve_category/<id> — action: delete."""

    def test_delete_with_action(self, client, make_category):
        cat = make_category(name='Крупы')
        response = client.patch(f'/reserve_category/{cat.id}', json={'action': 'delete'})
        assert response.status_code == 204

    def test_delete_sets_related_reserves_category_to_null(self, client, make_category, make_reserve):
        cat = make_category(name='Крупы')
        reserve = make_reserve(kind='Рис', description='Длиннозерный', quantity=2, category_id=cat.id)

        response = client.patch(f'/reserve_category/{cat.id}', json={'action': 'delete'})
        assert response.status_code == 204

        # Запас должен остаться, но category_id = None
        from app import db
        from app.models import Reserve
        reserve = db.session.get(Reserve, reserve.id)
        assert reserve is not None
        assert reserve.category_id is None

    def test_delete_removes_category(self, client, make_category):
        cat = make_category(name='Крупы')
        client.patch(f'/reserve_category/{cat.id}', json={'action': 'delete'})

        from app import db
        from app.models import ReserveCategory
        cat = db.session.get(ReserveCategory, cat.id)
        assert cat is None

    def test_delete_with_related_reserves_keeps_them(self, client, make_category, make_reserve):
        cat = make_category(name='Крупы')
        r1 = make_reserve(kind='Рис', quantity=1, category_id=cat.id)
        r2 = make_reserve(kind='Гречка', quantity=1, category_id=cat.id)

        client.patch(f'/reserve_category/{cat.id}', json={'action': 'delete'})

        from app import db
        from app.models import Reserve
        assert db.session.get(Reserve, r1.id) is not None
        assert db.session.get(Reserve, r2.id) is not None

    def test_delete_nonexistent(self, client):
        response = client.patch('/reserve_category/999', json={'action': 'delete'})
        assert response.status_code == 404

    def test_delete_without_action(self, client, make_category):
        cat = make_category(name='Крупы')
        response = client.patch(f'/reserve_category/{cat.id}', json={})
        assert response.status_code == 400
        assert response.get_json()['error'] == 'Missing name or action parameter'

    def test_delete_without_name_or_action(self, client, make_category):
        cat = make_category(name='Крупы')
        response = client.patch(f'/reserve_category/{cat.id}', json={})
        assert response.status_code == 400


class TestCategoryUniquenessCase:
    """Зафиксировать поведение регистрозависимости уникальности."""

    def test_case_sensitive_uniqueness(self, client, make_category):
        """SQLite сравнивает строки без учёта collation по умолчанию.
        'Крупа' и 'крупа' — разные значения.
        """
        make_category(name='Крупа')
        response = client.post('/reserve_categories', json={'name': 'крупа'})
        assert response.status_code == 201
        # Обе категории существуют — это текущее поведение.
        # Для нормализации нужно LOWER() в БД.
