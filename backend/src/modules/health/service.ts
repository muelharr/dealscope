import prisma from '../../config/prisma';
import redis from '../../config/redis';
import { HealthStatusResponse } from './types';

export class HealthService {
  /**
   * Evaluates the connectivity of both Prisma Postgres and Redis dependencies.
   */
  public async getHealthStatus(): Promise<HealthStatusResponse> {
    let dbStatus: 'CONNECTED' | 'DISCONNECTED' = 'CONNECTED';
    let cacheStatus: 'CONNECTED' | 'DISCONNECTED' = 'CONNECTED';

    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'DISCONNECTED';
    }

    try {
      await redis.ping();
    } catch {
      cacheStatus = 'DISCONNECTED';
    }

    const overallStatus = dbStatus === 'CONNECTED' && cacheStatus === 'CONNECTED' ? 'UP' : 'DOWN';

    return {
      status: overallStatus,
      database: dbStatus,
      cache: cacheStatus,
      timestamp: new Date().toISOString(),
    };
  }
}
