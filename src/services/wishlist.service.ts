/**
 * Wishlist Service
 *
 * Handles API calls to fetch, add, and remove items from the user's wishlist.
 */

import { authApiClient } from '@/auth';
import { WISHLIST } from '@/api/endpoints';
import type { ApiResponse } from '@/types/api';
import type { WishlistItem } from '@/types/domain';

class WishlistService {
  /**
   * Fetches the user's wishlist.
   */
  public async getWishlist(): Promise<WishlistItem[]> {
    const { data: response } = await authApiClient.get<ApiResponse<WishlistItem[]>>(
      WISHLIST.LIST
    );
    return response.data;
  }

  /**
   * Adds a product to the user's wishlist.
   *
   * @param productId - The ID of the product to add.
   */
  public async addToWishlist(productId: string): Promise<WishlistItem> {
    const { data: response } = await authApiClient.post<ApiResponse<WishlistItem>, { productId: string }>(
      WISHLIST.ADD,
      { productId }
    );
    return response.data;
  }

  /**
   * Removes a product from the user's wishlist.
   *
   * @param productId - The ID of the product to remove.
   */
  public async removeFromWishlist(productId: string): Promise<void> {
    await authApiClient.delete<ApiResponse<void>>(
      WISHLIST.REMOVE(productId)
    );
  }
}

export const wishlistService = new WishlistService();
