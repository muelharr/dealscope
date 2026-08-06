# DealScope

DealScope is an intelligence-driven market analysis and product comparison web application designed to help consumers locate best pricing deals, track historical prices, and generate AI insights for comparisons.

---

## 🚀 Project Architecture

The project is structured as a monorepo consisting of:
1. **Frontend**: Next.js 15 application utilizing Turbopack, Tailwind CSS, TanStack React Query, Framer Motion, and Vitest for testing.
2. **Backend**: Node.js & Express API using Prisma (PostgreSQL), Redis (for caching and BullMQ alerts worker), and Jest for testing.

---

## 🛠️ Getting Started

### Prerequisites
* **Node.js**: v18.x or later
* **PostgreSQL**: Running instance or Docker service
* **Redis**: Running instance for caching and queue processing

### Installation
Clone the repository and install root dependencies:
```bash
npm install
```
Then, install backend dependencies:
```bash
cd backend
npm install
```

### Environment Config
Ensure you have created the `.env` configuration files for both the root (frontend) and backend workspaces based on their respective `.env.example` templates.

---

## 💻 Development Commands

| Task | Command | Directory |
| --- | --- | --- |
| Run full dev environment (Frontend & Backend) | `npm run dev` | Root |
| Run Frontend dev server | `npm run dev:frontend` | Root |
| Run Backend dev server | `npm run dev:backend` | Root |
| Run Frontend tests (Vitest) | `npm run test` | Root |
| Run Backend tests (Jest) | `npm run test` | `backend/` |
| Lint project files | `npm run lint` | Root |
| Compile Frontend build | `npm run build` | Root |
| Compile Backend build | `npm run build` | `backend/` |

---

## 📚 Detailed Documentation

Refer to the documents in [docs/](file:///d:/Project/dealscope/docs) for technical guides and engineering notes:
* 🗺️ **[Project Architecture](file:///d:/Project/dealscope/docs/ARCHITECTURE.md)**: Main architecture overview.
* 🖥️ **[Frontend Architecture](file:///d:/Project/dealscope/docs/FRONTEND_ARCHITECTURE.md)**: App Router, state management, and page structure.
* ⚙️ **[Backend Architecture](file:///d:/Project/dealscope/docs/backend-architecture.md)**: Database schemas, alert evaluation, and BullMQ worker.
* 🎨 **[Design System](file:///d:/Project/dealscope/docs/design-system.md)**: Custom spacing, typography scale, and components guide.
* ☁️ **[Deployment Guide](file:///d:/Project/dealscope/docs/DEPLOYMENT.md)**: Server setup, continuous integration, and production delivery.

