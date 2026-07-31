/**
 * Comparison Service
 *
 * Fetches side-by-side comparison data for multiple products and adapts DTOs to UI domain structures.
 */

import { authApiClient } from '@/auth';
import { COMPARE } from '@/api/endpoints';
import type { ComparisonData, ComparedProduct, ComparisonProductHeader, ComparisonCategory, MarketplaceComparison } from '@/types/domain';

interface RawComparisonProduct {
  id?: string;
  productSummary?: {
    id?: string;
    brand?: string;
    name?: string;
    dealScore?: number;
    rating?: number;
    reviewCount?: number;
  };
  bestOffer?: {
    price?: number;
    discountPercentage?: number;
    marketplace?: string;
    stockStatus?: string;
    officialStore?: boolean;
  };
}

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

    const { data: res } = await authApiClient.get<unknown>(COMPARE.ROOT, {
      params: { ids: ids.join(',') },
    });

    const obj = res as Record<string, unknown>;
    const rawData = (obj.data || obj) as Record<string, unknown>;
    const productsList = (rawData.products || []) as RawComparisonProduct[];

    const comparedProducts: ComparedProduct[] = productsList.map((p) => {
      const summary = p.productSummary ?? {};
      const offer = p.bestOffer;
      return {
        id: summary.id ?? p.id ?? '',
        brand: summary.brand ?? '',
        name: summary.name ?? '',
        price: offer?.price ?? 0,
        dealScore: summary.dealScore ?? 0,
        marketplace: offer?.marketplace ?? '',
        status: offer?.stockStatus === 'IN_STOCK' ? 'available' : 'limited',
      };
    });

    const matrixProductHeaders: ComparisonProductHeader[] = productsList.map((p, idx) => ({
      id: p.productSummary?.id ?? p.id ?? '',
      name: p.productSummary?.name ?? '',
      isTopPick: idx === 0,
      badgeLabel: idx === 0 ? 'Best Deal' : undefined,
    }));

    const matrixCategories: ComparisonCategory[] = [
      {
        id: 'cat-price',
        title: 'Pricing & Value',
        rows: [
          {
            id: 'row-price',
            label: 'Current Price',
            values: productsList.map((p) => ({
              productId: p.productSummary?.id ?? p.id ?? '',
              value: `$${p.bestOffer?.price ?? 0}`,
              highlight: 'equal',
            })),
          },
          {
            id: 'row-discount',
            label: 'Discount',
            values: productsList.map((p) => ({
              productId: p.productSummary?.id ?? p.id ?? '',
              value: `${p.bestOffer?.discountPercentage ?? 0}% OFF`,
            })),
          },
        ],
      },
      {
        id: 'cat-specs',
        title: 'Specifications & Rating',
        rows: [
          {
            id: 'row-rating',
            label: 'Rating',
            values: productsList.map((p) => ({
              productId: p.productSummary?.id ?? p.id ?? '',
              value: `★ ${p.productSummary?.rating ?? '-'} (${p.productSummary?.reviewCount ?? 0})`,
            })),
          },
          {
            id: 'row-score',
            label: 'Deal Score',
            values: productsList.map((p) => ({
              productId: p.productSummary?.id ?? p.id ?? '',
              value: `${p.productSummary?.dealScore ?? '-'}/100`,
            })),
          },
        ],
      },
    ];

    const marketplaceComparisons: MarketplaceComparison[] = productsList
      .filter((p) => p.bestOffer)
      .map((p) => ({
        id: `mp-${p.productSummary?.id ?? p.id ?? ''}`,
        marketplace: p.bestOffer?.marketplace ?? '',
        seller: p.bestOffer?.officialStore ? 'Official Store' : '',
        iconName: 'store',
        offers: [
          {
            productId: p.productSummary?.id ?? p.id ?? '',
            variantName: p.productSummary?.name ?? '',
            price: p.bestOffer?.price ?? 0,
            availability: p.bestOffer?.stockStatus === 'IN_STOCK' ? 'In Stock' : 'Limited',
            availabilityType: 'positive',
            actionLabel: 'View Deal',
          },
        ],
      }));

    // NOTE: Per-product price history and AI recommendations are not provided by
    // the backend comparison endpoint (see ComparisonResponseDto). They are left
    // undefined rather than synthesized so the UI can show an honest empty state.
    const topProduct = productsList[0]?.productSummary?.name ?? '';

    return {
      summary: {
        productsCount: productsList.length,
        bestOverallName: topProduct,
        avgDealScore: computeAverageDealScore(productsList),
        lastUpdated: new Date().toLocaleDateString(),
      },
      comparedProducts,
      matrixProductHeaders,
      matrixCategories,
      marketplaceComparisons,
    };
  }
}

/**
 * Computes the mean deal score across compared products, returning `undefined`
 * when none of the products report a deal score (so the UI can omit the metric
 * instead of showing a fabricated value).
 */
function computeAverageDealScore(
  products: RawComparisonProduct[],
): number | undefined {
  const scores = products
    .map((p) => p.productSummary?.dealScore)
    .filter((s): s is number => typeof s === 'number' && s > 0);
  if (scores.length === 0) return undefined;
  return Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
}

export const compareService = new CompareService();
