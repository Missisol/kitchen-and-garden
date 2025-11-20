### For production:
`docker compose up --build`

### For development:
`docker compose -f compose.dev.yaml up --build`

The development setup enables:
- Hot-reloading for both backend (Flask --reload) and frontend (Vite dev server)
- Source code mounted as volumes for live changes
- Debug mode enabled for backend
- Separate container names (backend-dev, frontend-dev) to avoid conflicts

Both configurations share the same network, so services can communicate.