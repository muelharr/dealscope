#!/bin/sh
set -e

echo "🚀 Starting DealScope Backend Deployment Sequence..."

echo "📦 Running Prisma Database Migrations..."
npx prisma migrate deploy

echo "🌱 Checking if Database Seeding is needed..."
if [ "$SEED_ON_DEPLOY" = "true" ]; then
  echo "🌱 Seeding initial database records..."
  npx prisma db seed || echo "⚠️ Seeding skipped or already applied."
fi

echo "✅ Database readiness confirmed. Starting Express server..."
exec node dist/server.js
