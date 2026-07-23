/**
 * Comparison Service
 *
 * Fetches side-by-side comparison data for multiple products.
 */

import { authApiClient } from '@/auth';
import { COMPARE } from '@/api/endpoints';
import type { ApiResponse } from '@/types/api';
import type { ComparisonData } from '@/types/domain';
import type { QueryParams } from '@/api/request';

class CompareService {
  /**
   * Fetches side-by-side comparison matrix, price series, and AI analysis for compared products.
   *
   * @param ids - Array of product IDs to compare.
   */
  public async getComparison(ids: string[]): Promise<ComparisonData> {
    if (ids.length === 0) {
      throw new Error("No product IDs provided for comparison.");
    }

    // Pass the comma-separated IDs list as a query parameter
    const { data: response } = await authApiClient.get<ApiResponse<ComparisonData>>(
      COMPARE.ROOT,
      {
        params: { ids: ids.join(',') } as unknown as QueryParams,
      }
    );
    return response.data;
  }
}

export const compareService = new CompareService();
