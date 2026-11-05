import os
import tempfile
from datetime import date, datetime, timezone

import pytest
from app import create_app, db
from app.models import Reserve, ReserveCategory


class TestConfig:
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite://'  # in-memory
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'test-key'
    UPLOAD_FOLDER = '/tmp/recipe-test-uploads'
    ALLOWED_EXTENSIONS = {'doc', 'docx', 'pdf', 'png', 'jpg', 'jpeg', 'mp4', 'mp3'}
    RECIPES_PER_PAGE = 6


@pytest.fixture()
def app():
    """Создаёт приложение с чистой in-memory БД для каждого теста."""
    with tempfile.TemporaryDirectory() as tmpdir:
        cfg = TestConfig()
        cfg.UPLOAD_FOLDER = os.path.join(tmpdir, 'uploads')
        application = create_app(cfg)

        with application.app_context():
            db.create_all()
            yield application
            db.session.remove()
            db.drop_all()


@pytest.fixture()
def client(app):
    """Тестовый клиент Flask."""
    return app.test_client()


@pytest.fixture()
def make_reserve(app):
    """Фабрика для создания записей Reserve.

    Пример:
        r = make_reserve(kind='Рис', quantity=2)
        r = make_reserve(kind='Картофель', description='Молодой')
    """
    def _create(**kwargs):
        defaults = {
            'kind': 'Тест',
            'description': 'Описание',
            'quantity': 1.0,
            'is_active': True,
            'created_at': datetime.now(timezone.utc),
        }
        defaults.update(kwargs)

        # Парсим expiry_date, если передана строка
        if 'expiry_date' in defaults and isinstance(defaults['expiry_date'], str):
            defaults['expiry_date'] = date.fromisoformat(defaults['expiry_date'])

        reserve = Reserve(**defaults)
        db.session.add(reserve)
        db.session.flush()  # возвращает id
        return reserve

    yield _create

    # Очистка после теста
    db.session.remove()


@pytest.fixture()
def make_category(app):
    """Фабрика для создания категорий ReserveCategory.

    Пример:
        cat = make_category(name='Крупы')
    """
    def _create(name):
        category = ReserveCategory(name=name)
        db.session.add(category)
        db.session.flush()
        return category

    yield _create

    db.session.remove()
