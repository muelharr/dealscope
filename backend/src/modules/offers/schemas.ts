import { z } from 'zod';
import { Currency, StockStatus } from '@prisma/client';

const whitelistedSortFields = ['price', 'marketplaceRating', 'createdAt'];

export const createOfferSchema = z.object({
  body: z
    .object({
      productId: z.string().uuid('Invalid Product ID format.'),
      marketplaceId: z.string().uuid('Invalid Marketplace ID format.'),
      sellerId: z.string().nullable().optional(),
      productUrl: z.string().url('Invalid product URL. must be a valid HTTP or HTTPS address.'),
      price: z.number().positive('Price must be greater than 0.'),
      originalPrice: z.number().min(0, 'Original price must be greater than or equal to 0.'),
      currency: z.nativeEnum(Currency, {
        errorMap: () => ({ message: 'Invalid Currency code. Supported enums are IDR, USD, EUR, GBP.' }),
      }),
      stockStatus: z.nativeEnum(StockStatus, {
        errorMap: () => ({ message: 'Invalid Stock Status. Supported enums are IN_STOCK, OUT_OF_STOCK, PREORDER, BACKORDER, DISCONTINUED.' }),
      }),
      shippingCost: z.number().min(0, 'Shipping cost must be greater than or equal to 0.').default(0),
      shippingEstimate: z.string().nullable().optional(),
      marketplaceRating: z
        .number()
        .min(0, 'Rating must be >= 0.')
        .max(5, 'Rating must be <= 5.')
        .nullable()
        .optional(),
      reviewCount: z.number().int().min(0, 'Review count must be >= 0.').default(0),
      isOfficialStore: z.boolean().default(false),
    })
    .refine((data) => data.originalPrice >= data.price, {
      message: 'originalPrice must be greater than or equal to price.',
      path: ['originalPrice'],
    }),
});

export const updateOfferSchema = z.object({
  body: z
    .object({
      sellerId: z.string().nullable().optional(),
      productUrl: z.string().url('Invalid product URL.').optional(),
      price: z.number().positive('Price must be greater than 0.').optional(),
      originalPrice: z.number().min(0, 'Original price must be >= 0.').optional(),
      currency: z.nativeEnum(Currency).optional(),
      stockStatus: z.nativeEnum(StockStatus).optional(),
      shippingCost: z.number().min(0, 'Shipping cost must be >= 0.').optional(),
      shippingEstimate: z.string().nullable().optional(),
      marketplaceRating: z.number().min(0).max(5).nullable().optional(),
      reviewCount: z.number().int().min(0).optional(),
      isOfficialStore: z.boolean().optional(),
      isActive: z.boolean().optional(),
    })
    .refine(
      (data) => {
        if (data.price !== undefined && data.originalPrice !== undefined) {
          return data.originalPrice >= data.price;
        }
        return true;
      },
      {
        message: 'originalPrice must be greater than or equal to price.',
        path: ['originalPrice'],
      }
    ),
});

export const offerQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1))
      .refine((val) => !isNaN(val) && val >= 1, 'Page must be a positive integer.'),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 10))
      .refine((val) => !isNaN(val) && val >= 1, 'Limit must be a positive integer.'),
    marketplace: z.string().optional(),
    minimumPrice: z
      .string()
      .optional()
      .transform((val) => (val ? parseFloat(val) : undefined))
      .refine((val) => val === undefined || (!isNaN(val) && val >= 0), 'minimumPrice must be >= 0.'),
    maximumPrice: z
      .string()
      .optional()
      .transform((val) => (val ? parseFloat(val) : undefined))
      .refine((val) => val === undefined || (!isNaN(val) && val >= 0), 'maximumPrice must be >= 0.'),
    officialStore: z
      .string()
      .optional()
      .transform((val) => (val ? val === 'true' : undefined)),
    stockStatus: z.nativeEnum(StockStatus).optional(),
    minimumRating: z
      .string()
      .optional()
      .transform((val) => (val ? parseFloat(val) : undefined))
      .refine((val) => val === undefined || (!isNaN(val) && val >= 0 && val <= 5), 'minimumRating must be between 0 and 5.'),
    productId: z.string().uuid('Invalid Product ID format.').optional(),
    sortBy: z
      .string()
      .optional()
      .default('createdAt')
      .refine(
        (val) => whitelistedSortFields.includes(val),
        (val) => ({ message: `Invalid sort field: "${val}". Whitelisted fields are: price, marketplaceRating, createdAt.` })
      ),
    sortOrder: z
      .enum(['asc', 'desc'])
      .optional()
      .default('desc'),
  }),
});
