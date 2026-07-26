import { z } from 'zod';

export const comparisonQuerySchema = z.object({
  query: z
    .object({
      productIds: z.string().optional(),
      ids: z.string().optional(),
    })
    .refine((data) => Boolean(data.productIds || data.ids), {
      message: 'productIds or ids query parameter is required.',
      path: ['productIds'],
    })
    .transform((data) => {
      const raw = data.productIds || data.ids || '';
      const ids = raw.split(',').map((id) => id.trim()).filter(Boolean);
      return { productIds: ids };
    })
    .refine((data) => data.productIds.length >= 1, {
      message: 'At least 1 product must be provided for comparison.',
      path: ['productIds'],
    })
    .refine((data) => data.productIds.length <= 4, {
      message: 'No more than 4 products can be compared.',
      path: ['productIds'],
    })
    .refine((data) => new Set(data.productIds).size === data.productIds.length, {
      message: 'Duplicate Product IDs are not allowed.',
      path: ['productIds'],
    })
    .refine((data) => data.productIds.every((id) => id.length > 0), {
      message: 'One or more Product IDs are invalid.',
      path: ['productIds'],
    }),
});
