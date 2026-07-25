import { Request, Response } from 'express';
import { ComparisonService } from './service';
import { sendSuccess, sendError } from '../../shared/utils/response';

const comparisonService = new ComparisonService();

export class ComparisonController {
  /**
   * GET /api/v1/compare
   * Compares side-by-side products.
   */
  public compareProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const query = req.query as { productIds?: string | string[]; ids?: string | string[] };
      const rawIds = query.productIds || (query.ids ? (Array.isArray(query.ids) ? query.ids : String(query.ids).split(',')) : []);
      const productIds = Array.isArray(rawIds) ? rawIds : [rawIds];
      const data = await comparisonService.compareProducts(productIds);
      sendSuccess(res, data, 200);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('not found') || msg.includes('deleted')) {
        sendError(res, 404, 'NOT_FOUND', msg);
        return;
      }
      sendError(res, 500, 'INTERNAL_SERVER_ERROR', msg);
    }
  };
}
