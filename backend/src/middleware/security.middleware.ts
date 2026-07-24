import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { Router } from 'express';
import { env } from '../config/env';

/**
 * Configure Helmet security headers, CORS origin allowance, and payload compression.
 */
export function configureSecurityMiddlewares(router: Router): void {
  // CORS configuration
  router.use(
    cors({
      origin: env.ALLOWED_ORIGINS.split(','),
      credentials: true,
    })
  );

  // Helmet HTTP security headers
  router.use(helmet());

  // Gzip compression
  router.use(compression());
}
