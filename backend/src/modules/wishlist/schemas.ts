import { z } from 'zod';

export const addWishlistSchema = z.object({
  body: z.object({
    productId: z.string().uuid('Invalid Product ID format.'),
    targetPrice: z
      .number()
      .positive('Target price must be greater than zero.')
      .optional(),
  }),
});

export const removeWishlistSchema = z.object({
  params: z.object({
    productId: z.string().uuid('Invalid Product ID format.'),
  }),
});
