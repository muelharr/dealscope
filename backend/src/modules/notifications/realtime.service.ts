import { io } from '../../config/socket';
import logger from '../../shared/utils/logger';

export class NotificationRealtimeService {
  private static instance: NotificationRealtimeService;
  private userSockets: Map<string, Set<string>> = new Map();

  private constructor() {
    this.init();
  }

  public static getInstance(): NotificationRealtimeService {
    if (!NotificationRealtimeService.instance) {
      NotificationRealtimeService.instance = new NotificationRealtimeService();
    }
    return NotificationRealtimeService.instance;
  }

  private init() {
    // We need to wait for io to be initialized. 
    // Since initSocket is called in server.ts, we can set up listeners.
    // However, we can also use the io object directly in methods.
  }

  public handleConnection(userId: string, socketId: string) {
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)?.add(socketId);
    logger.debug(`Mapped socket ${socketId} to user ${userId}`);
  }

  public handleDisconnect(userId: string, socketId: string) {
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      sockets.delete(socketId);
      if (sockets.size === 0) {
        this.userSockets.delete(userId);
      }
    }
    logger.debug(`Unmapped socket ${socketId} from user ${userId}`);
  }

  public sendToUser(userId: string, event: string, data: unknown) {
    if (!io) {
      logger.error('Socket.io not initialized');
      return;
    }
    
    // We can use rooms instead of manual mapping if we want
    // But the prompt asked for Map<userId, Set<socketId>>
    const sockets = this.userSockets.get(userId);
    if (sockets && sockets.size > 0) {
      sockets.forEach((socketId) => {
        io.of('/notifications').to(socketId).emit(event, data);
      });
      logger.info(`Sent ${event} to user ${userId} (${sockets.size} sockets)`);
    } else {
      logger.debug(`User ${userId} not connected via WebSocket. Notification queued in DB only.`);
    }
  }

  public broadcastToAll(event: string, data: unknown) {
    if (!io) return;
    io.of('/notifications').emit(event, data);
    logger.info(`Broadcasted ${event} to all connected users`);
  }
}

export const notificationRealtimeService = NotificationRealtimeService.getInstance();
