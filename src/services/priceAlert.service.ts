/**
 * Price Alert Service
 *
 * Handles API calls to fetch, create, toggle, and delete price alerts.
 */

import { authApiClient } from '@/auth';
import { PRICE_ALERTS } from '@/api/endpoints';
import type { PriceAlert } from '@/types/domain';

class PriceAlertService {
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
   * Fetches the user's price alerts.
   */
  public async getAlerts(): Promise<PriceAlert[]> {
    try {
      const res = await authApiClient.get<unknown>(PRICE_ALERTS.LIST);
      const data = this.extractData<PriceAlert[]>(res.data);
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  /**
   * Creates a new price alert.
   */
  public async createAlert(
    productId: string,
    targetPrice?: number | null,
    targetDiscountPercentage?: number | null
  ): Promise<PriceAlert> {
    const res = await authApiClient.post<unknown>(PRICE_ALERTS.CREATE, {
      productId,
      targetPrice,
      targetDiscountPercentage,
    });
    return this.extractData<PriceAlert>(res.data);
  }

  /**
   * Updates/toggles the enabled status of an alert.
   */
  public async toggleAlert(id: string, isEnabled: boolean): Promise<PriceAlert> {
    const res = await authApiClient.patch<unknown>(PRICE_ALERTS.TOGGLE(id), {
      isEnabled,
    });
    return this.extractData<PriceAlert>(res.data);
  }

  /**
   * Deletes a price alert.
   */
  public async deleteAlert(id: string): Promise<void> {
    await authApiClient.delete<unknown>(PRICE_ALERTS.DELETE(id));
  }
}

export const priceAlertService = new PriceAlertService();
