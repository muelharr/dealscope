import { z } from 'zod';

export const offerHistorySchema = z.object({
  params: z.object({
    offerId: z.string().uuid('Invalid Offer ID format.'),
  }),
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
      from: z
        .string()
        .optional()
        .transform((val) => (val ? new Date(val) : undefined))
        .refine((val) => val === undefined || !isNaN(val.getTime()), 'Invalid "from" date format.'),
      to: z
        .string()
        .optional()
        .transform((val) => (val ? new Date(val) : undefined))
        .refine((val) => val === undefined || !isNaN(val.getTime()), 'Invalid "to" date format.'),
    })
    .refine(
      (data) => {
        if (data.from && data.to) {
          return data.from <= data.to;
        }
        return true;
      },
      {
        message: '"from" date must be less than or equal to "to" date.',
        path: ['from'],
      }
    ),
});

export const productHistoryParamsSchema = z.object({
  params: z.object({
    productId: z.string().uuid('Invalid Product ID format.'),
  }),
});
