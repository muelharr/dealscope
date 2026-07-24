import { Router } from 'express';
import { PriceHistoryController } from './controller';
import { validate } from '../../middleware/validation.middleware';
import { offerHistorySchema, productHistoryParamsSchema } from './schemas';

const historyRouter = Router();
const controller = new PriceHistoryController();

/**
 * @openapi
 * /api/v1/offers/{offerId}/history:
 *   get:
 *     summary: Retrieve Marketplace Offer Price History
 *     description: Returns paginated historical price snapshots for a specific marketplace offer.
 *     tags:
 *       - Price History
 *     parameters:
 *       - in: path
 *         name: offerId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Successfully retrieved history list.
 *       400:
 *         description: Validation failed.
 */
historyRouter.get(
  '/offers/:offerId/history',
  validate(offerHistorySchema),
  controller.getOfferHistory
);

/**
 * @openapi
 * /api/v1/products/{productId}/price-history:
 *   get:
 *     summary: Retrieve Product Price History
 *     description: Returns all historical snapshots for all offers connected to a product, sorted chronologically.
 *     tags:
 *       - Price History
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Successfully retrieved history.
 *       400:
 *         description: Validation failed.
 */
historyRouter.get(
  '/products/:productId/price-history',
  validate(productHistoryParamsSchema),
  controller.getProductHistory
);

/**
 * @openapi
 * /api/v1/products/{productId}/lowest-price:
 *   get:
 *     summary: Retrieve Product Lowest Historical Price
 *     description: Finds the lowest recorded price point ever for a product.
 *     tags:
 *       - Price History
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Lowest price snapshot retrieved.
 *       404:
 *         description: No history found.
 */
historyRouter.get(
  '/products/:productId/lowest-price',
  validate(productHistoryParamsSchema),
  controller.getLowestPrice
);

/**
 * @openapi
 * /api/v1/products/{productId}/highest-price:
 *   get:
 *     summary: Retrieve Product Highest Historical Price
 *     description: Finds the highest recorded price point ever for a product.
 *     tags:
 *       - Price History
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Highest price snapshot retrieved.
 *       404:
 *         description: No history found.
 */
historyRouter.get(
  '/products/:productId/highest-price',
  validate(productHistoryParamsSchema),
  controller.getHighestPrice
);

/**
 * @openapi
 * /api/v1/products/{productId}/price-trend:
 *   get:
 *     summary: Retrieve Product Price Trend Analysis
 *     description: Computes price shift indicators (current cheapest active offer vs previous snapshot).
 *     tags:
 *       - Price History
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Trend analysis retrieved successfully.
 */
historyRouter.get(
  '/products/:productId/price-trend',
  validate(productHistoryParamsSchema),
  controller.getPriceTrend
);

export default historyRouter;
export { historyRouter };
