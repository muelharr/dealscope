import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { env } from './env';
import logger from '../shared/utils/logger';
import { AuthService } from '../modules/auth/service';
import { notificationRealtimeService } from '../modules/notifications/realtime.service';

const authService = new AuthService();

export let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: env.ALLOWED_ORIGINS.split(','),
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  const notificationNamespace = io.of('/notifications');

  notificationNamespace.use(async (socket: Socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization;
      
      if (!token) {
        return next(new Error('Authentication error: Token missing'));
      }

      const bearerToken = token.startsWith('Bearer ') ? token.slice(7) : token;
      const claims = authService.verifyAccessToken(bearerToken);
      
      if (!claims || !claims.sub) {
        return next(new Error('Authentication error: Invalid token'));
      }

      socket.data.userId = claims.sub;
      next();
    } catch (err) {
      logger.error('Socket authentication error:', err);
      next(new Error('Authentication error'));
    }
  });

  notificationNamespace.on('connection', (socket: Socket) => {
    const userId = socket.data.userId;
    logger.info(`User ${userId} connected to notifications namespace (Socket: ${socket.id})`);
    
    notificationRealtimeService.handleConnection(userId, socket.id);

    socket.on('disconnect', (reason) => {
      logger.info(`User ${userId} disconnected from notifications (Socket: ${socket.id}). Reason: ${reason}`);
      notificationRealtimeService.handleDisconnect(userId, socket.id);
    });
  });

  return io;
};
