import { Request, Response } from 'express';
import { OfferService } from './service';
import { sendSuccess, sendError } from '../../shared/utils/response';
import { buildPaginationMeta } from '../../shared/utils/pagination';
import { OfferResponse, OfferWithRelations, OfferQueryFilters } from './types';

const offerService = new OfferService();

/**
 * Maps a database MarketplaceOffer record to the canonical OfferResponse DTO format.
 */
function mapOfferToResponse(offer: OfferWithRelations): OfferResponse {
  return {
    id: offer.id,
    productId: offer.productId,
    marketplaceId: offer.marketplaceId,
    sellerId: offer.sellerId,
    productUrl: offer.productUrl,
    price: typeof offer.price?.toNumber === 'function' ? offer.price.toNumber() : Number(offer.price),
    originalPrice: typeof offer.originalPrice?.toNumber === 'function' ? offer.originalPrice.toNumber() : Number(offer.originalPrice),
    currency: offer.currency,
    stockStatus: offer.stockStatus,
    shippingCost: typeof offer.shippingCost?.toNumber === 'function' ? offer.shippingCost.toNumber() : Number(offer.shippingCost),
    shippingEstimate: offer.shippingEstimate,
    marketplaceRating: offer.marketplaceRating !== null
      ? (typeof offer.marketplaceRating?.toNumber === 'function' ? offer.marketplaceRating.toNumber() : Number(offer.marketplaceRating))
      : null,
    reviewCount: offer.reviewCount,
    isOfficialStore: offer.isOfficialStore,
    isActive: offer.isActive,
    lastScrapedAt: offer.lastScrapedAt.toISOString(),
    marketplace: offer.marketplace ? {
      id: offer.marketplace.id,
      name: offer.marketplace.name,
      slug: offer.marketplace.slug,
    } : undefined,
    product: offer.product ? {
      id: offer.product.id,
      name: offer.product.name,
      slug: offer.product.slug,
    } : undefined,
    createdAt: offer.createdAt.toISOString(),
    updatedAt: offer.updatedAt.toISOString(),
  };
}

export class OfferController {
  /**
   * GET /offers
   * Retrieves paginated list of active offers.
   */
  public listOffers = async (req: Request, res: Response): Promise<void> => {
    try {
      const filters = req.query as unknown as OfferQueryFilters;
      const { items, total } = await offerService.getOffers(filters);

      const meta = buildPaginationMeta(total, filters.limit, (filters.page - 1) * filters.limit);
      const data = items.map((o) => mapOfferToResponse(o as unknown as OfferWithRelations));

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
   * GET /offers/:id
   * Retrieves single active offer.
   */
  public getOffer = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const offer = await offerService.getOfferById(id);

      if (!offer) {
        sendError(res, 404, 'NOT_FOUND', 'Marketplace offer not found or is inactive.');
        return;
      }

      sendSuccess(res, mapOfferToResponse(offer as unknown as OfferWithRelations));
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
   * GET /products/:productId/offers
   * Retrieves active offers for a specific product.
   */
  public getProductOffers = async (req: Request, res: Response): Promise<void> => {
    try {
      const { productId } = req.params;
      const queryFilters = req.query as unknown as OfferQueryFilters;
      const filters: OfferQueryFilters = { ...queryFilters, productId };

      const { items, total } = await offerService.getOffers(filters);

      const meta = buildPaginationMeta(total, filters.limit, (filters.page - 1) * filters.limit);
      const data = items.map((o) => mapOfferToResponse(o as unknown as OfferWithRelations));

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
   * POST /offers
   * Admin only. Creates an offer or reactivates an inactive one.
   */
  public createOffer = async (req: Request, res: Response): Promise<void> => {
    try {
      const offer = await offerService.createOffer(req.body);
      sendSuccess(res, mapOfferToResponse(offer as unknown as OfferWithRelations), 201);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('already exists')) {
        sendError(res, 400, 'BAD_REQUEST', msg);
        return;
      }
      sendError(res, 500, 'INTERNAL_SERVER_ERROR', msg);
    }
  };

  /**
   * PUT /offers/:id
   * Admin only. Updates active offer details.
   */
  public updateOffer = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const offer = await offerService.updateOffer(id, req.body);
      sendSuccess(res, mapOfferToResponse(offer as unknown as OfferWithRelations), 200);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('not found') || msg.includes('inactive')) {
        sendError(res, 404, 'NOT_FOUND', msg);
        return;
      }
      if (msg.includes('already exists')) {
        sendError(res, 400, 'BAD_REQUEST', msg);
        return;
      }
      sendError(res, 500, 'INTERNAL_SERVER_ERROR', msg);
    }
  };

  /**
   * DELETE /offers/:id
   * Admin only. Deactivates offer (sets isActive = false).
   */
  public deleteOffer = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await offerService.deleteOffer(id);
      sendSuccess(res, { message: 'Marketplace offer successfully deactivated.' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('not found') || msg.includes('inactive')) {
        sendError(res, 404, 'NOT_FOUND', msg);
        return;
      }
      sendError(res, 500, 'INTERNAL_SERVER_ERROR', msg);
    }
  };
}
