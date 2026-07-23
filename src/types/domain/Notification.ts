export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum NotificationType {
  PRICE_ALERT = 'price_alert',
  NEW_OFFER = 'new_offer',
  SYSTEM_UPDATE = 'system_update',
  WISHLIST = 'wishlist',
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  read: boolean;
  createdAt: string;
  link?: string;
}
