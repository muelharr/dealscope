import app from './app';
import { env } from './config/env';
import logger from './shared/utils/logger';
import prisma from './config/prisma';
import redis from './config/redis';

import { initScraperWorker, stopScraperWorker } from './modules/scraper/scraper.worker';
import { initScraperScheduler, stopScraperScheduler } from './modules/scraper/scraper.scheduler';

const server = app.listen(env.PORT, () => {
  logger.info(
    `Server is running on port ${env.PORT} in ${env.NODE_ENV} mode`
  );

  // Initialize scraper BullMQ worker and cron scheduler
  initScraperWorker();
  initScraperScheduler();
});

// Graceful shutdown handling
const gracefulShutdown = async (signal: string) => {
  logger.warn(`${signal} received. Starting graceful shutdown sequence...`);

  server.close(async () => {
    logger.info('HTTP server closed.');
    
    try {
      stopScraperScheduler();
      await stopScraperWorker();

      await prisma.$disconnect();
      logger.info('Database client disconnected.');
      
      await redis.quit();
      logger.info('Redis connection closed.');
      
      process.exit(0);
    } catch (err) {
      logger.error('Error encountered during shutdown:', err);
      process.exit(1);
    }
  });

  // Force close after 10s timeout
  setTimeout(() => {
    logger.error('Forced shutdown due to connection timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
