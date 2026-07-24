import rateLimit from 'express-rate-limit';
import { env } from '../config/env';
import { sendError } from '../shared/utils/response';

/**
 * Strict rate limiter for auth endpoints (login, register, refresh) to mitigate brute force attacks.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.NODE_ENV === 'test' ? 10000 : 5, // Tight limit of 5 requests (elevated in test suites)
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    return sendError(
      res,
      429,
      'TOO_MANY_REQUESTS',
      'Too many authentication attempts. Please try again after 15 minutes.'
    );
  },
});

export default authRateLimiter;
