import request from 'supertest';
import app from '../../../app';
import { PriceHistoryService } from '../service';

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

describe('Price History Routes Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/offers/:offerId/history', () => {
    const offerId = '8114f2e5-1921-4f2e-5192-13bc58d4a6f8';

    it('should retrieve offer history with valid parameters', async () => {
      (PriceHistoryService.prototype.getOfferHistory as jest.Mock).mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      const response = await request(app)
        .get(`/api/v1/offers/${offerId}/history`)
        .query({
          page: 1,
          limit: 10,
          from: '2026-07-01T00:00:00.000Z',
          to: '2026-07-24T00:00:00.000Z',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should reject invalid UUID offerId with HTTP 400', async () => {
      const response = await request(app).get('/api/v1/offers/invalid-uuid/history');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.details[0].message).toContain('Invalid Offer ID format');
    });

    it('should reject invalid date range where from > to with HTTP 400', async () => {
      const response = await request(app)
        .get(`/api/v1/offers/${offerId}/history`)
        .query({
          from: '2026-07-24T00:00:00.000Z',
          to: '2026-07-01T00:00:00.000Z',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.details[0].message).toContain('"from" date must be less than or equal to "to" date.');
    });
  });

  describe('GET /api/v1/products/:productId/lowest-price', () => {
    it('should allow public access to product lowest price endpoint', async () => {
      (PriceHistoryService.prototype.getLowestPrice as jest.Mock).mockResolvedValueOnce({
        price: { toNumber: () => 19.99 },
        recordedAt: new Date(),
        marketplaceOfferId: 'o-1',
        marketplaceOffer: {
          marketplace: {
            name: 'eBay',
          },
        },
      });

      const response = await request(app).get('/api/v1/products/8114f2e5-1921-4f2e-5192-13bc58d4a6f8/lowest-price');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.price).toBe(19.99);
    });
  });
});
