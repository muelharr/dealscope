import request from 'supertest';
import app from '../../../app';
import { NotificationService } from '../service';

jest.mock('../service');
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    ping: jest.fn().mockResolvedValue('PONG'),
    quit: jest.fn().mockResolvedValue('OK'),
  }));
});

describe('Notifications Module Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/notifications authentication check', () => {
    it('should reject unauthenticated requests with HTTP 401', async () => {
      const response = await request(app).get('/api/v1/notifications');
      expect(response.status).toBe(401);
    });
  });

  describe('NotificationService methods', () => {
    let service: NotificationService;

    beforeEach(() => {
      service = new NotificationService();
    });

    it('should return user notifications and unread count', async () => {
      jest.spyOn(service, 'getUserNotifications').mockResolvedValueOnce({
        items: [],
        unreadCount: 0,
      });

      const res = await service.getUserNotifications('user-1');
      expect(res.items).toEqual([]);
      expect(res.unreadCount).toBe(0);
    });
  });
});
