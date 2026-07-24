import { Request, Response } from 'express';
import { PriceAlertService } from './service';
import { sendSuccess, sendError } from '../../shared/utils/response';

const priceAlertService = new PriceAlertService();

export class PriceAlertController {
  /**
   * GET /price-alerts
   * Retrieves active price alerts for the authenticated user.
   */
  public listAlerts = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.sub;
      const data = await priceAlertService.listAlerts(userId);
      sendSuccess(res, data, 200);
    } catch (err) {
      sendError(
        res,
        500,
        'INTERNAL_SERVER_ERROR',
        err instanceof Error ? err.message : String(err)
      );
    }
  };

  /**
   * POST /price-alerts
   * Creates a new price alert subscription for the authenticated user.
   */
  public createAlert = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.sub;
      const data = await priceAlertService.createAlert(userId, req.body);
      sendSuccess(res, data, 201);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('not found') || msg.includes('deleted')) {
        sendError(res, 404, 'NOT_FOUND', msg);
        return;
      }
      if (msg.includes('already exists')) {
        sendError(res, 409, 'CONFLICT', msg);
        return;
      }
      if (msg.includes('must be provided')) {
        sendError(res, 400, 'BAD_REQUEST', msg);
        return;
      }
      sendError(res, 500, 'INTERNAL_SERVER_ERROR', msg);
    }
  };

  /**
   * PUT /price-alerts/:id
   * Updates an existing price alert's target values.
   */
  public updateAlert = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.sub;
      const { id } = req.params;
      const data = await priceAlertService.updateAlert(userId, id, req.body);
      sendSuccess(res, data, 200);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('not found') || msg.includes('deleted')) {
        sendError(res, 404, 'NOT_FOUND', msg);
        return;
      }
      if (msg.includes('must be provided')) {
        sendError(res, 400, 'BAD_REQUEST', msg);
        return;
      }
      sendError(res, 500, 'INTERNAL_SERVER_ERROR', msg);
    }
  };

  /**
   * PATCH /price-alerts/:id/enable
   * Enables or disables a price alert subscription.
   */
  public toggleAlert = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.sub;
      const { id } = req.params;
      const { isEnabled } = req.body;

      if (isEnabled === undefined) {
        sendError(res, 400, 'BAD_REQUEST', 'isEnabled field is required.');
        return;
      }

      const data = await priceAlertService.toggleAlert(userId, id, isEnabled);
      sendSuccess(res, data, 200);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('not found') || msg.includes('deleted')) {
        sendError(res, 404, 'NOT_FOUND', msg);
        return;
      }
      sendError(res, 500, 'INTERNAL_SERVER_ERROR', msg);
    }
  };

  /**
   * DELETE /price-alerts/:id
   * Deletes a price alert subscription.
   */
  public deleteAlert = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.sub;
      const { id } = req.params;
      await priceAlertService.deleteAlert(userId, id);
      sendSuccess(res, { message: 'Price alert successfully deleted.' }, 200);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('not found')) {
        sendError(res, 404, 'NOT_FOUND', msg);
        return;
      }
      sendError(res, 500, 'INTERNAL_SERVER_ERROR', msg);
    }
  };
}
