import { PriceHistoryService } from '../service';
import { prisma } from '../../../config/prisma';
import { Currency, StockStatus, MarketplaceOffer, Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

jest.mock('../../../config/prisma', () => {
  return {
    prisma: {
      priceHistory: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
      },
      marketplaceOffer: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
      },
    },
  };
});

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

describe('PriceHistoryService Unit Tests', () => {
  let service: PriceHistoryService;
  let mockTx: Record<string, Record<string, jest.Mock>>;

  beforeEach(() => {
    service = new PriceHistoryService();
    jest.clearAllMocks();

    mockTx = {
      priceHistory: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
    };
  });

  describe('recordSnapshot', () => {
    const offerBase: MarketplaceOffer = {
      id: 'o-123',
      productId: 'p-123',
      marketplaceId: 'm-123',
      sellerId: 's-123',
      productUrl: 'https://store.com/item',
      price: new Decimal(99.99),
      originalPrice: new Decimal(120.0),
      currency: Currency.USD,
      stockStatus: StockStatus.IN_STOCK,
      shippingCost: new Decimal(0),
      shippingEstimate: null,
      marketplaceRating: new Decimal(4.5),
      reviewCount: 50,
      isOfficialStore: true,
      isActive: true,
      lastScrapedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create a snapshot if no previous snapshot exists', async () => {
      mockTx.priceHistory.findFirst.mockResolvedValueOnce(null);

      await service.recordSnapshot(mockTx as unknown as Prisma.TransactionClient, offerBase);

      expect(mockTx.priceHistory.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            marketplaceOfferId: 'o-123',
            price: offerBase.price,
          }),
        })
      );
    });

    it('should NOT create a snapshot if tracked fields are identical', async () => {
      const latestSnapshot = {
        price: 99.99,
        originalPrice: 120.0,
        shippingCost: 0,
        stockStatus: StockStatus.IN_STOCK,
        marketplaceRating: 4.5,
        reviewCount: 50,
      };
      mockTx.priceHistory.findFirst.mockResolvedValueOnce(latestSnapshot);

      await service.recordSnapshot(mockTx as unknown as Prisma.TransactionClient, offerBase);

      expect(mockTx.priceHistory.create).not.toHaveBeenCalled();
    });

    it('should create a snapshot if price changes', async () => {
      const latestSnapshot = {
        price: 95.0, // Different
        originalPrice: 120.0,
        shippingCost: 0,
        stockStatus: StockStatus.IN_STOCK,
        marketplaceRating: 4.5,
        reviewCount: 50,
      };
      mockTx.priceHistory.findFirst.mockResolvedValueOnce(latestSnapshot);

      await service.recordSnapshot(mockTx as unknown as Prisma.TransactionClient, offerBase);

      expect(mockTx.priceHistory.create).toHaveBeenCalled();
    });

    it('should create a snapshot if shippingCost changes', async () => {
      const latestSnapshot = {
        price: 99.99,
        originalPrice: 120.0,
        shippingCost: 10.0, // Different
        stockStatus: StockStatus.IN_STOCK,
        marketplaceRating: 4.5,
        reviewCount: 50,
      };
      mockTx.priceHistory.findFirst.mockResolvedValueOnce(latestSnapshot);

      await service.recordSnapshot(mockTx as unknown as Prisma.TransactionClient, offerBase);

      expect(mockTx.priceHistory.create).toHaveBeenCalled();
    });

    it('should ignore changes to lastScrapedAt or updatedAt', async () => {
      const latestSnapshot = {
        price: 99.99,
        originalPrice: 120.0,
        shippingCost: 0,
        stockStatus: StockStatus.IN_STOCK,
        marketplaceRating: 4.5,
        reviewCount: 50,
      };
      mockTx.priceHistory.findFirst.mockResolvedValueOnce(latestSnapshot);

      // Mutate lastScrapedAt only
      const mutatedOffer = {
        ...offerBase,
        lastScrapedAt: new Date(Date.now() + 60000),
      };

      await service.recordSnapshot(mockTx as unknown as Prisma.TransactionClient, mutatedOffer);

      expect(mockTx.priceHistory.create).not.toHaveBeenCalled();
    });
  });

  describe('lowest / highest and trends', () => {
    it('should find lowest price snapshot correctly', async () => {
      (prisma.priceHistory.findFirst as jest.Mock).mockResolvedValueOnce({
        price: 49.99,
        recordedAt: new Date(),
      });

      const res = await service.getLowestPrice('p-123');
      expect(res?.price).toBe(49.99);
    });

    it('should calculate price trends correctly', async () => {
      (prisma.marketplaceOffer.findFirst as jest.Mock).mockResolvedValueOnce({
        id: 'o-1',
        price: 150.0,
        originalPrice: 200.0,
      });

      (prisma.priceHistory.findMany as jest.Mock).mockResolvedValueOnce([
        { price: 150.0 }, // current cheapest
        { price: 180.0 }, // previous cheapest
      ]);

      const res = await service.getPriceTrend('p-123');

      expect(res.currentPrice).toBe(150.0);
      expect(res.previousPrice).toBe(180.0);
      expect(res.direction).toBe('down');
      expect(res.changeAmount).toBe(-30.0);
      expect(res.changePercentage).toBe(-16.67);
    });
  });
});
