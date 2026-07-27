import { Router } from 'express';
import { scraperController } from './scraper.controller';

const scraperRouter = Router();

/**
 * @openapi
 * /api/scraper/status:
 *   get:
 *     summary: Scraper system status and metrics
 *     tags:
 *       - Scraper
 *     responses:
 *       200:
 *         description: Current status, queue stats, and provider health metrics
 */
scraperRouter.get('/status', scraperController.getStatus);
scraperRouter.post('/trigger', scraperController.triggerJob);

export default scraperRouter;
export { scraperRouter };
