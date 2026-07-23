# DealScope

DealScope is a high-performance Shopping Intelligence Platform designed to empower data-driven purchasing decisions. It aggregates product information, compares prices across marketplaces, and leverages AI for market forecasting and deal scoring.

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (v4)
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **ORM:** Prisma
- **Auth:** Better Auth
- **Cache:** Redis

## Folder Structure
- `src/app/`: Next.js App Router routes.
- `src/components/`: Reusable UI primitives and feature-specific components.
- `src/types/`: Shared TypeScript models.
- `docs/`: Project documentation and design assets.

## Installation
```bash
npm install
npm run dev
```

## Deployment
Deployed via Vercel. Ensure `DATABASE_URL`, `REDIS_URL`, and authentication secrets are configured.
