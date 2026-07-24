import { z } from 'zod';

export const DashboardTimeRangeSchema = z.object({
  range: z.enum(['last7days', 'last30days', 'last90days', 'custom']).optional().default('last30days'),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
}).refine(
  (data) => {
    if (data.range === 'custom') {
      return data.from && data.to;
    }
    return true;
  },
  {
    message: 'Custom range requires both "from" and "to" dates',
    path: ['range'],
  }
);

export type DashboardTimeRangeInput = z.infer<typeof DashboardTimeRangeSchema>;

export interface NormalizedTimeRange {
  from: Date;
  to: Date;
}

export function normalizeTimeRange(input: DashboardTimeRangeInput): NormalizedTimeRange {
  const now = new Date();
  
  if (input.range === 'custom' && input.from && input.to) {
    return {
      from: new Date(input.from),
      to: new Date(input.to),
    };
  }

  const days = input.range === 'last7days' ? 7 : input.range === 'last90days' ? 90 : 30;
  
  return {
    from: new Date(now.getTime() - days * 24 * 60 * 60 * 1000),
    to: now,
  };
}

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export type PaginationInput = z.infer<typeof PaginationSchema>;
