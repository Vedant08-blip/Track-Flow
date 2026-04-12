# Backend Integration Guide

This project now includes a basic backend service in `backend/`. It exposes a minimal REST API surface and is ready for you to plug in controllers, models, and database logic.

## What Was Added
- `backend/server.js` to boot an Express server with security headers, logging, JSON parsing, and CORS.
- `backend/routes/index.js` with a health check and placeholder endpoints.
- A basic integration path for the frontend via API base URL.

## Backend Structure
- `backend/server.js` – Express app bootstrap.
- `backend/config/database.js` – Environment-driven config.
- `backend/routes/index.js` – API routes.
- `backend/controllers/` – (to be wired) route handlers.
- `backend/models/` – (to be wired) MongoDB models.

## Run The Backend
```bash
cd backend
npm install
npm run dev
```

Defaults:
- API base: `http://localhost:5000/api/v1`
- Health: `GET /api/v1/health`
- CORS origin: `http://localhost:5173` (configurable via env)


## Frontend Integration (Recommended)
Add a frontend env variable and use it in API calls:

```
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Example usage:
```js
const API_BASE = import.meta.env.VITE_API_BASE_URL;
fetch(`${API_BASE}/health`);
```

## Repo-Friendly Notes
- No secrets are stored in code. Use `.env` for local values.
- Backend is in its own folder and can be deployed separately.
- The frontend can be pointed to any API base URL through `VITE_API_BASE_URL`.

## Next Steps
1. Create controllers inside `backend/controllers/`.
2. Define Mongoose models in `backend/models/`.
3. Replace placeholder routes in `backend/routes/index.js` with real routes.
