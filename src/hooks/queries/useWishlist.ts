"use client";

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { wishlistService } from '@/services/wishlist.service';
import { queryKeys } from '@/hooks/queryKeys';
import { userDataQueryOptions } from '@/hooks/queryDefaults';
import type { WishlistItem } from '@/types/domain';
import type { ApiClientError } from '@/api';

export type QueryResource<T> = UseQueryResult<T, ApiClientError>;

export function useWishlist(): QueryResource<WishlistItem[]> {
  return useQuery<WishlistItem[], ApiClientError, WishlistItem[]>({
    queryKey: queryKeys.wishlist.all(),
    queryFn: () => wishlistService.getWishlist(),
    ...userDataQueryOptions,
  });
}
