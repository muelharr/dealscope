import cron, { ScheduledTask } from 'node-cron';
import prisma from '../../config/prisma';
import logger from '../../shared/utils/logger';
import { addFullProductScrapeJob, addPriceCheckJob, addDiscoveryJob } from './scraper.queue';

const scheduledTasks: ScheduledTask[] = [];

/**
 * Initialize all automated cron schedules for DealScope data ingestion
 */
export function initScraperScheduler(): void {
  logger.info('[Scheduler] Initializing automated scraping cron schedules...');

  // 1. Full scrape all active products: every 6 hours ("0 */6 * * *")
  const fullScrapeTask = cron.schedule('0 */6 * * *', async () => {
    logger.info('[Scheduler] Triggering periodic full product scrape (6-hour interval)');
    try {
      const activeProducts = await prisma.product.findMany({
        where: { deletedAt: null },
        select: { id: true },
      });

      for (const product of activeProducts) {
        await addFullProductScrapeJob(product.id);
      }
      logger.info(`[Scheduler] Queued full scrape jobs for ${activeProducts.length} active products`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      logger.error(`[Scheduler] Error queueing full product scrape: ${msg}`);
    }
  });

  // 2. Price-only check for products with active PriceAlerts: every 1 hour ("0 * * * *")
  const priceAlertCheckTask = cron.schedule('0 * * * *', async () => {
    logger.info('[Scheduler] Triggering hourly price check for active price alerts');
    try {
      const activeAlerts = await prisma.priceAlert.findMany({
        where: { isEnabled: true },
        select: { productId: true },
      });

      const productIds = Array.from(new Set(activeAlerts.map((a) => a.productId)));

      const offers = await prisma.marketplaceOffer.findMany({
        where: {
          productId: { in: productIds },
          isActive: true,
        },
        select: { id: true },
      });

      for (const offer of offers) {
        await addPriceCheckJob(offer.id);
      }
      logger.info(`[Scheduler] Queued price-check jobs for ${offers.length} active alert offers`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      logger.error(`[Scheduler] Error queueing price alert checks: ${msg}`);
    }
  });

  // 3. New product discovery (popular keywords): every 24 hours ("0 0 * * *")
  const discoveryTask = cron.schedule('0 0 * * *', async () => {
    logger.info('[Scheduler] Triggering 24-hour popular product discovery');
    const popularKeywords = ['laptop', 'iphone', 'macbook', 'tws', 'smartwatch', 'playstation', 'monitor'];

    for (const keyword of popularKeywords) {
      await addDiscoveryJob(keyword);
    }
    logger.info(`[Scheduler] Queued discovery jobs for ${popularKeywords.length} keywords`);
  });

  scheduledTasks.push(fullScrapeTask, priceAlertCheckTask, discoveryTask);
  logger.info('[Scheduler] Cron scheduler started (6-hour full scrape, 1-hour price check, 24-hour discovery)');
}

export function stopScraperScheduler(): void {
  scheduledTasks.forEach((task) => task.stop());
  scheduledTasks.length = 0;
  logger.info('[Scheduler] Cron scheduler stopped');
}
