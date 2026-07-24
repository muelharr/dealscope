import request from 'supertest';
import app from '../../../app';
import { ProductService } from '../service';
import { AuthService } from '../../auth/service';

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

describe('Product Routes Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/products', () => {
    it('should allow anonymous access', async () => {
      (ProductService.prototype.getProducts as jest.Mock).mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      const response = await request(app).get('/api/v1/products');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it('should reject invalid sort fields with 400', async () => {
      const response = await request(app)
        .get('/api/v1/products')
        .query({ sortBy: 'hacked_field' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('BAD_REQUEST');
      expect(response.body.error.details[0].message).toContain('Invalid sort field');
    });

    it('should return empty list when paginating beyond available pages', async () => {
      (ProductService.prototype.getProducts as jest.Mock).mockResolvedValueOnce({
        items: [],
        total: 5,
      });

      const response = await request(app)
        .get('/api/v1/products')
        .query({ page: '10', limit: '2' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(response.body.meta.pagination.totalPages).toBe(3);
      expect(response.body.meta.pagination.currentPage).toBe(10);
    });
  });

  describe('POST /api/v1/products', () => {
    it('should reject requests without auth headers with 401', async () => {
      const response = await request(app)
        .post('/api/v1/products')
        .send({ name: 'Unauth Product' });

      expect(response.status).toBe(401);
    });

    it('should reject non-admin roles with 403', async () => {
      // Authenticated but is 'user' role
      (AuthService.prototype.verifyAccessToken as jest.Mock).mockReturnValueOnce({
        sub: 'u-1',
        email: 'user@d.com',
        role: 'user',
        sessionId: 's-1',
      });

      const response = await request(app)
        .post('/api/v1/products')
        .set('Authorization', 'Bearer user-token')
        .send({ name: 'Unauth Product' });

      expect(response.status).toBe(403);
    });

    it('should accept creations with valid payload and admin credentials', async () => {
      (AuthService.prototype.verifyAccessToken as jest.Mock).mockReturnValueOnce({
        sub: 'u-admin',
        email: 'admin@d.com',
        role: 'admin',
        sessionId: 's-admin',
      });

      const mockProduct = {
        id: 'p-1',
        name: 'New Admin Phone',
        slug: 'new-admin-phone',
        description: 'Latest high tier device',
        images: ['https://images.com/phone.png'],
        dealScore: 90,
        rating: 0.0,
        reviewCount: 0,
        specifications: {},
        category: { id: 'c-1', name: 'Smartphones', slug: 'smartphones' },
        brand: { id: 'b-1', name: 'BrandX', slug: 'brandx' },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (ProductService.prototype.createProduct as jest.Mock).mockResolvedValueOnce(mockProduct);

      const response = await request(app)
        .post('/api/v1/products')
        .set('Authorization', 'Bearer admin-token')
        .send({
          name: 'New Admin Phone',
          categoryId: '8114f2e5-1921-4f2e-5192-13bc58d4a6f8',
          brandId: 'b0397ee4-8281-41f2-e519-213bc58d4a6f',
          description: 'Latest high tier device',
          images: ['https://images.com/phone.png'],
          dealScore: 90,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('New Admin Phone');
    });
  });
});
