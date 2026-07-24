import { Request, Response } from 'express';
import { PriceHistoryController } from '../controller';
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

describe('PriceHistoryController Unit Tests', () => {
  let controller: PriceHistoryController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    controller = new PriceHistoryController();
    jsonMock = jest.fn();
    statusMock = jest.fn().mockImplementation(() => mockResponse);

    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };

    mockRequest = {
      query: {},
      params: {},
    };

    jest.clearAllMocks();
  });

  describe('getLowestPrice', () => {
    it('should map Decimal properties to standard numbers', async () => {
      mockRequest.params = { productId: 'p-123' };

      const mockSnapshot = {
        price: { toNumber: () => 39.99 },
        recordedAt: new Date('2026-07-24T12:00:00Z'),
        marketplaceOfferId: 'o-456',
        marketplaceOffer: {
          marketplace: {
            name: 'Amazon',
          },
        },
      };

      (PriceHistoryService.prototype.getLowestPrice as jest.Mock).mockResolvedValueOnce(mockSnapshot);

      await controller.getLowestPrice(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: {
            price: 39.99,
            recordedAt: '2026-07-24T12:00:00.000Z',
            marketplaceOfferId: 'o-456',
            marketplaceName: 'Amazon',
          },
        })
      );
    });
  });
});
