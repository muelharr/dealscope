import { z } from 'zod';

// No request body or query params validation required for health check
export const healthCheckQuerySchema = z.object({});
