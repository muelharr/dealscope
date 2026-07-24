import { Request, Response } from 'express';
import { ProductController } from '../controller';
import { ProductService } from '../service';

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

describe('ProductController Unit Tests', () => {
  let controller: ProductController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    controller = new ProductController();
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

  describe('getProduct', () => {
    it('should return 200 with mapped fields and cast Decimals to numbers', async () => {
      mockRequest.params = { id: 'p-123' };

      const mockProduct = {
        id: 'p-123',
        name: 'Super GPU',
        slug: 'super-gpu',
        description: 'RTX 5090 graphics card',
        images: ['https://images.com/gpu.png'],
        dealScore: 95,
        rating: { toNumber: () => 4.9 }, // Mocking Prisma decimal object or native decimal
        reviewCount: 15,
        specifications: { memory: '32GB GDDR7' },
        category: { id: 'c-1', name: 'GPUs', slug: 'gpus' },
        brand: { id: 'b-1', name: 'Nvidia', slug: 'nvidia' },
        marketplaceOffers: [
          {
            id: 'o-1',
            price: { toNumber: () => 1999.99 },
            url: 'https://store.nvidia.com',
            inStock: true,
            availabilityText: 'In Stock',
            availabilityType: 'positive',
            marketplace: { id: 'm-1', name: 'Nvidia Store', slug: 'nvidia-store' },
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (ProductService.prototype.getProductById as jest.Mock).mockResolvedValueOnce(mockProduct);

      await controller.getProduct(mockRequest as Request, mockResponse as Response);

      expect(ProductService.prototype.getProductById).toHaveBeenCalledWith('p-123');
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            id: 'p-123',
            rating: 4.9,
            offers: expect.arrayContaining([
              expect.objectContaining({
                price: 1999.99,
              }),
            ]),
          }),
        })
      );
    });

    it('should return 404 if product is not found', async () => {
      mockRequest.params = { id: 'p-missing' };
      (ProductService.prototype.getProductById as jest.Mock).mockResolvedValueOnce(null);

      await controller.getProduct(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'NOT_FOUND',
            message: 'Product not found or has been deleted.',
          }),
        })
      );
    });
  });
});
