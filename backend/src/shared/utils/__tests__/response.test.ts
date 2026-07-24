import { Response } from 'express';
import { sendSuccess, sendError } from '../response';

describe('Response Helpers', () => {
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockImplementation(() => mockResponse);
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };
  });

  describe('sendSuccess', () => {
    it('should format a standard success envelope with a 200 status', () => {
      const data = { items: [1, 2] };
      sendSuccess(mockResponse as Response, data);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data,
          meta: expect.objectContaining({
            timestamp: expect.any(String),
            version: 'v1',
          }),
        })
      );
    });

    it('should append pagination metadata when provided', () => {
      const data = { items: [] };
      const pagination = {
        total: 100,
        count: 10,
        perPage: 10,
        currentPage: 3,
        totalPages: 10,
      };
      
      sendSuccess(mockResponse as Response, data, 201, pagination);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data,
          meta: expect.objectContaining({
            timestamp: expect.any(String),
            version: 'v1',
            pagination,
          }),
        })
      );
    });
  });

  describe('sendError', () => {
    it('should format a standard error envelope', () => {
      const details = [{ field: 'username', message: 'Required' }];
      sendError(
        mockResponse as Response,
        400,
        'BAD_REQUEST',
        'Input check failed',
        details
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: 'Input check failed',
            status: 400,
            details,
          },
          meta: expect.objectContaining({
            timestamp: expect.any(String),
            version: 'v1',
          }),
        })
      );
    });
  });
});
