import prisma from '../../config/prisma';
import logger from '../../shared/utils/logger';
import { BaseScraperProvider } from './providers/base.provider';
import { TokopediaScraperProvider } from './providers/tokopedia.provider';
import { ShopeeScraperProvider } from './providers/shopee.provider';
import { ScraperStatusResponse, ProviderStats } from './types';
import { getQueueStats } from './scraper.queue';
import { StockStatus, NotificationType } from '@prisma/client';
import { NotificationService } from '../notifications/service';

const notificationService = new NotificationService();

export class ScraperService {
  private providers: Map<string, BaseScraperProvider> = new Map();

  constructor() {
    const tokopedia = new TokopediaScraperProvider();
    const shopee = new ShopeeScraperProvider();

    this.providers.set(tokopedia.marketplaceSlug, tokopedia);
    this.providers.set(shopee.marketplaceSlug, shopee);
  }

  /**
   * Main Data Pipeline:
   * Scrape product details across all offers -> Normalize -> Upsert MarketplaceOffer ->
   * Insert PriceHistory if changed -> Trigger PriceAlert check -> Recalculate DealScore
   */
  public async scrapeProductAndSync(productId: string): Promise<void> {
    logger.info(`[ScraperService] Starting full scrape pipeline for Product ID: ${productId}`);

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        marketplaceOffers: {
          include: {
            marketplace: true,
          },
        },
      },
    });

    if (!product) {
      logger.error(`[ScraperService] Product not found: ${productId}`);
      return;
    }

    let minCurrentPrice = Infinity;
    let maxOriginalPrice = 0;

    for (const offer of product.marketplaceOffers) {
      const provider = this.providers.get(offer.marketplace.slug);
      if (!provider) {
        logger.warn(`[ScraperService] No scraper provider registered for slug '${offer.marketplace.slug}'`);
        continue;
      }

      try {
        const scraped = await provider.getProductDetail(offer.productUrl);
        const newPrice = scraped.price;
        const oldPrice = Number(offer.price);
        const originalPrice = scraped.originalPrice || Number(offer.originalPrice) || newPrice * 1.15;
        const priceHasChanged = Math.abs(newPrice - oldPrice) > 0.01;

        // Update MarketplaceOffer record
        await prisma.marketplaceOffer.update({
          where: { id: offer.id },
          data: {
            price: newPrice,
            originalPrice,
            stockStatus: scraped.inStock ? StockStatus.IN_STOCK : StockStatus.OUT_OF_STOCK,
            marketplaceRating: scraped.rating,
            reviewCount: scraped.reviewCount,
            isOfficialStore: scraped.isOfficialStore ?? offer.isOfficialStore,
            lastScrapedAt: new Date(),
          },
        });

        // Track price bounds for deal score calculation
        if (newPrice < minCurrentPrice) minCurrentPrice = newPrice;
        if (originalPrice > maxOriginalPrice) maxOriginalPrice = originalPrice;

        // Insert new PriceHistory record if price changed
        if (priceHasChanged) {
          logger.info(`[ScraperService] Price change detected for offer ${offer.id}: ${oldPrice} -> ${newPrice}`);

          await prisma.priceHistory.create({
            data: {
              marketplaceOfferId: offer.id,
              productId: product.id,
              price: newPrice,
              originalPrice,
              shippingCost: 0,
              stockStatus: scraped.inStock ? StockStatus.IN_STOCK : StockStatus.OUT_OF_STOCK,
              marketplaceRating: scraped.rating,
              reviewCount: scraped.reviewCount || 0,
              recordedAt: new Date(),
            },
          });

          // Trigger Price Alert Checks
          await this.triggerPriceAlertCheck(product.id, newPrice);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        logger.error(`[ScraperService] Failed to scrape offer ${offer.id} on ${offer.marketplace.name}: ${msg}`);
      }
    }

    // Recalculate Deal Score for Product (0-100)
    if (minCurrentPrice !== Infinity && maxOriginalPrice > 0) {
      const discountPct = Math.max(0, ((maxOriginalPrice - minCurrentPrice) / maxOriginalPrice) * 100);
      const multiMarketplaceBonus = product.marketplaceOffers.length > 1 ? 10 : 0;
      const newDealScore = Math.min(100, Math.max(10, Math.round(50 + discountPct * 0.8 + multiMarketplaceBonus)));

      await prisma.product.update({
        where: { id: product.id },
        data: { dealScore: newDealScore },
      });

      logger.info(`[ScraperService] Updated DealScore for Product ${product.id}: ${product.dealScore} -> ${newDealScore}`);
    }

    this.checkProviderHealthAlerts();
  }

  /**
   * Price-only check for active PriceAlert monitoring
   */
  public async scrapePriceOnly(offerId: string): Promise<void> {
    logger.info(`[ScraperService] Price-only scrape for Offer ID: ${offerId}`);

    const offer = await prisma.marketplaceOffer.findUnique({
      where: { id: offerId },
      include: {
        marketplace: true,
        product: true,
      },
    });

    if (!offer) return;

    const provider = this.providers.get(offer.marketplace.slug);
    if (!provider) return;

    try {
      const scrapedPrice = await provider.getProductPrice(offer.productUrl);
      const newPrice = scrapedPrice.price;
      const oldPrice = Number(offer.price);

      if (Math.abs(newPrice - oldPrice) > 0.01) {
        await prisma.marketplaceOffer.update({
          where: { id: offer.id },
          data: {
            price: newPrice,
            stockStatus: scrapedPrice.inStock ? StockStatus.IN_STOCK : StockStatus.OUT_OF_STOCK,
            lastScrapedAt: new Date(),
          },
        });

        await prisma.priceHistory.create({
          data: {
            marketplaceOfferId: offer.id,
            productId: offer.productId,
            price: newPrice,
            originalPrice: Number(offer.originalPrice),
            shippingCost: 0,
            stockStatus: scrapedPrice.inStock ? StockStatus.IN_STOCK : StockStatus.OUT_OF_STOCK,
            recordedAt: new Date(),
          },
        });

        await this.triggerPriceAlertCheck(offer.productId, newPrice);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      logger.error(`[ScraperService] Price-only scrape failed for offer ${offerId}: ${msg}`);
    }
  }

  /**
   * New product discovery for popular keywords
   */
  public async discoverNewProducts(query: string): Promise<number> {
    logger.info(`[ScraperService] Starting product discovery for query: '${query}'`);
    let totalDiscovered = 0;

    for (const [slug, provider] of this.providers.entries()) {
      try {
        const products = await provider.searchProducts(query, 1);
        totalDiscovered += products.length;

        // Upsert marketplace entity
        const marketplace = await prisma.marketplace.upsert({
          where: { slug },
          update: {},
          create: {
            name: provider.providerName,
            slug,
            logoUrl: `https://${slug}.com/logo.png`,
          },
        });

        // Ensure category and brand exist
        const category = await prisma.category.upsert({
          where: { slug: 'electronics' },
          update: {},
          create: { name: 'Electronics', slug: 'electronics' },
        });

        const brand = await prisma.brand.upsert({
          where: { slug: 'generic' },
          update: {},
          create: { name: 'Generic', slug: 'generic' },
        });

        for (const prod of products) {
          const prodSlug = prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'scraped-product';

          const dbProduct = await prisma.product.upsert({
            where: { slug: prodSlug },
            update: {},
            create: {
              name: prod.name,
              slug: prodSlug,
              description: `Automated product entry for ${prod.name}`,
              images: prod.imageUrl ? [prod.imageUrl] : [],
              dealScore: 75,
              categoryId: category.id,
              brandId: brand.id,
            },
          });

          const existingOffer = await prisma.marketplaceOffer.findFirst({
            where: {
              productId: dbProduct.id,
              marketplaceId: marketplace.id,
            },
          });

          if (!existingOffer) {
            const offer = await prisma.marketplaceOffer.create({
              data: {
                productId: dbProduct.id,
                marketplaceId: marketplace.id,
                productUrl: prod.url,
                price: prod.price,
                originalPrice: prod.originalPrice || prod.price * 1.2,
                stockStatus: prod.inStock ? StockStatus.IN_STOCK : StockStatus.OUT_OF_STOCK,
                isOfficialStore: false,
              },
            });

            await prisma.priceHistory.create({
              data: {
                marketplaceOfferId: offer.id,
                productId: dbProduct.id,
                price: prod.price,
                originalPrice: prod.originalPrice || prod.price * 1.2,
                shippingCost: 0,
                stockStatus: StockStatus.IN_STOCK,
              },
            });
          }
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        logger.error(`[ScraperService] Discovery failed for provider ${slug}: ${msg}`);
      }
    }

    return totalDiscovered;
  }

  /**
   * Check active price alerts and send notifications if target conditions met
   */
  private async triggerPriceAlertCheck(productId: string, currentPrice: number): Promise<void> {
    const alerts = await prisma.priceAlert.findMany({
      where: {
        productId,
        isEnabled: true,
      },
      include: {
        product: true,
      },
    });

    for (const alert of alerts) {
      const targetPrice = alert.targetPrice ? Number(alert.targetPrice) : null;
      const isTargetMet = targetPrice !== null && currentPrice <= targetPrice;

      if (isTargetMet) {
        logger.info(`[ScraperService] Price Alert Triggered for User ${alert.userId} on ${alert.product.name} (Current: ${currentPrice}, Target: ${targetPrice})`);

        await notificationService.createNotification({
          userId: alert.userId,
          type: NotificationType.PRICE_ALERT,
          title: '🎉 Price Drop Alert!',
          message: `The price for "${alert.product.name}" has dropped to IDR ${currentPrice.toLocaleString('id-ID')}!`,
        });

        await prisma.priceAlert.update({
          where: { id: alert.id },
          data: { lastTriggeredAt: new Date() },
        });
      }
    }
  }

  /**
   * Check health and alert if success rate drops below 80%
   */
  private checkProviderHealthAlerts(): string[] {
    const alerts: string[] = [];
    for (const provider of this.providers.values()) {
      const stats = provider.getStats();
      if (stats.totalRequests >= 5 && stats.successRate < 80) {
        const msg = `⚠️ ALERT: Scraper provider '${stats.provider}' success rate dropped below 80% (${stats.successRate}%)!`;
        logger.error(msg);
        alerts.push(msg);
      }
    }
    return alerts;
  }

  /**
   * GET /api/scraper/status monitoring payload
   */
  public async getScraperStatus(): Promise<ScraperStatusResponse> {
    const queueStats = await getQueueStats();
    const providersStats: Record<string, ProviderStats> = {};

    for (const [slug, provider] of this.providers.entries()) {
      providersStats[slug] = provider.getStats();
    }

    const alerts = this.checkProviderHealthAlerts();
    const isDegraded = alerts.length > 0;

    return {
      status: isDegraded ? 'degraded' : 'healthy',
      queueStats,
      providers: providersStats,
      alerts,
    };
  }
}

export const scraperService = new ScraperService();
