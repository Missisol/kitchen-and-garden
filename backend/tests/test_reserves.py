"""Тесты для CRUD запасов Reserve."""
from datetime import date, datetime, timezone

from app import db
from app.models import Reserve, ReserveCategory


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _json(response):
    return response.get_json()


# ---------------------------------------------------------------------------
# POST /reserve  — create_reserve
# ---------------------------------------------------------------------------

class TestCreateReserve:
    """POST /reserve."""

    def test_valid_data(self, client, make_category):
        cat = make_category(name='Крупы')
        response = client.post('/reserve', json={
            'kind': 'Рис',
            'description': 'Длиннозерный',
            'quantity': 2,
        })
        assert response.status_code == 201
        data = _json(response)
        assert data['kind'] == 'Рис'
        assert data['description'] == 'Длиннозерный'
        assert data['quantity'] == 2.0
        assert data['category_id'] is None  # не передан
        assert data['is_active'] is True
        assert data['created_at'] is not None
        assert 'id' in data

    def test_missing_body(self, client):
        # json={} отправляет пустой dict — request.json не None
        # Но _validate_reserve проверит и вернёт ошибку
        response = client.post('/reserve', json={})
        assert response.status_code == 400
        assert _json(response)['error'] == 'Request body is required'

    def test_empty_json(self, client):
        response = client.post('/reserve', json={})
        assert response.status_code == 400

    def test_empty_kind(self, client):
        response = client.post('/reserve', json={
            'kind': '',
            'description': 'test',
            'quantity': 1,
        })
        assert response.status_code == 400

    def test_whitespace_kind(self, client):
        response = client.post('/reserve', json={
            'kind': '   ',
            'description': 'test',
            'quantity': 1,
        })
        assert response.status_code == 400

    def test_missing_description(self, client):
        # _validate_reserve не проверяет description — только kind и quantity.
        # Backend создаёт запись, description будет None.
        response = client.post('/reserve', json={
            'kind': 'Рис',
            'quantity': 1,
        })
        assert response.status_code == 201
        assert _json(response)['description'] is None

    def test_empty_description(self, client):
        response = client.post('/reserve', json={
            'kind': 'Рис',
            'description': '',
            'quantity': 1,
        })
        assert response.status_code == 201

    def test_whitespace_description(self, client):
        response = client.post('/reserve', json={
            'kind': 'Рис',
            'description': '   ',
            'quantity': 1,
        })
        assert response.status_code == 201
        assert _json(response)['description'] == '   '

    def test_zero_quantity(self, client):
        response = client.post('/reserve', json={
            'kind': 'Рис',
            'description': 'test',
            'quantity': 0,
        })
        assert response.status_code == 400

    def test_negative_quantity(self, client):
        response = client.post('/reserve', json={
            'kind': 'Рис',
            'description': 'test',
            'quantity': -1,
        })
        assert response.status_code == 400

    def test_string_quantity(self, client):
        response = client.post('/reserve', json={
            'kind': 'Рис',
            'description': 'test',
            'quantity': 'abc',
        })
        assert response.status_code == 400

    def test_quantity_as_string(self, client):
        response = client.post('/reserve', json={
            'kind': 'Рис',
            'description': 'test',
            'quantity': '2.5',
        })
        assert response.status_code == 201
        assert _json(response)['quantity'] == 2.5

    def test_null_quantity(self, client):
        response = client.post('/reserve', json={
            'kind': 'Рис',
            'description': 'test',
            'quantity': None,
        })
        assert response.status_code == 400

    def test_all_optional_fields(self, client, make_category):
        cat = make_category(name='Крупы')
        response = client.post('/reserve', json={
            'kind': 'Рис',
            'description': 'Длиннозерный',
            'quantity': 2,
            'unit': 'кг',
            'expiry_date': '2025-12-31',
            'location': 'Кладовая',
            'place': 'Полка 2',
            'is_active': False,
            'category_id': cat.id,
        })
        assert response.status_code == 201
        data = _json(response)
        assert data['unit'] == 'кг'
        assert data['expiry_date'] == '2025-12-31'
        assert data['location'] == 'Кладовая'
        assert data['place'] == 'Полка 2'
        assert data['is_active'] is False
        assert data['category_id'] == cat.id

    def test_category_id_null_when_not_passed(self, client):
        response = client.post('/reserve', json={
            'kind': 'Рис',
            'description': 'test',
            'quantity': 1,
        })
        assert response.status_code == 201
        assert _json(response)['category_id'] is None

    def test_category_id_null_explicitly(self, client, make_category):
        cat = make_category(name='Крупы')
        response = client.post('/reserve', json={
            'kind': 'Рис',
            'description': 'test',
            'quantity': 1,
            'category_id': None,
        })
        assert response.status_code == 201
        assert _json(response)['category_id'] is None

    def test_category_id_zero_treated_as_null(self, client, make_category):
        """0 — truthy в JS, но в Python 0 — falsy. data.get('category_id') вернёт 0,
        и None if 0 else None даст None.
        """
        response = client.post('/reserve', json={
            'kind': 'Рис',
            'description': 'test',
            'quantity': 1,
            'category_id': 0,
        })
        assert response.status_code == 201
        # category_id=0 → None из-за if category_id else None
        assert _json(response)['category_id'] is None

    def test_is_active_defaults_to_true(self, client):
        response = client.post('/reserve', json={
            'kind': 'Рис',
            'description': 'test',
            'quantity': 1,
        })
        assert response.status_code == 201
        assert _json(response)['is_active'] is True

    def test_invalid_expiry_date_ignored(self, client):
        response = client.post('/reserve', json={
            'kind': 'Рис',
            'description': 'test',
            'quantity': 1,
            'expiry_date': 'не-дата',
        })
        assert response.status_code == 201
        # Текущее поведение: молчаливо None
        assert _json(response)['expiry_date'] is None


# ---------------------------------------------------------------------------
# GET /reserves  — get_reserves
# ---------------------------------------------------------------------------

class TestGetReserves:
    """GET /reserves."""

    def test_returns_200(self, client):
        response = client.get('/reserves')
        assert response.status_code == 200

    def test_returns_empty_list(self, client):
        response = client.get('/reserves')
        assert response.get_json() == []

    def test_default_sort_desc_by_created_at(self, client, make_reserve):
        from datetime import datetime, timezone
        import time

        r1 = make_reserve(kind='A', description='test', quantity=1)
        time.sleep(0.01)
        r2 = make_reserve(kind='B', description='test', quantity=1)

        response = client.get('/reserves')
        data = response.get_json()
        assert len(data) == 2
        # По умолчанию desc — новый первый
        assert data[0]['id'] == r2.id

    def test_status_active(self, client, make_reserve):
        make_reserve(kind='Active', is_active=True)
        make_reserve(kind='Inactive', is_active=False)

        response = client.get('/reserves?status=active')
        data = response.get_json()
        assert len(data) == 1
        assert data[0]['kind'] == 'Active'

    def test_status_inactive(self, client, make_reserve):
        make_reserve(kind='Active', is_active=True)
        make_reserve(kind='Inactive', is_active=False)

        response = client.get('/reserves?status=inactive')
        data = response.get_json()
        assert len(data) == 1
        assert data[0]['kind'] == 'Inactive'

    def test_status_all(self, client, make_reserve):
        make_reserve(kind='Active', is_active=True)
        make_reserve(kind='Inactive', is_active=False)

        response = client.get('/reserves?status=all')
        assert len(response.get_json()) == 2

    def test_status_unknown_ignores_filter(self, client, make_reserve):
        make_reserve(kind='A', is_active=True)
        make_reserve(kind='B', is_active=False)

        response = client.get('/reserves?status=unknown')
        # Мусорный статус → без фильтра по is_active
        assert len(response.get_json()) == 2

    def test_filter_by_category(self, client, make_reserve, make_category):
        cat1 = make_category(name='Крупы')
        cat2 = make_category(name='Овощи')
        make_reserve(kind='Рис', category_id=cat1.id)
        make_reserve(kind='Морковь', category_id=cat2.id)

        response = client.get(f'/reserves?category_id={cat1.id}')
        data = response.get_json()
        assert len(data) == 1
        assert data[0]['kind'] == 'Рис'

    def test_invalid_category_id_ignored(self, client, make_reserve):
        make_reserve(kind='Рис', quantity=1)
        response = client.get('/reserves?category_id=abc')
        # type=int → None → без фильтра
        assert len(response.get_json()) == 1

    def test_sort_by_kind_asc(self, client, make_reserve):
        make_reserve(kind='Гречка', quantity=1)
        make_reserve(kind='Рис', quantity=1)

        response = client.get('/reserves?sort=kind&order=asc')
        data = response.get_json()
        assert data[0]['kind'] == 'Гречка'

    def test_sort_by_kind_desc(self, client, make_reserve):
        make_reserve(kind='Гречка', quantity=1)
        make_reserve(kind='Рис', quantity=1)

        response = client.get('/reserves?sort=kind&order=desc')
        data = response.get_json()
        assert data[0]['kind'] == 'Рис'

    def test_sort_by_quantity_asc(self, client, make_reserve):
        make_reserve(kind='A', quantity=5)
        make_reserve(kind='B', quantity=1)

        response = client.get('/reserves?sort=quantity&order=asc')
        assert response.get_json()[0]['quantity'] == 1.0

    def test_sort_by_quantity_desc(self, client, make_reserve):
        make_reserve(kind='A', quantity=5)
        make_reserve(kind='B', quantity=1)

        response = client.get('/reserves?sort=quantity&order=desc')
        assert response.get_json()[0]['quantity'] == 5.0

    def test_sort_by_category(self, client, make_reserve, make_category):
        cat1 = make_category(name='Овощи')
        cat2 = make_category(name='Крупы')
        make_reserve(kind='Морковь', category_id=cat1.id)
        make_reserve(kind='Рис', category_id=cat2.id)

        response = client.get('/reserves?sort=category&order=asc')
        data = response.get_json()
        # Крупы < Овощи по алфавиту
        assert data[0]['category_name'] == 'Крупы'
        assert data[1]['category_name'] == 'Овощи'

    def test_sort_by_category_with_null_category(self, client, make_reserve, make_category):
        cat = make_category(name='Крупы')
        make_reserve(kind='Рис', category_id=cat.id)
        make_reserve(kind='Масло', category_id=None)

        response = client.get('/reserves?sort=category&order=asc')
        data = response.get_json()
        assert len(data) == 2
        # Запас без категории имеет category_name == ''
        null_reserve = [r for r in data if r['kind'] == 'Масло'][0]
        assert null_reserve['category_name'] == ''

    def test_sort_by_location(self, client, make_reserve):
        make_reserve(kind='A', location='Кладовая')
        make_reserve(kind='B', location='Погреб')

        response = client.get('/reserves?sort=location&order=asc')
        data = response.get_json()
        assert data[0]['kind'] == 'A'

    def test_sort_by_place(self, client, make_reserve):
        make_reserve(kind='A', place='Полка 2')
        make_reserve(kind='B', place='Полка 1')

        response = client.get('/reserves?sort=place&order=asc')
        data = response.get_json()
        assert data[0]['kind'] == 'B'

    def test_sort_by_expiry_date(self, client, make_reserve):
        make_reserve(kind='A', expiry_date='2026-01-01')
        make_reserve(kind='B', expiry_date='2025-06-01')

        response = client.get('/reserves?sort=expiry_date&order=asc')
        data = response.get_json()
        assert data[0]['kind'] == 'B'

    def test_unknown_sort_fallback(self, client, make_reserve):
        make_reserve(kind='A', quantity=1)
        response = client.get('/reserves?sort=unknown')
        # Fallback на created_at desc
        assert response.status_code == 200

    def test_unknown_order_fallback(self, client, make_reserve):
        make_reserve(kind='A', quantity=1)
        response = client.get('/reserves?order=unknown')
        # Fallback на desc
        assert response.status_code == 200

    def test_response_has_category_name_for_null_category(self, client, make_reserve):
        make_reserve(kind='Рис', category_id=None)
        data = client.get('/reserves').get_json()
        assert data[0]['category_name'] == ''

    def test_response_has_null_expiry_date(self, client, make_reserve):
        make_reserve(kind='Рис', quantity=1, expiry_date=None)
        data = client.get('/reserves').get_json()
        assert data[0]['expiry_date'] is None


# ---------------------------------------------------------------------------
# GET /reserve/<id>
# ---------------------------------------------------------------------------

class TestGetReserve:
    """GET /reserve/<id>."""

    def test_existing_reserve(self, client, make_reserve):
        reserve = make_reserve(kind='Рис', quantity=2.5)

        response = client.get(f'/reserve/{reserve.id}')
        assert response.status_code == 200
        data = response.get_json()
        assert data['id'] == reserve.id
        assert data['kind'] == 'Рис'
        assert data['quantity'] == 2.5

    def test_nonexistent(self, client):
        response = client.get('/reserve/999')
        assert response.status_code == 404


# ---------------------------------------------------------------------------
# PUT /reserve/<id>
# ---------------------------------------------------------------------------

class TestUpdateReserve:
    """PUT /reserve/<id> — полная замена."""

    def test_full_update(self, client, make_reserve):
        reserve = make_reserve(kind='Рис', quantity=2, description='Длиннозерный')
        original_created = reserve.created_at.isoformat()

        response = client.put(f'/reserve/{reserve.id}', json={
            'kind': 'Гречка',
            'description': 'Ядрица',
            'quantity': 5,
        })
        assert response.status_code == 200
        data = response.get_json()
        assert data['kind'] == 'Гречка'
        assert data['description'] == 'Ядрица'
        assert data['quantity'] == 5.0
        # created_at не меняется (формат может отличаться — сравниваем даты)
        assert data['created_at'][:10] == original_created[:10]

    def test_validation_error_does_not_change_record(self, client, make_reserve):
        reserve = make_reserve(kind='Рис', quantity=2)
        original_kind = reserve.kind

        response = client.put(f'/reserve/{reserve.id}', json={
            'kind': '',
            'description': 'test',
            'quantity': 1,
        })
        assert response.status_code == 400

        # Запись не изменилась
        db.session.refresh(reserve)
        assert reserve.kind == original_kind

    def test_is_active_not_passed_keeps_old(self, client, make_reserve):
        reserve = make_reserve(kind='Рис', is_active=False)

        response = client.put(f'/reserve/{reserve.id}', json={
            'kind': 'Гречка',
            'description': 'test',
            'quantity': 1,
        })
        assert response.status_code == 200
        assert response.get_json()['is_active'] is False

    def test_category_id_null_clears_category(self, client, make_reserve, make_category):
        cat = make_category(name='Крупы')
        reserve = make_reserve(kind='Рис', category_id=cat.id)

        response = client.put(f'/reserve/{reserve.id}', json={
            'kind': 'Рис',
            'description': 'test',
            'quantity': 1,
            'category_id': None,
        })
        assert response.status_code == 200
        assert response.get_json()['category_id'] is None

        db.session.refresh(reserve)
        assert reserve.category_id is None

    def test_validation_error_on_missing_kind(self, client, make_reserve):
        reserve = make_reserve(kind='Рис', quantity=1)
        response = client.put(f'/reserve/{reserve.id}', json={
            'description': 'test',
            'quantity': 1,
        })
        assert response.status_code == 400

    def test_nonexistent(self, client):
        response = client.put('/reserve/999', json={
            'kind': 'Рис',
            'description': 'test',
            'quantity': 1,
        })
        assert response.status_code == 404


# ---------------------------------------------------------------------------
# PATCH /reserve/<id>
# ---------------------------------------------------------------------------

class TestUpdateReservePartial:
    """PATCH /reserve/<id> — частичное обновление."""

    def test_toggle_is_active(self, client, make_reserve):
        reserve = make_reserve(kind='Рис', is_active=True)

        response = client.patch(f'/reserve/{reserve.id}', json={'is_active': False})
        assert response.status_code == 200
        assert response.get_json()['is_active'] is False

        db.session.refresh(reserve)
        assert reserve.is_active is False

    def test_toggle_inactive_to_active(self, client, make_reserve):
        reserve = make_reserve(kind='Рис', is_active=False)

        response = client.patch(f'/reserve/{reserve.id}', json={'is_active': True})
        assert response.status_code == 200
        assert response.get_json()['is_active'] is True

    def test_empty_body(self, client, make_reserve):
        reserve = make_reserve(kind='Рис', quantity=1)
        response = client.patch(f'/reserve/{reserve.id}', json={})
        assert response.status_code == 400
        assert response.get_json()['error'] == 'No data provided'

    def test_partial_update_kind(self, client, make_reserve):
        reserve = make_reserve(kind='Рис', description='test', quantity=1)

        response = client.patch(f'/reserve/{reserve.id}', json={'kind': 'Гречка'})
        assert response.status_code == 200
        assert response.get_json()['id'] == reserve.id

        db.session.refresh(reserve)
        assert reserve.kind == 'Гречка'
        assert reserve.description == 'test'  # не изменился

    def test_partial_update_quantity(self, client, make_reserve):
        reserve = make_reserve(kind='Рис', quantity=1)

        response = client.patch(f'/reserve/{reserve.id}', json={'quantity': 5})
        assert response.status_code == 200

        db.session.refresh(reserve)
        assert reserve.quantity == 5.0

    def test_partial_update_expiry_date(self, client, make_reserve):
        reserve = make_reserve(kind='Рис', quantity=1, expiry_date='2025-12-31')

        response = client.patch(f'/reserve/{reserve.id}', json={'expiry_date': '2026-06-01'})
        assert response.status_code == 200

        db.session.refresh(reserve)
        assert reserve.expiry_date == date(2026, 6, 1)

    def test_partial_update_expiry_date_to_null(self, client, make_reserve):
        reserve = make_reserve(kind='Рис', quantity=1, expiry_date='2025-12-31')

        response = client.patch(f'/reserve/{reserve.id}', json={'expiry_date': None})
        assert response.status_code == 200

        db.session.refresh(reserve)
        assert reserve.expiry_date is None

    def test_nonexistent(self, client):
        response = client.patch('/reserve/999', json={'is_active': False})
        assert response.status_code == 404

    # BUG: bool("false") → True
    def test_is_active_string_false(self, client, make_reserve):
        """Текущий баг: bool("false") даёт True."""
        reserve = make_reserve(kind='Рис', is_active=True)

        response = client.patch(f'/reserve/{reserve.id}', json={'is_active': 'false'})
        assert response.status_code == 200
        # bool("false") → True — это баг!
        assert response.get_json()['is_active'] is True


# ---------------------------------------------------------------------------
# DELETE /reserve/<id>
# ---------------------------------------------------------------------------

class TestDeleteReserve:
    """DELETE /reserve/<id>."""

    def test_delete(self, client, make_reserve):
        reserve = make_reserve(kind='Рис', quantity=1)

        response = client.delete(f'/reserve/{reserve.id}')
        assert response.status_code == 204

        # Запись удалена
        response = client.get(f'/reserve/{reserve.id}')
        assert response.status_code == 404

    def test_double_delete(self, client, make_reserve):
        reserve = make_reserve(kind='Рис', quantity=1)
        client.delete(f'/reserve/{reserve.id}')

        response = client.delete(f'/reserve/{reserve.id}')
        assert response.status_code == 404

    def test_delete_nonexistent(self, client):
        response = client.delete('/reserve/999')
        assert response.status_code == 404


# ---------------------------------------------------------------------------
# Error handlers
# ---------------------------------------------------------------------------

class TestErrorHandlers:
    """Тесты обработчиков ошибок 404/500."""

    def test_404_returns_json(self, client):
        response = client.get('/nonexistent')
        assert response.status_code == 404
        assert 'error' in response.get_json()
