import express from 'express';
import { configureSecurityMiddlewares } from './middleware/security.middleware';
import { requestIdMiddleware } from './middleware/requestId.middleware';
import { apiRateLimiter } from './middleware/rateLimiter.middleware';
import { errorHandlerMiddleware } from './middleware/error.middleware';
import { configureSwagger } from './config/swagger';
import apiRouter from './routes';

const app = express();

// 1. Request ID assignment
app.use(requestIdMiddleware);

// 2. Global rate limiter
app.use('/api', apiRateLimiter);

// 3. Security (Helmet, CORS, Compression)
configureSecurityMiddlewares(app);

// 4. Request payload parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom cookie parser middleware
app.use((req, _res, next) => {
  const cookieHeader = req.headers.cookie;
  req.cookies = {};
  if (cookieHeader) {
    const cookies = cookieHeader.split(';');
    for (const cookie of cookies) {
      const parts = cookie.split('=');
      if (parts.length >= 2) {
        const name = parts[0].trim();
        const val = parts.slice(1).join('=');
        req.cookies[name] = decodeURIComponent(val);
      }
    }
  }
  next();
});

// Swagger setup
configureSwagger(app);

// 5. Versioned API Routes mount
app.use('/api/v1', apiRouter);

// 6. Global Error Boundary
app.use(errorHandlerMiddleware);

export default app;
export { app };
