# Docker Setup

This project includes Docker configuration to run both the backend and frontend in containers.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. Build and start all services:
```bash
docker-compose up --build
```

2. Access the application:
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:5002

## Services

### Backend
- **Port**: 5002
- **Container**: recipe-backend
- Automatically runs database migrations on startup
- Database and uploads are persisted via volumes

### Frontend
- **Port**: 8080
- **Container**: recipe-frontend
- Runs in development mode with hot-reload
- Connected to backend via environment variable

## Useful Commands

### Start services
```bash
docker-compose up
```

### Start services in detached mode
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### View logs
```bash
docker-compose logs -f
```

### View logs for specific service
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Rebuild containers
```bash
docker-compose up --build
```

### Execute commands in containers
```bash
# Backend shell
docker-compose exec backend bash

# Run Flask commands
docker-compose exec backend flask db migrate -m "message"
docker-compose exec backend flask db upgrade

# Frontend shell
docker-compose exec frontend sh
```

## Environment Variables

### Backend
- `SECRET_KEY`: Flask secret key (default: 'you-will-never-guess')
- `DATABASE_URL`: Database connection string (default: sqlite:///app.db)
- `FLASK_DEBUG`: Debug mode (default: 0 in Docker)

### Frontend
- `VITE_API_BASE_URL`: Backend API URL (default: http://localhost:5002)

You can override these by creating a `.env` file in the project root or setting them in `docker-compose.yml`.

## Volumes

- `./backend/app.db` - SQLite database (persisted)
- `./backend/static` - Static files and uploads (persisted)
- `./frontend` - Frontend source code (mounted for hot-reload)
- `/app/node_modules` - Node modules (anonymous volume to prevent overwrite)

## Notes

- The database and uploaded files persist between container restarts
- Frontend code changes are reflected immediately due to volume mounting
- Backend code changes require container rebuild or restart

____________________
____________________



## Running project using compose.yaml file

### For production

`docker compose up --build`

`docker compose up --build -d`

### For development

- #### With Compose Watch

[Use Compose Watch](https://docs.docker.com/compose/how-tos/file-watch/)

`docker compose -f compose.dev.yaml up --watch`



- #### Without Compose Watch

`docker compose -f compose.dev.yaml up --build`

In the compose.dev.yaml, you need to uncomment the commented lines.
___________________

The development setup enables:
- Hot-reloading for both backend (Flask --reload) and frontend (Vite dev server)
- Source code mounted as volumes for live changes
- Debug mode enabled for backend
- Separate container names (backend-dev, frontend-dev) to avoid conflicts

Both configurations share the same network, so services can communicate.




