import { ResolvedBestOffer } from '../utils/pricingResolver';

interface AlertEvaluationResult {
  triggered: boolean;
  reason: 'PRICE_REACHED' | 'DISCOUNT_REACHED' | null;
}

/**
 * Evaluates a price alert against the current best offer.
 * @param alert - The price alert to evaluate.
 * @param bestOffer - The current best offer for the product.
 * @returns An object indicating if the alert was triggered and why.
 */
export function evaluateAlert(
  alert: {
    targetPrice: number | null;
    targetDiscountPercentage: number | null;
    isEnabled: boolean;
  },
  bestOffer: ResolvedBestOffer | null
): AlertEvaluationResult {
  if (!alert.isEnabled || !bestOffer) {
    return { triggered: false, reason: null };
  }

  // Check if target price is reached
  if (alert.targetPrice && bestOffer.price <= alert.targetPrice) {
    return { triggered: true, reason: 'PRICE_REACHED' };
  }

  // Check if target discount is reached
  if (alert.targetDiscountPercentage && bestOffer.discountPercentage >= alert.targetDiscountPercentage) {
    return { triggered: true, reason: 'DISCOUNT_REACHED' };
  }

  return { triggered: false, reason: null };
}
