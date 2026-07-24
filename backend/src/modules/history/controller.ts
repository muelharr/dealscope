import { Request, Response } from 'express';
import { PriceHistoryService } from './service';
import { sendSuccess, sendError } from '../../shared/utils/response';
import { buildPaginationMeta } from '../../shared/utils/pagination';
import { HistoryResponse, HistoryWithRelations, HistoryQueryFilters } from './types';

const historyService = new PriceHistoryService();

function mapHistoryToResponse(history: HistoryWithRelations): HistoryResponse {
  return {
    id: history.id,
    marketplaceOfferId: history.marketplaceOfferId,
    productId: history.productId,
    price: typeof history.price?.toNumber === 'function' ? history.price.toNumber() : Number(history.price),
    originalPrice: typeof history.originalPrice?.toNumber === 'function' ? history.originalPrice.toNumber() : Number(history.originalPrice),
    shippingCost: typeof history.shippingCost?.toNumber === 'function' ? history.shippingCost.toNumber() : Number(history.shippingCost),
    currency: history.currency,
    stockStatus: history.stockStatus,
    marketplaceRating: history.marketplaceRating !== null
      ? (typeof history.marketplaceRating?.toNumber === 'function' ? history.marketplaceRating.toNumber() : Number(history.marketplaceRating))
      : null,
    reviewCount: history.reviewCount,
    recordedAt: history.recordedAt.toISOString(),
    marketplaceOffer: history.marketplaceOffer ? {
      id: history.marketplaceOffer.id,
      productUrl: history.marketplaceOffer.productUrl,
      marketplace: {
        id: history.marketplaceOffer.marketplace.id,
        name: history.marketplaceOffer.marketplace.name,
        slug: history.marketplaceOffer.marketplace.slug,
      },
    } : undefined,
  };
}

export class PriceHistoryController {
  /**
   * GET /offers/:offerId/history
   */
  public getOfferHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { offerId } = req.params;
      const filters = req.query as unknown as HistoryQueryFilters;
      const { items, total } = await historyService.getOfferHistory(offerId, filters);

      const meta = buildPaginationMeta(total, filters.limit, (filters.page - 1) * filters.limit);
      const data = items.map((h) => mapHistoryToResponse(h as unknown as HistoryWithRelations));

      sendSuccess(res, data, 200, meta);
    } catch (err) {
      sendError(
        res,
        500,
        'INTERNAL_SERVER_ERROR',
        err instanceof Error ? err.message : String(err)
      );
    }
  };

  /**
   * GET /products/:productId/price-history
   */
  public getProductHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { productId } = req.params;
      const items = await historyService.getProductHistory(productId);
      const data = items.map((h) => mapHistoryToResponse(h as unknown as HistoryWithRelations));

      sendSuccess(res, data);
    } catch (err) {
      sendError(
        res,
        500,
        'INTERNAL_SERVER_ERROR',
        err instanceof Error ? err.message : String(err)
      );
    }
  };

  /**
   * GET /products/:productId/lowest-price
   */
  public getLowestPrice = async (req: Request, res: Response): Promise<void> => {
    try {
      const { productId } = req.params;
      const snapshot = await historyService.getLowestPrice(productId);

      if (!snapshot) {
        sendError(res, 404, 'NOT_FOUND', 'No price history recorded for this product.');
        return;
      }

      sendSuccess(res, {
        price: typeof snapshot.price?.toNumber === 'function' ? snapshot.price.toNumber() : Number(snapshot.price),
        recordedAt: snapshot.recordedAt.toISOString(),
        marketplaceOfferId: snapshot.marketplaceOfferId,
        marketplaceName: snapshot.marketplaceOffer.marketplace.name,
      });
    } catch (err) {
      sendError(
        res,
        500,
        'INTERNAL_SERVER_ERROR',
        err instanceof Error ? err.message : String(err)
      );
    }
  };

  /**
   * GET /products/:productId/highest-price
   */
  public getHighestPrice = async (req: Request, res: Response): Promise<void> => {
    try {
      const { productId } = req.params;
      const snapshot = await historyService.getHighestPrice(productId);

      if (!snapshot) {
        sendError(res, 404, 'NOT_FOUND', 'No price history recorded for this product.');
        return;
      }

      sendSuccess(res, {
        price: typeof snapshot.price?.toNumber === 'function' ? snapshot.price.toNumber() : Number(snapshot.price),
        recordedAt: snapshot.recordedAt.toISOString(),
        marketplaceOfferId: snapshot.marketplaceOfferId,
        marketplaceName: snapshot.marketplaceOffer.marketplace.name,
      });
    } catch (err) {
      sendError(
        res,
        500,
        'INTERNAL_SERVER_ERROR',
        err instanceof Error ? err.message : String(err)
      );
    }
  };

  /**
   * GET /products/:productId/price-trend
   */
  public getPriceTrend = async (req: Request, res: Response): Promise<void> => {
    try {
      const { productId } = req.params;
      const trend = await historyService.getPriceTrend(productId);
      sendSuccess(res, trend);
    } catch (err) {
      sendError(
        res,
        500,
        'INTERNAL_SERVER_ERROR',
        err instanceof Error ? err.message : String(err)
      );
    }
  };
}
