import request from 'supertest';
import app from '../../../app';
import { HealthService } from '../service';

// Mock ioredis to prevent connection attempts and open handles during routes initialization
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => {
    return {
      on: jest.fn(),
      ping: jest.fn().mockResolvedValue('PONG'),
      quit: jest.fn().mockResolvedValue('OK'),
    };
  });
});

describe('Health Routes', () => {
  let healthSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    healthSpy = jest.spyOn(HealthService.prototype, 'getHealthStatus');
  });

  afterEach(() => {
    healthSpy.mockRestore();
  });

  it('should return 200 operational state if health check passes', async () => {
    healthSpy.mockResolvedValue({
      status: 'UP',
      database: 'CONNECTED',
      cache: 'CONNECTED',
      timestamp: new Date().toISOString(),
    });

    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          status: 'UP',
          database: 'CONNECTED',
          cache: 'CONNECTED',
        }),
      })
    );
  });

  it('should return 503 service unavailable if database/cache goes offline', async () => {
    healthSpy.mockResolvedValue({
      status: 'DOWN',
      database: 'DISCONNECTED',
      cache: 'CONNECTED',
      timestamp: new Date().toISOString(),
    });

    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(503);
    expect(response.body).toEqual(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          code: 'SERVICE_UNAVAILABLE',
        }),
      })
    );
  });
});
