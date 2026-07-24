import { z } from 'zod';

export const markNotificationReadSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid Notification ID format.'),
  }),
});
