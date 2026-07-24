import { Request, Response } from 'express';
import { WishlistService } from './service';
import { sendSuccess, sendError } from '../../shared/utils/response';
import { AddWishlistRequest } from './types';

const wishlistService = new WishlistService();

export class WishlistController {
  public getWishlist = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const items = await wishlistService.getUserWishlist(userId);
      sendSuccess(res, items, 200);
    } catch (err) {
      sendError(res, 500, 'INTERNAL_SERVER_ERROR', err instanceof Error ? err.message : String(err));
    }
  };

  public addToWishlist = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const data = req.body as AddWishlistRequest;
      const result = await wishlistService.addToWishlist(userId, data);
      sendSuccess(res, result, 201);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const status = message.includes('Product not found') ? 404 : 400;
      sendError(res, status, 'BAD_REQUEST', message);
    }
  };

  public removeFromWishlist = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const productId = req.params.productId;
      await wishlistService.removeFromWishlist(userId, productId);
      sendSuccess(res, { message: 'Item removed from wishlist successfully.' }, 200);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const status = message.includes('not found') ? 404 : 400;
      sendError(res, status, 'NOT_FOUND', message);
    }
  };
}
