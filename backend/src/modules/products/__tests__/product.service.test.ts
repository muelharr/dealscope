import { ProductService } from '../service';
import { prisma } from '../../../config/prisma';

jest.mock('../../../config/prisma', () => ({
  prisma: {
    product: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

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

describe('ProductService Unit Tests', () => {
  let service: ProductService;

  beforeEach(() => {
    service = new ProductService();
    jest.clearAllMocks();
  });

  describe('generateUniqueSlug', () => {
    it('should generate a simple lowercase slug without special characters', async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValueOnce(null);

      const slug = await service.generateUniqueSlug('Intel Core i7 13700K!');
      expect(slug).toBe('intel-core-i7-13700k');
      expect(prisma.product.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should append a count suffix if the slug already exists', async () => {
      (prisma.product.findUnique as jest.Mock)
        .mockResolvedValueOnce({ id: 'existing-1' }) // first check collides
        .mockResolvedValueOnce({ id: 'existing-2' }) // second check collides
        .mockResolvedValueOnce(null);                // third check passes

      const slug = await service.generateUniqueSlug('test-product');
      expect(slug).toBe('test-product-2');
      expect(prisma.product.findUnique).toHaveBeenCalledTimes(3);
    });
  });

  describe('getProducts', () => {
    it('should query active products and default deletedAt to null', async () => {
      (prisma.product.count as jest.Mock).mockResolvedValue(2);
      (prisma.product.findMany as jest.Mock).mockResolvedValue([
        { id: '1', name: 'Product 1', deletedAt: null },
        { id: '2', name: 'Product 2', deletedAt: null },
      ]);

      const result = await service.getProducts({ page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' });

      expect(prisma.product.count).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ deletedAt: null }),
        })
      );
      expect(result.items).toHaveLength(2);
    });

    it('should apply price filtering on MarketplaceOffers relation', async () => {
      (prisma.product.count as jest.Mock).mockResolvedValue(1);
      (prisma.product.findMany as jest.Mock).mockResolvedValue([]);

      await service.getProducts({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        priceMin: 100,
        priceMax: 500,
      });

      expect(prisma.product.count).toHaveBeenCalledWith({
        where: expect.objectContaining({
          marketplaceOffers: {
            some: {
              AND: [
                { price: { gte: 100 } },
                { price: { lte: 500 } },
              ],
            },
          },
        }),
      });
    });

    it('should query search criteria across name, description, category, and brand', async () => {
      (prisma.product.count as jest.Mock).mockResolvedValue(1);
      (prisma.product.findMany as jest.Mock).mockResolvedValue([]);

      await service.getProducts({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        search: 'rtx',
      });

      expect(prisma.product.count).toHaveBeenCalledWith({
        where: expect.objectContaining({
          OR: [
            { name: { contains: 'rtx', mode: 'insensitive' } },
            { description: { contains: 'rtx', mode: 'insensitive' } },
            { category: { name: { contains: 'rtx', mode: 'insensitive' } } },
            { brand: { name: { contains: 'rtx', mode: 'insensitive' } } },
          ],
        }),
      });
    });
  });

  describe('updateProduct', () => {
    it('should reject updates to soft-deleted products', async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValueOnce({
        id: 'p-123',
        name: 'Old Laptop',
        deletedAt: new Date(), // soft deleted
      });

      await expect(service.updateProduct('p-123', { name: 'New Laptop' })).rejects.toThrow(
        'Product not found or has been deleted.'
      );
      expect(prisma.product.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteProduct', () => {
    it('should set deletedAt date instead of hard deleting', async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValueOnce({
        id: 'p-123',
        name: 'Active laptop',
        deletedAt: null,
      });

      (prisma.product.update as jest.Mock).mockResolvedValueOnce({
        id: 'p-123',
        deletedAt: new Date(),
      });

      await service.deleteProduct('p-123');

      expect(prisma.product.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'p-123' },
          data: expect.objectContaining({
            deletedAt: expect.any(Date),
          }),
        })
      );
    });
  });
});
