import rateLimit from 'express-rate-limit';
import { env } from '../config/env';
import { sendError } from '../shared/utils/response';

/**
 * Standard API rate limiter middleware to prevent brute force and DDoS attacks.
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.NODE_ENV === 'test' ? 10000 : 100, // Limit each IP to 100 requests per window (increased in testing)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (_req, res) => {
    return sendError(
      res,
      429,
      'TOO_MANY_REQUESTS',
      'Rate limit exceeded. Please try again after 15 minutes.'
    );
  },
});

export default apiRateLimiter;
