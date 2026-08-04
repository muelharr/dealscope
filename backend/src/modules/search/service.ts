import { Prisma, MarketplaceOffer, PriceHistory, Product } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { SearchQueryFilters, SearchResultDto } from './types';
import {
  resolveBestOffer,
  resolveLowestHistoricalPrice,
  resolveTrendIndicator,
} from '../../shared/utils/pricingResolver';

interface ProductWithRelations extends Product {
  category: { id: string; name: string; slug: string };
  brand: { id: string; name: string; slug: string };
  marketplaceOffers: (MarketplaceOffer & {
    marketplace: { id: string; name: string; logoUrl: string | null };
  })[];
  priceHistories: PriceHistory[];
}

export class SearchService {
  public async search(filters: SearchQueryFilters, userId?: string) {
    const {
      q,
      category,
      brand,
      marketplace,
      minPrice,
      maxPrice,
      officialStore,
      stockStatus,
      minRating,
      sortBy,
      sortOrder = 'desc',
      page,
      limit,
    } = filters;

    if (userId && q && q.trim()) {
      try {
        await prisma.searchHistory.create({
          data: {
            userId,
            query: q.trim(),
          },
        });
      } catch (err) {
        console.error('Failed to save search history:', err);
      }
    }

    // Build database filters
    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
    };

    if (category) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(category);
      if (isUuid) {
        where.categoryId = category;
      } else {
        where.category = { slug: category };
      }
    }

    if (brand) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(brand);
      if (isUuid) {
        where.brandId = brand;
      } else {
        where.brand = { slug: brand };
      }
    }

    // Offers-specific conditions inside the DB query
    const offerConditions: Prisma.MarketplaceOfferWhereInput[] = [
      { isActive: true },
      { stockStatus: { not: 'DISCONTINUED' } },
    ];

    if (marketplace) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(marketplace);
      if (isUuid) {
        offerConditions.push({ marketplaceId: marketplace });
      } else {
        offerConditions.push({ marketplace: { slug: marketplace } });
      }
    }

    if (minPrice !== undefined) {
      offerConditions.push({ price: { gte: minPrice } });
    }

    if (maxPrice !== undefined) {
      offerConditions.push({ price: { lte: maxPrice } });
    }

    if (officialStore !== undefined) {
      offerConditions.push({ isOfficialStore: officialStore });
    }

    if (stockStatus !== undefined) {
      offerConditions.push({ stockStatus });
    }

    if (minRating !== undefined) {
      offerConditions.push({ marketplaceRating: { gte: minRating } });
    }

    // If any offer conditions are defined, ensure product has at least one matching active offer
    if (offerConditions.length > 0) {
      where.marketplaceOffers = {
        some: {
          AND: offerConditions,
        },
      };
    }

    // Fetch all products matching criteria
    const products = (await prisma.product.findMany({
      where,
      include: {
        category: true,
        brand: true,
        marketplaceOffers: {
          where: {
            AND: offerConditions,
          },
          include: {
            marketplace: true,
          },
        },
        priceHistories: {
          orderBy: { recordedAt: 'desc' },
        },
      },
    })) as unknown as ProductWithRelations[];

    // Map each product to its SearchResultDto
    const results: (SearchResultDto & { searchScore?: number })[] = [];

    for (const prod of products) {
      // 1 & 2. Resolve Best Offer & Discount
      const bestOfferObj = resolveBestOffer(prod.marketplaceOffers, prod.dealScore);

      // 3. Lowest Historical Price Fallback
      const lowestHistoricalPrice = resolveLowestHistoricalPrice(
        prod.priceHistories,
        bestOfferObj ? bestOfferObj.price : null
      );

      // 4. Trend Indicator
      const currentTrendIndicator = resolveTrendIndicator(
        bestOfferObj ? bestOfferObj.price : null,
        bestOfferObj ? bestOfferObj.id : null,
        prod.priceHistories
      );

      // 5. Search Weighted Scoring
      let score = 0;
      let isMatch = true;

      if (q) {
        const term = q.trim().toLowerCase();
        const prodName = prod.name.toLowerCase();
        const brandName = prod.brand.name.toLowerCase();
        const catName = prod.category.name.toLowerCase();
        const desc = prod.description.toLowerCase();

        // Check matches
        const hasExactName = prodName === term;
        const hasPartialName = prodName.includes(term);
        const hasExactBrand = brandName === term;
        const hasPartialBrand = brandName.includes(term);
        const hasExactCat = catName === term;
        const hasPartialCat = catName.includes(term);
        const hasPartialDesc = desc.includes(term);

        if (hasExactName) score += 1000;
        else if (hasPartialName) score += 400;

        if (hasExactBrand) score += 300;
        else if (hasPartialBrand) score += 150;

        if (hasExactCat) score += 200;
        else if (hasPartialCat) score += 100;

        if (hasPartialDesc) score += 10;

        // If no matches at all, filter out of search results
        if (score === 0) {
          isMatch = false;
        }
      }

      if (isMatch) {
        results.push({
          productSummary: {
            id: prod.id,
            name: prod.name,
            slug: prod.slug,
            description: prod.description,
            images: prod.images,
            rating: Number(prod.rating),
            reviewCount: prod.reviewCount,
            dealScore: prod.dealScore,
            createdAt: prod.createdAt.toISOString(),
            category: {
              id: prod.category.id,
              name: prod.category.name,
              slug: prod.category.slug,
            },
            brand: {
              id: prod.brand.id,
              name: prod.brand.name,
              slug: prod.brand.slug,
            },
          },
          bestOffer: bestOfferObj
            ? {
                ...bestOfferObj,
                dealScore: prod.dealScore,
              }
            : null,
          availableOfferCount: prod.marketplaceOffers.length,
          lowestHistoricalPrice,
          currentTrendIndicator,
          searchScore: score,
        });
      }
    }

    // 6. Custom Sorting
    results.sort((a, b) => {
      // If q is provided, rank by score first
      if (q && a.searchScore !== b.searchScore) {
        return (b.searchScore || 0) - (a.searchScore || 0);
      }

      if (sortBy === 'newest') {
        const timeA = new Date(a.productSummary.createdAt).getTime();
        const timeB = new Date(b.productSummary.createdAt).getTime();
        return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
      }

      if (sortBy === 'price') {
        const valA = a.bestOffer ? a.bestOffer.price : Infinity;
        const valB = b.bestOffer ? b.bestOffer.price : Infinity;
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }

      if (sortBy === 'discount') {
        const valA = a.bestOffer ? a.bestOffer.discountPercentage : -Infinity;
        const valB = b.bestOffer ? b.bestOffer.discountPercentage : -Infinity;
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }

      // Default sorting: dealScore
      const valA = a.productSummary.dealScore;
      const valB = b.productSummary.dealScore;
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    // 7. Pagination
    const total = results.length;
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    let paginatedResults: SearchResultDto[] = [];
    if (page <= totalPages) {
      paginatedResults = results
        .slice((page - 1) * limit, page * limit)
        .map((item) => {
          const rest = { ...item };
          delete rest.searchScore;
          return rest;
        });
    }

    return {
      data: paginatedResults,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrevious,
      },
    };
  }
}
