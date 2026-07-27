# DealScope Deployment Guide

Comprehensive deployment documentation for **DealScope** (Next.js 15 Frontend & Node.js Express/Prisma/BullMQ Backend).

---

## 1. Local Development Setup

### Prerequisites
- Node.js v20.x or higher
- Docker & Docker Compose
- PostgreSQL 16 & Redis 7 (or run via Docker)

### Step-by-Step
1. **Clone the Repository & Install Dependencies**:
   ```bash
   git clone https://github.com/your-org/dealscope.git
   cd dealscope
   npm install
   cd backend && npm install
   ```

2. **Configure Environment Variables**:
   - Copy `.env.example` to `.env` in root.
   - Copy `backend/.env.example` to `backend/.env`.

3. **Start Local Database & Cache**:
   ```bash
   docker-compose up -d postgres redis
   ```

4. **Run Prisma Migrations & Seed Data**:
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Start Development Servers (Concurrently)**:
   ```bash
   # From root directory
   npm run dev
   ```
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:4000`

---

## 2. Staging Deployment

### Frontend (Vercel Preview)
- Connect GitHub repository to Vercel.
- Set `Framework Preset` to **Next.js**.
- Configure Environment Variable in Vercel Project Settings:
  - `NEXT_PUBLIC_API_URL`: `https://staging-api.dealscope.com/api/v1`
  - `NEXT_PUBLIC_SOCKET_URL`: `https://staging-api.dealscope.com`
- Pull Requests automatically generate Vercel Preview Deployments.

### Backend (Railway / Render / Docker Container)
- Deploy backend using Dockerfile:
  - Build context: `./backend`
  - Dockerfile: `./backend/Dockerfile`
  - Port: `4000`
- Set Staging Environment Variables (`DATABASE_URL`, `REDIS_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`).

---

## 3. Production Deployment

### Option A: Vercel + Self-Hosted VPS (Docker Compose)

1. **Deploy Frontend to Vercel**:
   ```bash
   vercel --prod
   ```
   - Configure domain `dealscope.com` on Vercel.

2. **Deploy Backend Services on VPS**:
   - Copy repository to VPS server.
   - Create `.env.production` on VPS with strong secret keys.
   - Run production containers using Docker Compose:
     ```bash
     docker-compose -f docker-compose.prod.yml up -d --build
     ```

3. **Verify Healthcheck**:
   ```bash
   curl -f http://localhost:4000/api/v1/health
   curl -f http://localhost:4000/api/scraper/status
   ```

---

## 4. Zero-Downtime Deployment & Graceful Shutdown

- **Graceful Shutdown**: Node.js backend catches `SIGTERM` and `SIGINT`, stops accepting new requests, drains WebSocket connections, closes Prisma client, stops BullMQ workers/schedulers, and exits cleanly.
- **Docker Healthcheck**: Docker Compose waits until the backend container passes the `/api/v1/health` check before routing traffic.

---

## 5. Database Migration & Backup Procedures

### Automated Migrations on Deploy
The backend container entrypoint `backend/scripts/deploy.sh` automatically runs:
```bash
npx prisma migrate deploy
```

### PostgreSQL Backup Procedure (`pg_dump`)
Create automated daily backups using `pg_dump`:
```bash
# Manual Backup
docker exec -t dealscope_postgres_prod pg_dump -U dealscope_user dealscope_db | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz

# Automated Crontab (Run daily at 2:00 AM)
0 2 * * * docker exec -t dealscope_postgres_prod pg_dump -U dealscope_user dealscope_db | gzip > /backups/dealscope_$(date +\%Y\%m\%d).sql.gz
```

### Database Restore Procedure (`pg_restore`)
```bash
gunzip -c backup_20260727_020000.sql.gz | docker exec -i dealscope_postgres_prod psql -U dealscope_user -d dealscope_db
```

---

## 6. Secrets Management Guidelines

| Secret / Env Variable | Scope | Storage Location | Recommendation |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Frontend | Vercel Environment Variables | Public URL |
| `NEXT_PUBLIC_SOCKET_URL` | Frontend | Vercel Environment Variables | Public WebSocket URL |
| `DATABASE_URL` | Backend | Railway / Vercel Secrets / Docker Env | Private secret (do NOT commit) |
| `REDIS_URL` | Backend | Railway / Docker Env | Private secret |
| `JWT_ACCESS_SECRET` | Backend | Vault / Docker Env | Minimum 32-char random string |
| `JWT_REFRESH_SECRET` | Backend | Vault / Docker Env | Minimum 32-char random string |
| `SCRAPER_PROXY_URL` | Backend | Docker Env | Optional proxy string |
