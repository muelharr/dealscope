import request from 'supertest';
import app from '../../../app';
import { OfferService } from '../service';
import { AuthService } from '../../auth/service';
import { StockStatus } from '@prisma/client';

jest.mock('../service');
jest.mock('../../auth/service');

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

describe('Offer Routes Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/offers', () => {
    it('should allow anonymous access and filter by parameters', async () => {
      (OfferService.prototype.getOffers as jest.Mock).mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      const response = await request(app)
        .get('/api/v1/offers')
        .query({
          marketplace: 'tokopedia',
          officialStore: 'true',
          stockStatus: 'IN_STOCK',
          sortBy: 'price',
          sortOrder: 'asc',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(OfferService.prototype.getOffers).toHaveBeenCalledWith(
        expect.objectContaining({
          marketplace: 'tokopedia',
          officialStore: true,
          stockStatus: StockStatus.IN_STOCK,
          sortBy: 'price',
          sortOrder: 'asc',
        })
      );
    });

    it('should reject invalid currency parameters with 400', async () => {
      // Create request payload with invalid currency
      (AuthService.prototype.verifyAccessToken as jest.Mock).mockReturnValueOnce({
        sub: 'u-admin',
        email: 'admin@d.com',
        role: 'admin',
        sessionId: 's-admin',
      });

      const response = await request(app)
        .post('/api/v1/offers')
        .set('Authorization', 'Bearer admin-token')
        .send({
          productId: '8114f2e5-1921-4f2e-5192-13bc58d4a6f8',
          marketplaceId: 'b0397ee4-8281-41f2-e519-213bc58d4a6f',
          productUrl: 'https://dealscope.com/phone',
          price: 150,
          originalPrice: 200,
          currency: 'INVALID_CURR',
          stockStatus: 'IN_STOCK',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.details[0].message).toContain('Invalid Currency code');
    });

    it('should reject invalid stockStatus parameters with 400', async () => {
      (AuthService.prototype.verifyAccessToken as jest.Mock).mockReturnValueOnce({
        sub: 'u-admin',
        email: 'admin@d.com',
        role: 'admin',
        sessionId: 's-admin',
      });

      const response = await request(app)
        .post('/api/v1/offers')
        .set('Authorization', 'Bearer admin-token')
        .send({
          productId: '8114f2e5-1921-4f2e-5192-13bc58d4a6f8',
          marketplaceId: 'b0397ee4-8281-41f2-e519-213bc58d4a6f',
          productUrl: 'https://dealscope.com/phone',
          price: 150,
          originalPrice: 200,
          currency: 'USD',
          stockStatus: 'HYPE_STOCK',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.details[0].message).toContain('Invalid Stock Status');
    });

    it('should reject invalid URL format with 400', async () => {
      (AuthService.prototype.verifyAccessToken as jest.Mock).mockReturnValueOnce({
        sub: 'u-admin',
        email: 'admin@d.com',
        role: 'admin',
        sessionId: 's-admin',
      });

      const response = await request(app)
        .post('/api/v1/offers')
        .set('Authorization', 'Bearer admin-token')
        .send({
          productId: '8114f2e5-1921-4f2e-5192-13bc58d4a6f8',
          marketplaceId: 'b0397ee4-8281-41f2-e519-213bc58d4a6f',
          productUrl: 'invalid_url_not_http',
          price: 150,
          originalPrice: 200,
          currency: 'USD',
          stockStatus: 'IN_STOCK',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.details[0].message).toContain('Invalid product URL');
    });
  });

  describe('GET /api/v1/products/:productId/offers', () => {
    it('should allow anonymous access and retrieve product offers', async () => {
      (OfferService.prototype.getOffers as jest.Mock).mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      const response = await request(app).get('/api/v1/products/8114f2e5-1921-4f2e-5192-13bc58d4a6f8/offers');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(OfferService.prototype.getOffers).toHaveBeenCalledWith(
        expect.objectContaining({
          productId: '8114f2e5-1921-4f2e-5192-13bc58d4a6f8',
        })
      );
    });
  });
});
