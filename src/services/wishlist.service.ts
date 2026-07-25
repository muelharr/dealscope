/**
 * Wishlist Service
 *
 * Handles API calls to fetch, add, and remove items from the user's wishlist.
 */

import { authApiClient } from '@/auth';
import { WISHLIST } from '@/api/endpoints';
import type { WishlistItem } from '@/types/domain';

class WishlistService {
  private extractData<T>(res: unknown): T {
    if (!res || typeof res !== 'object') {
      return res as T;
    }
    const obj = res as Record<string, unknown>;
    if ('data' in obj && obj.data !== undefined) {
      return obj.data as T;
    }
    return res as T;
  }

  /**
   * Fetches the user's wishlist.
   */
  public async getWishlist(): Promise<WishlistItem[]> {
    try {
      const res = await authApiClient.get<unknown>(WISHLIST.LIST);
      const data = this.extractData<WishlistItem[]>(res.data);
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  /**
   * Adds a product to the user's wishlist.
   *
   * @param productId - The ID of the product to add.
   */
  public async addToWishlist(productId: string): Promise<WishlistItem> {
    const res = await authApiClient.post<unknown>(WISHLIST.ADD, { productId });
    return this.extractData<WishlistItem>(res.data);
  }

  /**
   * Removes a product from the user's wishlist.
   *
   * @param productId - The ID of the product to remove.
   */
  public async removeFromWishlist(productId: string): Promise<void> {
    try {
      await authApiClient.delete<unknown>(WISHLIST.REMOVE(productId));
    } catch {
      // Ignore delete errors
    }
  }
}

export const wishlistService = new WishlistService();
