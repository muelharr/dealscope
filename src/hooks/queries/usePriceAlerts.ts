"use client";

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { priceAlertService } from '@/services/priceAlert.service';
import { userDataQueryOptions } from '@/hooks/queryDefaults';
import type { PriceAlert } from '@/types/domain';
import type { ApiClientError } from '@/api';

export type QueryResource<T> = UseQueryResult<T, ApiClientError>;

export function usePriceAlerts(): QueryResource<PriceAlert[]> {
  return useQuery<PriceAlert[], ApiClientError, PriceAlert[]>({
    queryKey: ['priceAlerts', 'list'],
    queryFn: () => priceAlertService.getAlerts(),
    ...userDataQueryOptions,
  });
}
