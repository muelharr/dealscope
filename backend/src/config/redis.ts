import Redis from 'ioredis';
import { env } from './env';
import logger from '../shared/utils/logger';

declare global {
  // eslint-disable-next-line no-var
  var redis: Redis | undefined;
}

const redis = global.redis || new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 1,
  retryStrategy: () => null,
  enableOfflineQueue: false,
});

redis.on('error', () => {
  // Silent catch when Redis is offline in local dev mode
});

redis.on('connect', () => {
  logger.info('Connected to Redis successfully');
});

if (env.NODE_ENV !== 'production') {
  global.redis = redis;
}

export default redis;
export { redis };
