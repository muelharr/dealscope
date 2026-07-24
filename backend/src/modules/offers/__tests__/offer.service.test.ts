import { OfferService } from '../service';
import { prisma } from '../../../config/prisma';
import { Currency, StockStatus } from '@prisma/client';

const mockTxMarketplaceOffer = {
  findFirst: jest.fn(),
  findUnique: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};

const mockTxPriceHistory = {
  findFirst: jest.fn(),
  create: jest.fn(),
};

jest.mock('../../../config/prisma', () => {
  return {
    prisma: {
      marketplaceOffer: {
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      $transaction: jest.fn((callback) => callback({
        marketplaceOffer: mockTxMarketplaceOffer,
        priceHistory: mockTxPriceHistory,
      })),
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

describe('OfferService Unit Tests', () => {
  let service: OfferService;

  beforeEach(() => {
    service = new OfferService();
    jest.clearAllMocks();
    
    mockTxMarketplaceOffer.findFirst.mockReset();
    mockTxMarketplaceOffer.findUnique.mockReset();
    mockTxMarketplaceOffer.create.mockReset();
    mockTxMarketplaceOffer.update.mockReset();
    mockTxPriceHistory.findFirst.mockReset();
    mockTxPriceHistory.create.mockReset();
  });

  describe('getOffers', () => {
    it('should query active offers by default', async () => {
      (prisma.marketplaceOffer.count as jest.Mock).mockResolvedValueOnce(1);
      (prisma.marketplaceOffer.findMany as jest.Mock).mockResolvedValueOnce([]);

      await service.getOffers({ page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' });

      expect(prisma.marketplaceOffer.count).toHaveBeenCalledWith({
        where: expect.objectContaining({ isActive: true }),
      });
    });

    it('should exclude inactive offers', async () => {
      (prisma.marketplaceOffer.count as jest.Mock).mockResolvedValueOnce(0);
      (prisma.marketplaceOffer.findMany as jest.Mock).mockResolvedValueOnce([]);

      await service.getOffers({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        productId: 'p-1',
      });

      expect(prisma.marketplaceOffer.count).toHaveBeenCalledWith({
        where: expect.objectContaining({
          isActive: true,
          productId: 'p-1',
        }),
      });
    });
  });

  describe('createOffer', () => {
    const newOfferPayload = {
      productId: 'p-123',
      marketplaceId: 'm-456',
      sellerId: 's-789',
      productUrl: 'https://dealscope.com/phone',
      price: 999.99,
      originalPrice: 1099.99,
      currency: Currency.USD,
      stockStatus: StockStatus.IN_STOCK,
    };

    it('should throw an error if an active offer already exists', async () => {
      mockTxMarketplaceOffer.findFirst.mockResolvedValueOnce({
        id: 'o-1',
        isActive: true,
      });

      await expect(service.createOffer(newOfferPayload)).rejects.toThrow(
        'An active offer for this product, marketplace, and seller combination already exists.'
      );
      expect(mockTxMarketplaceOffer.create).not.toHaveBeenCalled();
    });

    it('should reactivate and update details if an inactive offer already exists', async () => {
      mockTxMarketplaceOffer.findFirst.mockResolvedValueOnce({
        id: 'o-inactive',
        isActive: false,
      });

      mockTxMarketplaceOffer.update.mockResolvedValueOnce({
        id: 'o-inactive',
        isActive: true,
      });

      await service.createOffer(newOfferPayload);

      expect(mockTxMarketplaceOffer.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'o-inactive' },
          data: expect.objectContaining({
            isActive: true,
            price: 999.99,
            lastScrapedAt: expect.any(Date),
          }),
        })
      );
      expect(mockTxMarketplaceOffer.create).not.toHaveBeenCalled();
    });

    it('should create a new active offer if no duplicate combination exists', async () => {
      mockTxMarketplaceOffer.findFirst.mockResolvedValueOnce(null);
      mockTxMarketplaceOffer.create.mockResolvedValueOnce({
        id: 'o-new',
        isActive: true,
      });

      await service.createOffer(newOfferPayload);

      expect(mockTxMarketplaceOffer.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            productId: 'p-123',
            isActive: true,
            lastScrapedAt: expect.any(Date),
          }),
        })
      );
    });
  });

  describe('deactivateOffer', () => {
    it('should set isActive = false on deletion', async () => {
      (prisma.marketplaceOffer.findUnique as jest.Mock).mockResolvedValueOnce({
        id: 'o-1',
        isActive: true,
      });

      (prisma.marketplaceOffer.update as jest.Mock).mockResolvedValueOnce({
        id: 'o-1',
        isActive: false,
      });

      await service.deleteOffer('o-1');

      expect(prisma.marketplaceOffer.update).toHaveBeenCalledWith({
        where: { id: 'o-1' },
        data: expect.objectContaining({
          isActive: false,
          lastScrapedAt: expect.any(Date),
        }),
      });
    });
  });
});
