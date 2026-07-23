"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistService } from '@/services/wishlist.service';
import { queryKeys } from '@/hooks/queryKeys';
import { toast } from 'sonner';
import type { WishlistItem, Product } from '@/types/domain';

export function useToggleWishlist() {
  const queryClient = useQueryClient();

  return useMutation<
    WishlistItem | void, // Mutation response (void if removing, WishlistItem if adding)
    Error,              // Error type
    { product: Product }, // Variables passed to mutate()
    { previousWishlist: WishlistItem[] | undefined } // Context for rollback
  >({
    mutationFn: async ({ product }) => {
      const wishlist = queryClient.getQueryData<WishlistItem[]>(queryKeys.wishlist.all()) ?? [];
      const isAlreadyWishlisted = wishlist.some((item) => item.product.id === product.id);

      if (isAlreadyWishlisted) {
        // Find the wishlisted item ID to delete if needed, but the endpoint takes productId
        // WISHLIST.REMOVE takes the productId
        await wishlistService.removeFromWishlist(product.id);
        return;
      } else {
        return await wishlistService.addToWishlist(product.id);
      }
    },
    onMutate: async ({ product }) => {
      // 1. Cancel outgoing fetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: queryKeys.wishlist.all() });

      // 2. Snapshot the current cache state
      const previousWishlist = queryClient.getQueryData<WishlistItem[]>(queryKeys.wishlist.all());

      // 3. Determine if we are adding or removing
      const isAlreadyWishlisted = (previousWishlist ?? []).some(
        (item) => item.product.id === product.id
      );

      // 4. Optimistically update the cache
      queryClient.setQueryData<WishlistItem[]>(queryKeys.wishlist.all(), (old = []) => {
        if (isAlreadyWishlisted) {
          // Remove the product
          return old.filter((item) => item.product.id !== product.id);
        } else {
          // Add the product
          const newItem: WishlistItem = {
            id: `temp-${product.id}-${Date.now()}`,
            product,
            addedAt: new Date().toISOString(),
          };
          return [...old, newItem];
        }
      });

      // 5. Show toast notification instantly
      if (isAlreadyWishlisted) {
        toast.success(`Removed "${product.name}" from wishlist.`);
      } else {
        toast.success(`Added "${product.name}" to wishlist.`);
      }

      // Return context containing previous state for rollbacks
      return { previousWishlist };
    },
    onError: (err, { product }, context) => {
      // Rollback to the previous state on error
      if (context?.previousWishlist) {
        queryClient.setQueryData(queryKeys.wishlist.all(), context.previousWishlist);
      }
      toast.error(`Failed to update wishlist for "${product.name}". Please try again.`);
      console.error("Wishlist mutation error:", err);
    },
    onSettled: () => {
      // Invalidate cache to sync with backend
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all() });
    },
  });
}
