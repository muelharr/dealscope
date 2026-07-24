-- AlterTable: Update session table schema to align with security requirements
ALTER TABLE "sessions" RENAME COLUMN "token" TO "refreshTokenHash";
ALTER TABLE "sessions" ADD COLUMN "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "sessions" ADD COLUMN "revokedAt" TIMESTAMP(3);

-- AlterTable: Update products table schema to make it marketplace-independent and support specifications/soft deletes
ALTER TABLE "products" RENAME COLUMN "title" TO "name";
ALTER TABLE "products" DROP COLUMN "currentPrice";
ALTER TABLE "products" DROP COLUMN "originalPrice";
ALTER TABLE "products" DROP COLUMN "imageUrl";
ALTER TABLE "products" ADD COLUMN "images" TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE "products" ADD COLUMN "specifications" JSONB NOT NULL DEFAULT '{}';
ALTER TABLE "products" ADD COLUMN "deletedAt" TIMESTAMP(3);

-- CreateEnum: Add Currency and StockStatus enums
CREATE TYPE "Currency" AS ENUM ('IDR', 'USD', 'EUR', 'GBP');
CREATE TYPE "StockStatus" AS ENUM ('IN_STOCK', 'OUT_OF_STOCK', 'PREORDER', 'BACKORDER', 'DISCONTINUED');

-- AlterTable: Update marketplace_offers schema and drop redundant attributes
ALTER TABLE "marketplace_offers" RENAME COLUMN "url" TO "productUrl";
ALTER TABLE "marketplace_offers" DROP COLUMN "inStock";
ALTER TABLE "marketplace_offers" DROP COLUMN "availabilityText";
ALTER TABLE "marketplace_offers" DROP COLUMN "availabilityType";
ALTER TABLE "marketplace_offers" ADD COLUMN "sellerId" TEXT;
ALTER TABLE "marketplace_offers" ADD COLUMN "originalPrice" DECIMAL(12,2) NOT NULL DEFAULT 0.00;
ALTER TABLE "marketplace_offers" ADD COLUMN "currency" "Currency" NOT NULL DEFAULT 'USD';
ALTER TABLE "marketplace_offers" ADD COLUMN "stockStatus" "StockStatus" NOT NULL DEFAULT 'IN_STOCK';
ALTER TABLE "marketplace_offers" ADD COLUMN "shippingCost" DECIMAL(12,2) NOT NULL DEFAULT 0.00;
ALTER TABLE "marketplace_offers" ADD COLUMN "shippingEstimate" TEXT;
ALTER TABLE "marketplace_offers" ADD COLUMN "marketplaceRating" DECIMAL(3,2);
ALTER TABLE "marketplace_offers" ADD COLUMN "reviewCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "marketplace_offers" ADD COLUMN "isOfficialStore" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "marketplace_offers" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "marketplace_offers" ADD COLUMN "lastScrapedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex: Add performance indexes for offers querying
CREATE INDEX "marketplace_offers_productId_idx" ON "marketplace_offers"("productId");
CREATE INDEX "marketplace_offers_marketplaceId_idx" ON "marketplace_offers"("marketplaceId");
CREATE INDEX "marketplace_offers_isActive_idx" ON "marketplace_offers"("isActive");
CREATE INDEX "marketplace_offers_price_idx" ON "marketplace_offers"("price");
CREATE INDEX "marketplace_offers_stockStatus_idx" ON "marketplace_offers"("stockStatus");
CREATE INDEX "marketplace_offers_lastScrapedAt_idx" ON "marketplace_offers"("lastScrapedAt");

-- DropTable: Remove old price_history table
DROP TABLE IF EXISTS "price_history" CASCADE;

-- CreateTable: Create new price_histories table with composite indexes
CREATE TABLE "price_histories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "marketplaceOfferId" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "originalPrice" DECIMAL(12,2) NOT NULL,
    "shippingCost" DECIMAL(12,2) NOT NULL,
    "currency" "Currency" NOT NULL,
    "stockStatus" "StockStatus" NOT NULL,
    "marketplaceRating" DECIMAL(3,2),
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "price_histories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "price_histories" ADD CONSTRAINT "price_histories_marketplaceOfferId_fkey" FOREIGN KEY ("marketplaceOfferId") REFERENCES "marketplace_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_histories" ADD CONSTRAINT "price_histories_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex: Add performance indexes for history querying
CREATE INDEX "price_histories_marketplaceOfferId_idx" ON "price_histories"("marketplaceOfferId");
CREATE INDEX "price_histories_productId_idx" ON "price_histories"("productId");
CREATE INDEX "price_histories_recordedAt_idx" ON "price_histories"("recordedAt");
CREATE INDEX "price_histories_marketplaceOfferId_recordedAt_idx" ON "price_histories"("marketplaceOfferId", "recordedAt");
CREATE INDEX "price_histories_productId_recordedAt_idx" ON "price_histories"("productId", "recordedAt");



