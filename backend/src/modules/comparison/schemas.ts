import { z } from 'zod';

export const comparisonQuerySchema = z.object({
  query: z.object({
    productIds: z
      .string({ required_error: 'productIds query parameter is required.' })
      .refine((val) => val.trim().length > 0, 'productIds query parameter cannot be empty.')
      .transform((val) => val.split(',').map((id) => id.trim()))
      .refine(
        (ids) => ids.every((id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)),
        { message: 'One or more Product IDs are invalid UUIDs.' }
      )
      .refine((ids) => ids.length >= 2, 'At least 2 products must be compared.')
      .refine((ids) => ids.length <= 4, 'No more than 4 products can be compared.')
      .refine((ids) => new Set(ids).size === ids.length, 'Duplicate Product IDs are not allowed.'),
  }),
});
