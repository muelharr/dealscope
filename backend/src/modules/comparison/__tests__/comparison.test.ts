import request from 'supertest';
import app from '../../../app';
import { prisma } from '../../../config/prisma';
import { StockStatus } from '@prisma/client';

jest.mock('../../../config/prisma', () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
    },
  },
}));

const ID1 = '11111111-1111-4111-8111-111111111111';
const ID2 = '22222222-2222-4222-8222-222222222222';
const ID3 = '33333333-3333-4333-8333-333333333333';
const ID4 = '44444444-4444-4444-8444-444444444444';
const ID_NOT_FOUND = '99999999-9999-4999-8999-999999999999';

const mockProducts = [
  {
    id: ID1,
    name: 'Product A',
    slug: 'product-a',
    dealScore: 8,
    rating: '4.5',
    reviewCount: 100,
    deletedAt: null,
    category: { name: 'Cat A' },
    brand: { name: 'Brand X' },
    images: [],
    marketplaceOffers: [
      {
        id: 'o1',
        price: 100,
        originalPrice: 120,
        shippingCost: 10,
        stockStatus: StockStatus.IN_STOCK,
        isActive: true,
        isOfficialStore: true,
        marketplaceRating: 4.8,
        marketplace: { id: 'm1', name: 'Store A' },
      },
    ],
    priceHistories: [{ price: 90, recordedAt: new Date() }],
  },
  {
    id: ID2,
    name: 'Product B',
    slug: 'product-b',
    dealScore: 9,
    rating: '4.8',
    reviewCount: 150,
    deletedAt: null,
    category: { name: 'Cat B' },
    brand: { name: 'Brand Y' },
    images: [],
    marketplaceOffers: [
      {
        id: 'o2',
        price: 95,
        originalPrice: 125,
        shippingCost: 5,
        stockStatus: StockStatus.IN_STOCK,
        isActive: true,
        isOfficialStore: false,
        marketplaceRating: 4.9,
        marketplace: { id: 'm2', name: 'Store B' },
      },
    ],
    priceHistories: [{ price: 100, recordedAt: new Date() }],
  },
  {
    id: ID3,
    name: 'Product C (No Offers)',
    slug: 'product-c',
    dealScore: 7,
    rating: '4.2',
    reviewCount: 50,
    deletedAt: null,
    category: { name: 'Cat A' },
    brand: { name: 'Brand Z' },
    images: [],
    marketplaceOffers: [],
    priceHistories: [],
  },
  {
    id: ID4,
    name: 'Product D (Tie Breaker)',
    slug: 'product-d',
    dealScore: 9,
    rating: '4.8',
    reviewCount: 120,
    deletedAt: null,
    category: { name: 'Cat B' },
    brand: { name: 'Brand Y' },
    images: [],
    marketplaceOffers: [
      {
        id: 'o3',
        price: 95,
        originalPrice: 125,
        shippingCost: 5,
        stockStatus: StockStatus.IN_STOCK,
        isActive: true,
        isOfficialStore: true,
        marketplaceRating: 5.0,
        marketplace: { id: 'm3', name: 'Store C' },
      },
    ],
    priceHistories: [{ price: 100, recordedAt: new Date() }],
  },
];

describe('Comparison Module Tests - /api/v1/comparison', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Input Validation', () => {
    it('should return 400 if productIds is missing', async () => {
      const response = await request(app).get('/api/v1/comparison');
      expect(response.status).toBe(400);
    });

    it('should return 400 for less than 2 product IDs', async () => {
      const response = await request(app).get(`/api/v1/comparison?productIds=${ID1}`);
      expect(response.status).toBe(400);
    });

    it('should return 400 for more than 4 product IDs', async () => {
      const response = await request(app).get(`/api/v1/comparison?productIds=${ID1},${ID2},${ID3},${ID4},55555555-5555-4555-8555-555555555555`);
      expect(response.status).toBe(400);
    });

    it('should return 400 for duplicate product IDs', async () => {
      const response = await request(app).get(`/api/v1/comparison?productIds=${ID1},${ID1}`);
      expect(response.status).toBe(400);
    });

    it('should return 400 for invalid UUIDs', async () => {
      const response = await request(app).get(`/api/v1/comparison?productIds=${ID1},invalid-uuid`);
      expect(response.status).toBe(400);
    });
  });

  describe('Core Functionality', () => {
    it('should return 404 if any product is not found', async () => {
      (prisma.product.findMany as jest.Mock).mockResolvedValueOnce([mockProducts[0]]);
      const response = await request(app).get(`/api/v1/comparison?productIds=${ID1},${ID_NOT_FOUND}`);
      expect(response.status).toBe(404);
    });

    it('should compare two products successfully', async () => {
      (prisma.product.findMany as jest.Mock).mockResolvedValueOnce([mockProducts[0], mockProducts[1]]);
      const response = await request(app).get(`/api/v1/comparison?productIds=${ID1},${ID2}`);
      expect(response.status).toBe(200);
      expect(response.body.data.products).toHaveLength(2);
      expect(response.body.data.meta.comparisonCount).toBe(2);
    });

    it('should handle products with no active offers', async () => {
      (prisma.product.findMany as jest.Mock).mockResolvedValueOnce([mockProducts[0], mockProducts[2]]);
      const response = await request(app).get(`/api/v1/comparison?productIds=${ID1},${ID3}`);
      expect(response.status).toBe(200);
      expect(response.body.data.products[1].bestOffer).toBeNull();
    });

    it('should preserve the order of productIds', async () => {
      (prisma.product.findMany as jest.Mock).mockResolvedValueOnce([mockProducts[1], mockProducts[0]]);
      const response = await request(app).get(`/api/v1/comparison?productIds=${ID2},${ID1}`);
      expect(response.status).toBe(200);
      expect(response.body.data.products[0].productSummary.id).toBe(ID2);
      expect(response.body.data.products[1].productSummary.id).toBe(ID1);
    });
  });

  describe('Summary & Tie-Breaker Logic', () => {
    it('should correctly identify summary winners', async () => {
      (prisma.product.findMany as jest.Mock).mockResolvedValueOnce([mockProducts[0], mockProducts[1]]);
      const response = await request(app).get(`/api/v1/comparison?productIds=${ID1},${ID2}`);

      const summary = response.body.data.summary;
      expect(summary.cheapestProductId).toBe(ID2); // Effective price: p1=110, p2=100
      expect(summary.highestDiscountProductId).toBe(ID2); // Discount: p1=16.67, p2=24
      expect(summary.highestDealScoreProductId).toBe(ID2);
      expect(summary.bestRatedProductId).toBe(ID2);
    });

    it('should handle tie-breakers correctly', async () => {
      (prisma.product.findMany as jest.Mock).mockResolvedValueOnce([mockProducts[1], mockProducts[3]]);
      const response = await request(app).get(`/api/v1/comparison?productIds=${ID2},${ID4}`);
      const summary = response.body.data.summary;

      expect(summary.bestRatedProductId).toBe(ID2);
      expect(summary.cheapestProductId).toBe(ID2);
    });

    it('should exclude products with no offers from price-based summaries', async () => {
      (prisma.product.findMany as jest.Mock).mockResolvedValueOnce([mockProducts[0], mockProducts[2]]);
      const response = await request(app).get(`/api/v1/comparison?productIds=${ID1},${ID3}`);

      const summary = response.body.data.summary;
      expect(summary.cheapestProductId).toBe(ID1);
      expect(summary.highestDiscountProductId).toBe(ID1);
      expect(summary.highestDealScoreProductId).toBe(ID1);
      expect(summary.bestRatedProductId).toBe(ID1);
    });
  });
});
