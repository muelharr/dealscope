import { Request, Response } from 'express';
import { HealthService } from './service';
import { sendSuccess, sendError } from '../../shared/utils/response';

export class HealthController {
  private healthService: HealthService;

  constructor() {
    this.healthService = new HealthService();
  }

  /**
   * Endpoint handler to return application and dependency health status.
   */
  public checkHealth = async (_req: Request, res: Response): Promise<void> => {
    try {
      const status = await this.healthService.getHealthStatus();
      if (status.status === 'UP') {
        sendSuccess(res, status, 200);
      } else {
        sendError(
          res,
          503,
          'SERVICE_UNAVAILABLE',
          'One or more critical dependencies are offline.',
          [
            { field: 'database', message: status.database },
            { field: 'cache', message: status.cache },
          ]
        );
      }
    } catch (err) {
      sendError(
        res,
        500,
        'INTERNAL_SERVER_ERROR',
        err instanceof Error ? err.message : String(err)
      );
    }
  };
}
