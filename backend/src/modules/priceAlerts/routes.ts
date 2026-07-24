import { Router } from 'express';
import { PriceAlertController } from './controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import {
  createAlertSchema,
  updateAlertSchema,
  alertIdParamSchema,
} from './schemas';

const priceAlertsRouter = Router();
const controller = new PriceAlertController();

/**
 * @openapi
 * /api/v1/price-alerts:
 *   get:
 *     summary: List User Price Alerts
 *     description: Retrieves all active price alert subscriptions for the authenticated user, complete with product summary and current pricing status.
 *     tags:
 *       - Price Alerts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user's price alerts.
 *       401:
 *         description: Unauthorized. Access token is missing or invalid.
 *       500:
 *         description: Internal Server Error.
 */
priceAlertsRouter.get('/', authenticate, controller.listAlerts);

/**
 * @openapi
 * /api/v1/price-alerts:
 *   post:
 *     summary: Create Price Alert
 *     description: Creates a new price alert subscription for a product. Requires at least one target criterion (price or discount percentage).
 *     tags:
 *       - Price Alerts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *                 format: uuid
 *               targetPrice:
 *                 type: number
 *               targetDiscountPercentage:
 *                 type: number
 *     responses:
 *       201:
 *         description: Price alert created successfully.
 *       400:
 *         description: Bad Request. Missing parameters or invalid target combination.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Product not found or soft-deleted.
 *       409:
 *         description: Conflict. Alert already exists for this product.
 *       500:
 *         description: Internal Server Error.
 */
priceAlertsRouter.post(
  '/',
  authenticate,
  validate(createAlertSchema),
  controller.createAlert
);

/**
 * @openapi
 * /api/v1/price-alerts/{id}:
 *   put:
 *     summary: Update Price Alert Criteria
 *     description: Updates the target price, target discount, and/or enabled state for an existing price alert.
 *     tags:
 *       - Price Alerts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               targetPrice:
 *                 type: number
 *                 nullable: true
 *               targetDiscountPercentage:
 *                 type: number
 *                 nullable: true
 *               isEnabled:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Price alert updated successfully.
 *       400:
 *         description: Bad Request. Invalid criteria provided.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Price alert not found or product is soft-deleted.
 *       500:
 *         description: Internal Server Error.
 */
priceAlertsRouter.put(
  '/:id',
  authenticate,
  validate(updateAlertSchema),
  controller.updateAlert
);

/**
 * @openapi
 * /api/v1/price-alerts/{id}/enable:
 *   patch:
 *     summary: Toggle Price Alert Status
 *     description: Enables or disables an existing price alert.
 *     tags:
 *       - Price Alerts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isEnabled
 *             properties:
 *               isEnabled:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Price alert toggled successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Price alert not found or product is soft-deleted.
 *       500:
 *         description: Internal Server Error.
 */
priceAlertsRouter.patch(
  '/:id/enable',
  authenticate,
  validate(alertIdParamSchema),
  controller.toggleAlert
);

/**
 * @openapi
 * /api/v1/price-alerts/{id}:
 *   delete:
 *     summary: Delete Price Alert
 *     description: Deletes a price alert subscription.
 *     tags:
 *       - Price Alerts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Price alert deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Price alert not found.
 *       500:
 *         description: Internal Server Error.
 */
priceAlertsRouter.delete(
  '/:id',
  authenticate,
  validate(alertIdParamSchema),
  controller.deleteAlert
);

export { priceAlertsRouter };
export default priceAlertsRouter;
