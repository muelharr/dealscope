# Backend Handoff

## Endpoints
- Required: `GET /api/*`, `POST /api/*`, `PATCH /api/*`, `DELETE /api/*`

## Data
- Expects JSON payloads.
- Errors should return { "error": "message" }.

## Authentication
- JWT or Session-based authentication required for all `/api/` endpoints.
