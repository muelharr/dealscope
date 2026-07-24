import { Router } from 'express';
import { NotificationController } from './controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import { markNotificationReadSchema } from './schemas';

const notificationRouter = Router();
const controller = new NotificationController();

/**
 * @openapi
 * /api/v1/notifications:
 *   get:
 *     summary: Retrieve User Notifications
 *     description: Returns in-app notifications for the authenticated user and unread count.
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications list.
 */
notificationRouter.get('/', authenticate, controller.getNotifications);

/**
 * @openapi
 * /api/v1/notifications/{id}/read:
 *   patch:
 *     summary: Mark Notification as Read
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notification marked as read.
 */
notificationRouter.patch('/:id/read', authenticate, validate(markNotificationReadSchema), controller.markAsRead);

/**
 * @openapi
 * /api/v1/notifications/read-all:
 *   patch:
 *     summary: Mark All Notifications as Read
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read.
 */
notificationRouter.patch('/read-all', authenticate, controller.markAllAsRead);

export default notificationRouter;
export { notificationRouter };
