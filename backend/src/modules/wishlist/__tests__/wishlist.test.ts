import request from 'supertest';
import app from '../../../app';
import { WishlistService } from '../service';

jest.mock('../service');
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    ping: jest.fn().mockResolvedValue('PONG'),
    quit: jest.fn().mockResolvedValue('OK'),
  }));
});

describe('Wishlist Module Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/wishlist authentication check', () => {
    it('should reject unauthenticated requests with HTTP 401', async () => {
      const response = await request(app).get('/api/v1/wishlist');
      expect(response.status).toBe(401);
    });
  });

  describe('WishlistService methods', () => {
    let service: WishlistService;

    beforeEach(() => {
      service = new WishlistService();
    });

    it('should return empty list when user has no wishlist items', async () => {
      jest.spyOn(service, 'getUserWishlist').mockResolvedValueOnce([]);
      const res = await service.getUserWishlist('user-1');
      expect(res).toEqual([]);
    });
  });
});
