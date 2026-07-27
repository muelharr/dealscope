import { Worker, Job } from 'bullmq';
import { env } from '../../config/env';
import logger from '../../shared/utils/logger';
import { ScrapeJobData } from './types';
import { scraperService } from './scraper.service';

let scraperWorker: Worker<ScrapeJobData> | null = null;

export function initScraperWorker(): Worker<ScrapeJobData> | null {
  try {
    const redisUrl = new URL(env.REDIS_URL || 'redis://localhost:6379');

    scraperWorker = new Worker<ScrapeJobData>(
      'scraperQueue',
      async (job: Job<ScrapeJobData>) => {
        logger.info(`[Worker] Processing scraping job #${job.id} (Type: ${job.data.type})`);

        switch (job.data.type) {
          case 'full_product':
            if (job.data.productId) {
              await scraperService.scrapeProductAndSync(job.data.productId);
            }
            break;

          case 'price_only':
            if (job.data.offerId) {
              await scraperService.scrapePriceOnly(job.data.offerId);
            }
            break;

          case 'search_discovery':
            if (job.data.query) {
              await scraperService.discoverNewProducts(job.data.query);
            }
            break;

          default:
            logger.warn(`[Worker] Unknown job type: ${(job.data as { type: string }).type}`);
        }
      },
      {
        connection: {
          host: redisUrl.hostname,
          port: parseInt(redisUrl.port || '6379', 10),
          password: redisUrl.password || undefined,
          maxRetriesPerRequest: null,
        },
        concurrency: 2,
      }
    );

    scraperWorker.on('completed', (job) => {
      logger.info(`[Worker] Job #${job.id} completed successfully`);
    });

    scraperWorker.on('failed', (job, err) => {
      logger.error(`[Worker] Job #${job?.id} failed: ${err.message}`);
    });

    logger.info('[Worker] Scraper worker started successfully');
    return scraperWorker;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.warn(`[Worker] Failed to start BullMQ worker (Redis offline): ${msg}`);
    return null;
  }
}

export async function stopScraperWorker(): Promise<void> {
  if (scraperWorker) {
    await scraperWorker.close();
    logger.info('[Worker] Scraper worker stopped');
  }
}

export { scraperWorker };
