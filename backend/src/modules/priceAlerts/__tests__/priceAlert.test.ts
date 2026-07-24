import request from 'supertest';
import app from '../../../app';
import { PriceAlertService } from '../service';
import { AuthService } from '../../auth/service';
import { prisma } from '../../../config/prisma';
import { Decimal } from '@prisma/client/runtime/library';
import { StockStatus } from '@prisma/client';

// Mock prisma and auth service
jest.mock('../../../config/prisma', () => {
  return {
    prisma: {
      product: {
        findFirst: jest.fn(),
        findUnique: jest.fn(),
      },
      priceAlert: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    },
  };
});

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

describe('Price Alerts Module Tests', () => {
  let service: PriceAlertService;

  beforeEach(() => {
    service = new PriceAlertService();
    jest.clearAllMocks();
  });

  describe('PriceAlertService - Unit Tests', () => {
    describe('evaluateAlert', () => {
      const mockBestOffer = {
        id: 'offer-1',
        price: 100,
        originalPrice: 150,
        marketplace: { id: 'm1', name: 'Store', logoUrl: null },
        officialStore: true,
        stockStatus: StockStatus.IN_STOCK,
        discountPercentage: 33.33,
      };

      it('should return triggered: false if alert is disabled', () => {
        const result = service.evaluateAlert(
          { targetPrice: 120, targetDiscountPercentage: null, isEnabled: false },
          mockBestOffer
        );
        expect(result).toEqual({ triggered: false, reason: null });
      });

      it('should return triggered: false if best offer is null', () => {
        const result = service.evaluateAlert(
          { targetPrice: 120, targetDiscountPercentage: null, isEnabled: true },
          null
        );
        expect(result).toEqual({ triggered: false, reason: null });
      });

      it('should trigger when current price falls below or equals targetPrice', () => {
        const result = service.evaluateAlert(
          { targetPrice: 100, targetDiscountPercentage: null, isEnabled: true },
          mockBestOffer
        );
        expect(result).toEqual({ triggered: true, reason: 'PRICE_REACHED' });
      });

      it('should not trigger if current price is above targetPrice', () => {
        const result = service.evaluateAlert(
          { targetPrice: 90, targetDiscountPercentage: null, isEnabled: true },
          mockBestOffer
        );
        expect(result).toEqual({ triggered: false, reason: null });
      });

      it('should trigger when current discount reaches or exceeds targetDiscountPercentage', () => {
        const result = service.evaluateAlert(
          { targetPrice: null, targetDiscountPercentage: 30, isEnabled: true },
          mockBestOffer
        );
        expect(result).toEqual({ triggered: true, reason: 'DISCOUNT_REACHED' });
      });

      it('should not trigger if current discount is below targetDiscountPercentage', () => {
        const result = service.evaluateAlert(
          { targetPrice: null, targetDiscountPercentage: 40, isEnabled: true },
          mockBestOffer
        );
        expect(result).toEqual({ triggered: false, reason: null });
      });
    });

    describe('createAlert', () => {
      const mockProduct = {
        id: 'p-1',
        name: 'Test Product',
        slug: 'test-product',
        images: [],
        rating: new Decimal(4.5),
        reviewCount: 10,
        dealScore: 90,
        deletedAt: null,
      };

      it('should throw error if product is not found or soft-deleted', async () => {
        (prisma.product.findFirst as jest.Mock).mockResolvedValueOnce(null);

        await expect(
          service.createAlert('u-1', { productId: 'p-1', targetPrice: 100 })
        ).rejects.toThrow('Product not found or has been deleted.');
      });

      it('should throw error if alert already exists', async () => {
        (prisma.product.findFirst as jest.Mock).mockResolvedValueOnce(mockProduct);
        (prisma.priceAlert.findUnique as jest.Mock).mockResolvedValueOnce({ id: 'a-1' });

        await expect(
          service.createAlert('u-1', { productId: 'p-1', targetPrice: 100 })
        ).rejects.toThrow('Price alert already exists for this product.');
      });

      it('should successfully create an alert', async () => {
        const mockCreatedAlert = {
          id: 'a-1',
          userId: 'u-1',
          productId: 'p-1',
          targetPrice: new Decimal(100),
          targetDiscountPercentage: null,
          isEnabled: true,
          lastTriggeredAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          product: {
            ...mockProduct,
            marketplaceOffers: [],
            priceHistories: [],
          },
        };

        (prisma.product.findFirst as jest.Mock).mockResolvedValueOnce(mockProduct);
        (prisma.priceAlert.findUnique as jest.Mock).mockResolvedValueOnce(null);
        (prisma.priceAlert.create as jest.Mock).mockResolvedValueOnce(mockCreatedAlert);

        const result = await service.createAlert('u-1', { productId: 'p-1', targetPrice: 100 });
        expect(result.id).toBe('a-1');
        expect(result.targetPrice).toBe(100);
      });
    });
  });

  describe('Price Alerts API Endpoints - Integration Tests', () => {
    const mockUser = {
      sub: 'u-1',
      id: 'u-1',
      email: 'user@d.com',
      role: 'user',
      sessionId: 's-1',
    };

    beforeEach(() => {
      (AuthService.prototype.verifyAccessToken as jest.Mock).mockReturnValue(mockUser);
    });

    describe('GET /api/v1/price-alerts', () => {
      it('should reject unauthenticated request with 401 if token is missing', async () => {
        const response = await request(app).get('/api/v1/price-alerts');
        expect(response.status).toBe(401);
      });

      it('should reject unauthenticated request with 401 if token is invalid', async () => {
        (AuthService.prototype.verifyAccessToken as jest.Mock).mockImplementationOnce(() => {
          throw new Error('Invalid token');
        });

        const response = await request(app)
          .get('/api/v1/price-alerts')
          .set('Authorization', 'Bearer invalid-token');
        expect(response.status).toBe(401);
      });

      it('should return empty list when user has no alerts', async () => {
        (prisma.priceAlert.findMany as jest.Mock).mockResolvedValueOnce([]);

        const response = await request(app)
          .get('/api/v1/price-alerts')
          .set('Authorization', 'Bearer valid-token');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual([]);
      });
    });

    describe('POST /api/v1/price-alerts', () => {
      const productId = '8114f2e5-1921-4f2e-5192-13bc58d4a6f8';

      it('should reject if both targetPrice and targetDiscountPercentage are missing', async () => {
        const response = await request(app)
          .post('/api/v1/price-alerts')
          .set('Authorization', 'Bearer valid-token')
          .send({ productId });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      });

      it('should reject invalid productId format', async () => {
        const response = await request(app)
          .post('/api/v1/price-alerts')
          .set('Authorization', 'Bearer valid-token')
          .send({ productId: 'invalid-uuid', targetPrice: 100 });

        expect(response.status).toBe(400);
      });

      it('should return 409 if alert already exists', async () => {
        (prisma.product.findFirst as jest.Mock).mockResolvedValueOnce({ id: productId, deletedAt: null });
        (prisma.priceAlert.findUnique as jest.Mock).mockResolvedValueOnce({ id: 'a-1' });

        const response = await request(app)
          .post('/api/v1/price-alerts')
          .set('Authorization', 'Bearer valid-token')
          .send({ productId, targetPrice: 100 });

        expect(response.status).toBe(409);
        expect(response.body.error.code).toBe('CONFLICT');
      });
    });

    describe('PUT /api/v1/price-alerts/:id', () => {
      const alertId = '8114f2e5-1921-4f2e-5192-13bc58d4a6f8';

      it('should return 400 if updating both targets to null', async () => {
        const response = await request(app)
          .put(`/api/v1/price-alerts/${alertId}`)
          .set('Authorization', 'Bearer valid-token')
          .send({ targetPrice: null, targetDiscountPercentage: null });

        expect(response.status).toBe(400);
      });
    });

    describe('DELETE /api/v1/price-alerts/:id', () => {
      const alertId = '8114f2e5-1921-4f2e-5192-13bc58d4a6f8';

      it('should successfully delete an alert', async () => {
        (prisma.priceAlert.findUnique as jest.Mock).mockResolvedValueOnce({ id: alertId, userId: mockUser.id });
        (prisma.priceAlert.delete as jest.Mock).mockResolvedValueOnce({});

        const response = await request(app)
          .delete(`/api/v1/price-alerts/${alertId}`)
          .set('Authorization', 'Bearer valid-token');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });
    });
  });
});
