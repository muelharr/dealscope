# --- STAGE 1: Dependencies ---
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --legacy-peer-deps

# --- STAGE 2: Builder ---
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/
COPY src ./src

RUN npx prisma generate
RUN npm run build
RUN npm prune --production --legacy-peer-deps

# --- STAGE 3: Production Runner ---
FROM node:20-alpine AS runner
WORKDIR /app

# Install curl for docker healthchecks
RUN apk add --no-cache curl

ENV NODE_ENV=production
ENV PORT=4000

# Create non-root user and set permissions
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 expressjs

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
COPY scripts/deploy.sh ./scripts/deploy.sh

RUN chmod +x ./scripts/deploy.sh && \
    chown -R expressjs:nodejs /app

USER expressjs

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:4000/api/v1/health || exit 1

ENTRYPOINT ["./scripts/deploy.sh"]
