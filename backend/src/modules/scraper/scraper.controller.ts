import { Request, Response, NextFunction } from 'express';
import { scraperService } from './scraper.service';
import { addFullProductScrapeJob, addPriceCheckJob, addDiscoveryJob } from './scraper.queue';

export class ScraperController {
  /**
   * GET /api/scraper/status
   * Monitoring endpoint returning scraper system health, provider stats, and queue metrics
   */
  public getStatus = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const status = await scraperService.getScraperStatus();
      res.status(200).json({
        success: true,
        data: status,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/scraper/trigger
   * Trigger a manual scrape job for testing or administrative purposes
   */
  public triggerJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { type, productId, offerId, query } = req.body;

      if (type === 'full_product' && productId) {
        await addFullProductScrapeJob(productId);
        res.status(200).json({ success: true, message: `Full scrape queued for product ${productId}` });
        return;
      }

      if (type === 'price_only' && offerId) {
        await addPriceCheckJob(offerId);
        res.status(200).json({ success: true, message: `Price check queued for offer ${offerId}` });
        return;
      }

      if (type === 'search_discovery' && query) {
        await addDiscoveryJob(query);
        res.status(200).json({ success: true, message: `Discovery queued for query '${query}'` });
        return;
      }

      res.status(400).json({
        success: false,
        error: 'Invalid trigger parameters. Expected type ("full_product", "price_only", or "search_discovery") with required IDs/query.',
      });
    } catch (error) {
      next(error);
    }
  };
}

export const scraperController = new ScraperController();
