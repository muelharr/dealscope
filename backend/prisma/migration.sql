-- AlterTable: Update session table schema to align with security requirements
ALTER TABLE "sessions" RENAME COLUMN "token" TO "refreshTokenHash";
ALTER TABLE "sessions" ADD COLUMN "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "sessions" ADD COLUMN "revokedAt" TIMESTAMP(3);
