import { Request, Response } from 'express';
import { ComparisonService } from './service';
import { sendSuccess, sendError } from '../../shared/utils/response';

const comparisonService = new ComparisonService();

export class ComparisonController {
  /**
   * GET /api/v1/comparison
   * Compares 2 to 4 products side-by-side.
   */
  public compareProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const productIds = req.query.productIds as unknown as string[];
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
