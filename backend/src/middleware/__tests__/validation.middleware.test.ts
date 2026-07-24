import { Request, Response } from 'express';
import { z } from 'zod';
import { validate } from '../validation.middleware';

describe('Validation Middleware', () => {
  const schema = z.object({
    body: z.object({
      username: z.string().min(3),
    }),
  });

  it('should call next() without arguments if validation passes', async () => {
    const middleware = validate(schema);
    const req = {
      body: { username: 'testuser' },
      query: {},
      params: {},
    } as unknown as Request;
    const res = {} as Response;
    const next = jest.fn();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.body.username).toBe('testuser');
  });

  it('should pass validation errors to next(error) if validation fails', async () => {
    const middleware = validate(schema);
    const req = {
      body: { username: 'tu' }, // fails min(3)
      query: {},
      params: {},
    } as unknown as Request;
    const res = {} as Response;
    const next = jest.fn();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
