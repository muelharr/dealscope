"use client";

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { compareService } from '@/services/compare.service';
import { queryKeys } from '@/hooks/queryKeys';
import { volatileDataQueryOptions } from '@/hooks/queryDefaults';
import type { ComparisonData } from '@/types/domain';
import type { ApiClientError } from '@/api';

export type QueryResource<T> = UseQueryResult<T, ApiClientError>;

export function useComparison(ids: string[]): QueryResource<ComparisonData> {
  return useQuery<ComparisonData, ApiClientError, ComparisonData>({
    queryKey: queryKeys.compare.session(ids),
    queryFn: () => compareService.getComparison(ids),
    enabled: ids.length > 0,
    ...volatileDataQueryOptions, // Comparison has live inventory & prices
  });
}
