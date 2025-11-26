# Recipe Project - Кухня и сад

Приложение для управления рецептами и заметками

## Основные возможности

- 📖 Создание и управление рецептами
- 🌱 Создание и управление рецептами садовыми заметками
- 📱 PWA-поддержка (установка на мобильные устройства)
- 🔍 Поиск по рецептам и категориям

## Технологии

### Backend
- Python
- Flask
- SQLAlchemy
- Flask-Migrate
- Gunicorn

### Frontend
- Vue 3
- Pinia
- Vite
- PWA-плагин
- Vue Router

## Быстрый старт

### Требования
- Docker и Docker Compose
- Node.js 20+ (для разработки фронтенда)

### Запуск через Docker
```bash
docker compose up --build
```

Приложение будет доступно:
- Frontend: http://localhost:8080
- Backend API: http://localhost:5002

Подробные инструкции по работе с Docker смотрите в [DOCKER.md](DOCKER.md).

## Разработка

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
flask run --host=0.0.0.0 --port=5002
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Запуск через Docker
```bash
docker compose -f compose.dev.yaml up --watch
```

Подробные инструкции по работе с Docker смотрите в [DOCKER.md](DOCKER.md).
