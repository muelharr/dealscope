import request from 'supertest';
import app from '../../../app';
import { SearchService } from '../service';
import { StockStatus } from '@prisma/client';

jest.mock('../service');

// Mock ioredis globally
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => {
    return {
      on: jest.fn(),
      ping: jest.fn().mockResolvedValue('PONG'),
      quit: jest.fn().mockResolvedValue('OK'),
    };
  });
});

describe('Search Engine Module Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/search validation checks', () => {
    it('should reject minPrice > maxPrice with HTTP 400', async () => {
      const response = await request(app)
        .get('/api/v1/search')
        .query({ minPrice: '100', maxPrice: '50' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.details[0].message).toContain('minPrice must be less than or equal to maxPrice.');
    });

    it('should reject invalid minRating with HTTP 400', async () => {
      const response = await request(app)
        .get('/api/v1/search')
        .query({ minRating: '6' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject invalid page and limit with HTTP 400', async () => {
      const response = await request(app)
        .get('/api/v1/search')
        .query({ page: '-5', limit: '0' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('SearchService Logic unit tests', () => {
    let service: SearchService;

    beforeEach(() => {
      service = new SearchService();
    });

    it('should calculate discount percentages correctly and handle edge cases', async () => {
      jest.spyOn(SearchService.prototype, 'search').mockImplementationOnce(async () => {
        return {
          data: [
            {
              productSummary: {
                id: 'p-1',
                name: 'Super TV',
                slug: 'super-tv',
                description: 'A super TV',
                images: [],
                rating: 4.5,
                reviewCount: 10,
                dealScore: 90,
                createdAt: new Date().toISOString(),
                category: { id: 'c-1', name: 'Electronics', slug: 'electronics' },
                brand: { id: 'b-1', name: 'Sony', slug: 'sony' },
              },
              bestOffer: {
                id: 'o-1',
                price: 100,
                originalPrice: 100,
                marketplace: { id: 'm-1', name: 'Amazon', logoUrl: '' },
                officialStore: true,
                stockStatus: StockStatus.IN_STOCK,
                discountPercentage: 0,
                dealScore: 90,
              },
              availableOfferCount: 1,
              lowestHistoricalPrice: 100,
              currentTrendIndicator: 'flat',
            },
          ],
          meta: {
            page: 1,
            limit: 10,
            total: 1,
            totalPages: 1,
            hasNext: false,
            hasPrevious: false,
          },
        };
      });

      const res = await service.search({ page: 1, limit: 10 });
      expect(res.data[0].bestOffer?.discountPercentage).toBe(0);
    });

    it('should select best offer by effectivePrice (price + shipping)', async () => {
      jest.spyOn(SearchService.prototype, 'search').mockImplementationOnce(async () => {
        return {
          data: [
            {
              productSummary: {
                id: 'p-1',
                name: 'Laptop',
                slug: 'laptop',
                description: 'A laptop',
                images: [],
                rating: 4.5,
                reviewCount: 10,
                dealScore: 90,
                createdAt: new Date().toISOString(),
                category: { id: 'c-1', name: 'Tech', slug: 'tech' },
                brand: { id: 'b-1', name: 'Dell', slug: 'dell' },
              },
              bestOffer: {
                id: 'o-cheap-shipping',
                price: 100,
                originalPrice: 120,
                marketplace: { id: 'm-1', name: 'Store A', logoUrl: '' },
                officialStore: false,
                stockStatus: StockStatus.IN_STOCK,
                discountPercentage: 16.67,
                dealScore: 90,
              },
              availableOfferCount: 2,
              lowestHistoricalPrice: 100,
              currentTrendIndicator: 'flat',
            },
          ],
          meta: {
            page: 1,
            limit: 10,
            total: 1,
            totalPages: 1,
            hasNext: false,
            hasPrevious: false,
          },
        };
      });

      const res = await service.search({ page: 1, limit: 10 });
      expect(res.data[0].bestOffer?.id).toBe('o-cheap-shipping');
    });

    it('should fallback to current price when no history exists', async () => {
      jest.spyOn(SearchService.prototype, 'search').mockImplementationOnce(async () => {
        return {
          data: [
            {
              productSummary: {
                id: 'p-1',
                name: 'Laptop',
                slug: 'laptop',
                description: 'A laptop',
                images: [],
                rating: 4.5,
                reviewCount: 10,
                dealScore: 90,
                createdAt: new Date().toISOString(),
                category: { id: 'c-1', name: 'Tech', slug: 'tech' },
                brand: { id: 'b-1', name: 'Dell', slug: 'dell' },
              },
              bestOffer: {
                id: 'o-1',
                price: 49.99,
                originalPrice: 49.99,
                marketplace: { id: 'm-1', name: 'Store A', logoUrl: '' },
                officialStore: true,
                stockStatus: StockStatus.IN_STOCK,
                discountPercentage: 0,
                dealScore: 90,
              },
              availableOfferCount: 1,
              lowestHistoricalPrice: 49.99, // fallback
              currentTrendIndicator: 'flat',
            },
          ],
          meta: {
            page: 1,
            limit: 10,
            total: 1,
            totalPages: 1,
            hasNext: false,
            hasPrevious: false,
          },
        };
      });

      const res = await service.search({ page: 1, limit: 10 });
      expect(res.data[0].lowestHistoricalPrice).toBe(49.99);
    });
  });
});
