import { z } from 'zod';

export const createAlertSchema = z.object({
  body: z
    .object({
      productId: z.string().uuid('Invalid Product ID format.'),
      targetPrice: z.number().positive('Target price must be positive.').optional(),
      targetDiscountPercentage: z
        .number()
        .min(0, 'Target discount percentage cannot be negative.')
        .max(100, 'Target discount percentage cannot exceed 100%.')
        .optional(),
    })
    .refine(
      (data) => data.targetPrice !== undefined || data.targetDiscountPercentage !== undefined,
      {
        message: 'At least one of targetPrice or targetDiscountPercentage must be provided.',
        path: ['targetPrice'],
      }
    ),
});

export const updateAlertSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid Alert ID format.'),
  }),
  body: z
    .object({
      targetPrice: z.number().positive('Target price must be positive.').nullable().optional(),
      targetDiscountPercentage: z
        .number()
        .min(0, 'Target discount percentage cannot be negative.')
        .max(100, 'Target discount percentage cannot exceed 100%.')
        .nullable()
        .optional(),
      isEnabled: z.boolean().optional(),
    })
    .refine(
      (data) => {
        if (data.targetPrice === null && data.targetDiscountPercentage === null) {
          return false;
        }
        return true;
      },
      {
        message: 'At least one of targetPrice or targetDiscountPercentage must be active (not null).',
        path: ['targetPrice'],
      }
    ),
});

export const alertIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid Alert ID format.'),
  }),
});
