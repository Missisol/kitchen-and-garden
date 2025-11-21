### For production:
`docker compose up --build`

### For development:

#### With Compose Watch
`docker compose -f compose.dev.yaml up --watch`

[Use Compose Watch](https://docs.docker.com/compose/how-tos/file-watch/)


#### Without Compose Watch
`docker compose -f compose.dev.yaml up --build`

In the compose.dev.yaml, you need to uncomment the commented lines.

The development setup enables:
- Hot-reloading for both backend (Flask --reload) and frontend (Vite dev server)
- Source code mounted as volumes for live changes
- Debug mode enabled for backend
- Separate container names (backend-dev, frontend-dev) to avoid conflicts

Both configurations share the same network, so services can communicate.