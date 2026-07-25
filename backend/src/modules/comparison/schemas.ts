import { z } from 'zod';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const comparisonQuerySchema = z.object({
  query: z
    .object({
      productIds: z.string().optional(),
      ids: z.string().optional(),
    })
    .refine((data) => Boolean(data.productIds || data.ids), {
      message: 'productIds query parameter is required.',
      path: ['productIds'],
    })
    .transform((data) => {
      const raw = data.productIds || data.ids || '';
      const ids = raw.split(',').map((id) => id.trim()).filter(Boolean);
      return { productIds: ids };
    })
    .refine((data) => data.productIds.length >= 2, {
      message: 'At least 2 products must be compared.',
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
    .refine((data) => data.productIds.every((id) => UUID_REGEX.test(id)), {
      message: 'One or more Product IDs are invalid UUIDs.',
      path: ['productIds'],
    }),
});
