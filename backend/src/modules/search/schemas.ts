import { z } from 'zod';
import { StockStatus } from '@prisma/client';

export const searchQuerySchema = z.object({
  query: z
    .object({
      q: z.string().optional(),
      category: z.string().optional(),
      brand: z.string().optional(),
      marketplace: z.string().optional(),
      minPrice: z
        .string()
        .optional()
        .transform((val) => (val ? parseFloat(val) : undefined))
        .refine((val) => val === undefined || (!isNaN(val) && val >= 0), 'minPrice must be a non-negative number.'),
      maxPrice: z
        .string()
        .optional()
        .transform((val) => (val ? parseFloat(val) : undefined))
        .refine((val) => val === undefined || (!isNaN(val) && val >= 0), 'maxPrice must be a non-negative number.'),
      officialStore: z
        .string()
        .optional()
        .transform((val) => {
          if (val === 'true') return true;
          if (val === 'false') return false;
          return undefined;
        }),
      stockStatus: z.nativeEnum(StockStatus).optional(),
      minRating: z
        .string()
        .optional()
        .transform((val) => (val ? parseFloat(val) : undefined))
        .refine((val) => val === undefined || (!isNaN(val) && val >= 0 && val <= 5), 'minRating must be between 0 and 5.'),
      sortBy: z.enum(['dealScore', 'newest', 'price', 'discount']).optional().default('dealScore'),
      sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
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
    })
    .refine(
      (data) => {
        if (data.minPrice !== undefined && data.maxPrice !== undefined) {
          return data.minPrice <= data.maxPrice;
        }
        return true;
      },
      {
        message: 'minPrice must be less than or equal to maxPrice.',
        path: ['minPrice'],
      }
    ),
});
