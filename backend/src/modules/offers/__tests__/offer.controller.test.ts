import { Request, Response } from 'express';
import { OfferController } from '../controller';
import { OfferService } from '../service';
import { Currency, StockStatus } from '@prisma/client';

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

describe('OfferController Unit Tests', () => {
  let controller: OfferController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    controller = new OfferController();
    jsonMock = jest.fn();
    statusMock = jest.fn().mockImplementation(() => mockResponse);

    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };

    mockRequest = {
      query: {},
      params: {},
      body: {},
    };

    jest.clearAllMocks();
  });

  describe('getOffer', () => {
    it('should map Decimal values to numbers and serialize enums', async () => {
      mockRequest.params = { id: 'o-123' };

      const mockOffer = {
        id: 'o-123',
        productId: 'p-123',
        marketplaceId: 'm-123',
        sellerId: 'seller-abc',
        productUrl: 'https://store.com/item',
        price: { toNumber: () => 149.99 },
        originalPrice: { toNumber: () => 199.99 },
        currency: Currency.USD,
        stockStatus: StockStatus.IN_STOCK,
        shippingCost: { toNumber: () => 5.99 },
        shippingEstimate: '3-5 days',
        marketplaceRating: { toNumber: () => 4.5 },
        reviewCount: 120,
        isOfficialStore: true,
        isActive: true,
        lastScrapedAt: new Date('2026-07-24T10:00:00Z'),
        marketplace: { id: 'm-123', name: 'StoreX', slug: 'storex' },
        product: { id: 'p-123', name: 'ProductX', slug: 'productx' },
        createdAt: new Date('2026-07-24T10:00:00Z'),
        updatedAt: new Date('2026-07-24T10:00:00Z'),
      };

      (OfferService.prototype.getOfferById as jest.Mock).mockResolvedValueOnce(mockOffer);

      await controller.getOffer(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            id: 'o-123',
            price: 149.99,
            originalPrice: 199.99,
            shippingCost: 5.99,
            marketplaceRating: 4.5,
            currency: 'USD',
            stockStatus: 'IN_STOCK',
          }),
        })
      );
    });
  });
});
