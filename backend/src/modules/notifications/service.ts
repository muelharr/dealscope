import { prisma } from '../../config/prisma';
import { CreateNotificationInput, NotificationDto } from './types';

export class NotificationService {
  /**
   * Fetches user notifications sorted newest first.
   */
  public async getUserNotifications(userId: string): Promise<{ items: NotificationDto[]; unreadCount: number }> {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId, readAt: null },
    });

    const items: NotificationDto[] = notifications.map((n) => ({
      id: n.id,
      userId: n.userId,
      type: n.type,
      title: n.title,
      message: n.message,
      priority: n.priority,
      status: n.status,
      isRead: n.readAt !== null,
      createdAt: n.createdAt.toISOString(),
    }));

    return { items, unreadCount };
  }

  /**
   * Marks a single notification as read.
   */
  public async markAsRead(userId: string, notificationId: string) {
    const existing = await prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!existing) {
      throw new Error('Notification not found.');
    }

    return prisma.notification.update({
      where: { id: notificationId },
      data: { readAt: new Date() },
    });
  }

  /**
   * Marks all notifications as read for a user.
   */
  public async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });
  }

  /**
   * Creates a notification for a user.
   */
  public async createNotification(data: CreateNotificationInput) {
    return prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type || 'PRICE_ALERT',
        title: data.title,
        message: data.message,
        priority: data.priority || 'NORMAL',
        status: 'DELIVERED',
        sentAt: new Date(),
      },
    });
  }
}
