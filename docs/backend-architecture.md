# Backend Architecture Specification

This document serves as the single source of truth for the DealScope backend architecture. All components and endpoints must conform strictly to these design patterns.

---

## 1. Directory Structure

The project is structured under `backend/src`:
- `config/`: System and dependency singletons (Prisma, Redis, environment validation, Swagger).
- `middleware/`: Express middlewares (security, validation, auth, error handling, rate limiting).
- `shared/`: Generic utilities used across modules (standard response engines, pagination adapters, error parsers, logger).
- `modules/`: Feature domains (specifically starting with `health` and `auth`).

---

## 2. Layered Architecture Convention

Every business module must follow a strict three-tier architecture:
1. **Routes Layer (`routes.ts`)**: Defines URLs and HTTP methods, mounts validation schema middleware, and delegates request handling to the Controller.
2. **Controller Layer (`controller.ts`)**: Validates the payload using Zod (via validation middleware), manages Express response cycles, and maps exceptions to standard HTTP response formats.
3. **Service Layer (`service.ts`)**: Handles core business rules and directly interacts with **Prisma client** models. The Repository Pattern is avoided unless database logic exhibits extreme complexity or multi-source requirements.

Naming convention:
- Modules: `lowercase` directories under `modules/`
- Classes: PascalCase (e.g. `AuthController`, `AuthService`)

---

## 3. Standard API Response & Error Contracts

All endpoints versioned under `/api/v1` must return the following JSON payloads:

### Success Payload Schema
```json
{
  "success": true,
  "data": {},
  "pagination": {
    "total": 0,
    "limit": 10,
    "offset": 0,
    "hasMore": false
  },
  "timestamp": "2026-07-24T10:24:00Z"
}
```

### Error Payload Schema
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable summary",
    "details": [
      {
        "field": "propertyName",
        "issue": "Reason for failure"
      }
    ]
  },
  "timestamp": "2026-07-24T10:24:00Z"
}
```

Standardized Error Codes:
- `UNAUTHORIZED`: Invalid or expired access token.
- `FORBIDDEN`: Insufficient role permissions.
- `BAD_REQUEST`: Validation or missing parameter errors.
- `NOT_FOUND`: Resource does not exist.
- `INTERNAL_SERVER_ERROR`: Unhandled runtime exceptions.

---

## 4. Authentication Flow

### Tokens
1. **Access Token (Short-lived)**: 
   - Expiration: 15 minutes.
   - Storage: Passed via HTTP `Authorization: Bearer <token>` header.
2. **Refresh Token (HTTP-only)**:
   - Expiration: 7 days.
   - Storage: Passed via secure, HTTP-only, SameSite=Lax cookie (`refreshToken`).

### Token Rotation (Refresh Flow)
- When the Access Token expires, the client sends the HTTP-only Refresh Token cookie to `/api/v1/auth/refresh`.
- The backend verifies the token, rotates/re-issues a *new* Refresh Token cookie, and returns a *new* short-lived Access Token in the JSON body.
- Re-use of a rotated refresh token immediately invalidates all active sessions for that user to prevent replay attacks.

### Role Authorization
- Roles are represented as strings: `user`, `admin`.
- Middleware `authorize(...roles)` intercepts routes and checks `req.user.role` against requirements before permitting access.

---

## 5. Logging Conventions

DealScope uses a centralized Winston logging adapter (`shared/utils/logger.ts`):
- Log level: `info` in production, `debug` in development.
- Request tracing: Every log message during request resolution must include the `requestId` (injected by `requestId.middleware.ts`).
- Storage: Console outputs formatted with colorization in development; JSON formatted files in production.
