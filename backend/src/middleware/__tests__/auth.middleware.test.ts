import { Request, Response } from 'express';
import { authenticate, authorize } from '../auth.middleware';
import { AuthService } from '../../modules/auth/service';

// Hoisted mock to stub the class structure
jest.mock('../../modules/auth/service');

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockImplementation(() => mockResponse);
    nextFunction = jest.fn();
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };
    mockRequest = {
      headers: {},
    };
    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    it('should return 401 if Authorization header is missing', () => {
      authenticate(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({ code: 'UNAUTHORIZED' }),
        })
      );
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 401 if token verification throws', () => {
      mockRequest.headers = { authorization: 'Bearer invalidtoken' };
      
      // Configure the automatically mocked prototype method
      (AuthService.prototype.verifyAccessToken as jest.Mock).mockImplementation(() => {
        throw new Error('Verification failed');
      });

      authenticate(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({ code: 'UNAUTHORIZED' }),
        })
      );
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should set req.user and call next() on success', () => {
      mockRequest.headers = { authorization: 'Bearer validtoken' };
      const mockUser = { sub: 'u1', userId: 'u1', email: 'u@d.com', role: 'user', plan: 'FREE', sessionId: 's1' };
      
      // Configure prototype mock return value
      (AuthService.prototype.verifyAccessToken as jest.Mock).mockReturnValue(mockUser);

      authenticate(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockRequest.user).toEqual(mockUser);
      expect(nextFunction).toHaveBeenCalledWith();
    });
  });

  describe('authorize', () => {
    it('should return 401 if req.user is undefined', () => {
      const middleware = authorize('admin');
      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({ code: 'UNAUTHORIZED' }),
        })
      );
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 403 if user role is not allowed', () => {
      mockRequest.user = { sub: 'u1', userId: 'u1', email: 'u@d.com', role: 'user', plan: 'FREE', sessionId: 's1' };
      const middleware = authorize('admin');
      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(statusMock).toHaveBeenCalledWith(403);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({ code: 'FORBIDDEN' }),
        })
      );
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should call next() if user role is allowed', () => {
      mockRequest.user = { sub: 'u1', userId: 'u1', email: 'u@d.com', role: 'admin', plan: 'FREE', sessionId: 's1' };
      const middleware = authorize('admin', 'moderator');
      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledWith();
    });
  });
});
