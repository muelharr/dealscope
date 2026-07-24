import { Request, Response } from 'express';
import { UserDashboardService } from './services/userDashboard.service';
import { sendSuccess, sendError } from '../../shared/utils/response';

const dashboardService = new UserDashboardService();

export class DashboardController {
  public getUserDashboard = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const data = await dashboardService.getUserDashboard(userId);
      sendSuccess(res, data, 200);
    } catch (err) {
      sendError(res, 500, 'INTERNAL_SERVER_ERROR', err instanceof Error ? err.message : String(err));
    }
  };
}
