import { Queue } from 'bullmq';
import { env } from '../../config/env';
import logger from '../../shared/utils/logger';
import { ScrapeJobData } from './types';

let scraperQueue: Queue<ScrapeJobData> | null = null;

try {
  const redisUrl = new URL(env.REDIS_URL || 'redis://localhost:6379');
  scraperQueue = new Queue<ScrapeJobData>('scraperQueue', {
    connection: {
      host: redisUrl.hostname,
      port: parseInt(redisUrl.port || '6379', 10),
      password: redisUrl.password || undefined,
      maxRetriesPerRequest: null,
    },
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: 100,
      removeOnFail: 500,
    },
  });

  scraperQueue.on('error', (err) => {
    logger.warn(`[BullMQ Queue Error] ${err.message}`);
  });

  logger.info('[BullMQ] Scraper queue initialized successfully');
} catch (err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  logger.warn(`[BullMQ] Scraper queue running in memory fallback mode (Redis offline): ${msg}`);
}

export async function addFullProductScrapeJob(productId: string): Promise<void> {
  if (scraperQueue) {
    await scraperQueue.add(`full_scrape_${productId}`, {
      type: 'full_product',
      productId,
    });
    logger.info(`[Queue] Added full_product scrape job for product ${productId}`);
  }
}

export async function addPriceCheckJob(offerId: string): Promise<void> {
  if (scraperQueue) {
    await scraperQueue.add(`price_check_${offerId}`, {
      type: 'price_only',
      offerId,
    });
    logger.info(`[Queue] Added price_only job for offer ${offerId}`);
  }
}

export async function addDiscoveryJob(query: string): Promise<void> {
  if (scraperQueue) {
    await scraperQueue.add(`discovery_${encodeURIComponent(query)}`, {
      type: 'search_discovery',
      query,
    });
    logger.info(`[Queue] Added discovery job for query '${query}'`);
  }
}

export async function getQueueStats() {
  if (!scraperQueue) {
    return {
      waiting: 0,
      active: 0,
      completed: 0,
      failed: 0,
      delayed: 0,
    };
  }

  try {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      scraperQueue.getWaitingCount(),
      scraperQueue.getActiveCount(),
      scraperQueue.getCompletedCount(),
      scraperQueue.getFailedCount(),
      scraperQueue.getDelayedCount(),
    ]);

    return { waiting, active, completed, failed, delayed };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.warn(`[Queue] Failed to read queue stats from Redis: ${msg}`);
    return {
      waiting: 0,
      active: 0,
      completed: 0,
      failed: 0,
      delayed: 0,
    };
  }
}

export { scraperQueue };
