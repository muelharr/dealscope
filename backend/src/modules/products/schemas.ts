import { z } from 'zod';

const whitelistedSortFields = ['name', 'dealScore', 'rating', 'createdAt'];

const primitiveSpecSchema = z.union([z.string(), z.number(), z.boolean()]);

const specificationsSchema = z.record(primitiveSpecSchema).refine(
  (val) => {
    return Object.values(val).every(
      (v) => typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean'
    );
  },
  { message: 'Specification values must be primitive types (string, number, or boolean).' }
);

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Product name is required.'),
    categoryId: z.string().uuid('Invalid Category ID format.'),
    brandId: z.string().uuid('Invalid Brand ID format.'),
    description: z.string().min(1, 'Product description is required.'),
    images: z
      .array(z.string().url('Invalid image URL.'))
      .min(1, 'At least 1 image is required.')
      .max(10, 'A maximum of 10 images are allowed.'),
    dealScore: z.number().int().min(0, 'Deal score must be greater than or equal to 0.'),
    specifications: specificationsSchema.default({}),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    categoryId: z.string().uuid().optional(),
    brandId: z.string().uuid().optional(),
    description: z.string().min(1).optional(),
    images: z
      .array(z.string().url('Invalid image URL.'))
      .min(1)
      .max(10)
      .optional(),
    dealScore: z.number().int().min(0).optional(),
    specifications: specificationsSchema.optional(),
  }),
});

export const productQuerySchema = z.object({
  query: z
    .object({
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
      sortBy: z
        .string()
        .optional()
        .default('createdAt')
        .refine(
          (val) => whitelistedSortFields.includes(val),
          (val) => ({ message: `Invalid sort field: "${val}". Whitelisted fields are name, dealScore, rating, createdAt.` })
        ),
      sortOrder: z
        .enum(['asc', 'desc'])
        .optional()
        .default('desc'),
      category: z.string().optional(),
      brand: z.string().optional(),
      priceMin: z
        .string()
        .optional()
        .transform((val) => (val ? parseFloat(val) : undefined))
        .refine((val) => val === undefined || (!isNaN(val) && val >= 0), 'priceMin must be >= 0.'),
      priceMax: z
        .string()
        .optional()
        .transform((val) => (val ? parseFloat(val) : undefined))
        .refine((val) => val === undefined || (!isNaN(val) && val >= 0), 'priceMax must be >= 0.'),
      search: z.string().optional(),
    })
    .refine(
      (data) => {
        if (data.priceMin !== undefined && data.priceMax !== undefined) {
          return data.priceMax >= data.priceMin;
        }
        return true;
      },
      { message: 'priceMax must be greater than or equal to priceMin.', path: ['priceMax'] }
    ),
});
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
