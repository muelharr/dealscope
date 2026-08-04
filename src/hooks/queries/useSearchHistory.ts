"use client";

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';
import { userDataQueryOptions } from '@/hooks/queryDefaults';
import type { ApiClientError } from '@/api';

export function useSearchHistory() {
  return useQuery<Array<{ id: string; query: string; createdAt: string }>, ApiClientError>({
    queryKey: ['dashboard', 'searchHistory'],
    queryFn: () => dashboardService.getSearchHistory(),
    ...userDataQueryOptions,
  });
}
