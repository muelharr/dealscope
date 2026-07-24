import { Request, Response } from 'express';
import { NotificationService } from './service';
import { sendSuccess, sendError } from '../../shared/utils/response';

const notificationService = new NotificationService();

export class NotificationController {
  public getNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const data = await notificationService.getUserNotifications(userId);
      sendSuccess(res, data, 200);
    } catch (err) {
      sendError(res, 500, 'INTERNAL_SERVER_ERROR', err instanceof Error ? err.message : String(err));
    }
  };

  public markAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const notificationId = req.params.id;
      await notificationService.markAsRead(userId, notificationId);
      sendSuccess(res, { message: 'Notification marked as read.' }, 200);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      sendError(res, message.includes('not found') ? 404 : 400, 'BAD_REQUEST', message);
    }
  };

  public markAllAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      await notificationService.markAllAsRead(userId);
      sendSuccess(res, { message: 'All notifications marked as read.' }, 200);
    } catch (err) {
      sendError(res, 500, 'INTERNAL_SERVER_ERROR', err instanceof Error ? err.message : String(err));
    }
  };
}
