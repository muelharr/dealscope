import { Request, Response } from 'express';
import { UserDashboardService } from './services/userDashboard.service';
import { AdminDashboardService } from './services/adminDashboard.service';
import { sendSuccess, sendError } from '../../shared/utils/response';
import { prisma } from '../../config/prisma';

const dashboardService = new UserDashboardService();
const adminDashboardService = new AdminDashboardService();

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

  public getAdminDashboard = async (_req: Request, res: Response): Promise<void> => {
    try {
      const data = await adminDashboardService.getSummary();
      sendSuccess(res, data, 200);
    } catch (err) {
      sendError(res, 500, 'INTERNAL_SERVER_ERROR', err instanceof Error ? err.message : String(err));
    }
  };

  public getUserActivities = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const data = await prisma.activityLog.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });
      sendSuccess(res, data, 200);
    } catch (err) {
      sendError(res, 500, 'INTERNAL_SERVER_ERROR', err instanceof Error ? err.message : String(err));
    }
  };

  public getUserSearchHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const data = await prisma.searchHistory.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });
      sendSuccess(res, data, 200);
    } catch (err) {
      sendError(res, 500, 'INTERNAL_SERVER_ERROR', err instanceof Error ? err.message : String(err));
    }
  };
}
