import { Router } from 'express';
import { OfferController } from './controller';
import { validate } from '../../middleware/validation.middleware';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { createOfferSchema, updateOfferSchema, offerQuerySchema } from './schemas';

const offersRouter = Router();
const controller = new OfferController();

/**
 * @openapi
 * /api/v1/offers:
 *   get:
 *     summary: List Marketplace Offers
 *     description: Returns a paginated list of active offers. Excludes inactive offers by default.
 *     tags:
 *       - Offers
 *     parameters:
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
 *         name: marketplace
 *         schema:
 *           type: string
 *       - in: query
 *         name: minimumPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maximumPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: officialStore
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: stockStatus
 *         schema:
 *           type: string
 *           enum: [IN_STOCK, OUT_OF_STOCK, PREORDER, BACKORDER, DISCONTINUED]
 *       - in: query
 *         name: minimumRating
 *         schema:
 *           type: number
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [price, marketplaceRating, createdAt]
 *           default: createdAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Successfully retrieved list of offers.
 *       400:
 *         description: Validation failed or invalid parameters.
 */
offersRouter.get('/', validate(offerQuerySchema), controller.listOffers);

/**
 * @openapi
 * /api/v1/offers/{id}:
 *   get:
 *     summary: Retrieve Marketplace Offer
 *     description: Returns details of a single active marketplace offer.
 *     tags:
 *       - Offers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Offer details successfully retrieved.
 *       404:
 *         description: Offer not found or is inactive.
 */
offersRouter.get('/:id', controller.getOffer);

/**
 * @openapi
 * /api/v1/offers:
 *   post:
 *     summary: Create Marketplace Offer (Admin Only)
 *     description: Saves a new marketplace offer, or reactivates and updates an existing inactive offer.
 *     tags:
 *       - Offers
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
 *               - marketplaceId
 *               - productUrl
 *               - price
 *               - originalPrice
 *               - currency
 *               - stockStatus
 *             properties:
 *               productId:
 *                 type: string
 *                 format: uuid
 *               marketplaceId:
 *                 type: string
 *                 format: uuid
 *               sellerId:
 *                 type: string
 *               productUrl:
 *                 type: string
 *               price:
 *                 type: number
 *               originalPrice:
 *                 type: number
 *               currency:
 *                 type: string
 *                 enum: [IDR, USD, EUR, GBP]
 *               stockStatus:
 *                 type: string
 *                 enum: [IN_STOCK, OUT_OF_STOCK, PREORDER, BACKORDER, DISCONTINUED]
 *               shippingCost:
 *                 type: number
 *               shippingEstimate:
 *                 type: string
 *               marketplaceRating:
 *                 type: number
 *               reviewCount:
 *                 type: integer
 *               isOfficialStore:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Offer successfully created or reactivated.
 *       400:
 *         description: Validation failed or active offer combination already exists.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
offersRouter.post('/', authenticate, authorize('admin'), validate(createOfferSchema), controller.createOffer);

/**
 * @openapi
 * /api/v1/offers/{id}:
 *   put:
 *     summary: Update Marketplace Offer (Admin Only)
 *     description: Updates mutable details of an active marketplace offer.
 *     tags:
 *       - Offers
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
 *               sellerId:
 *                 type: string
 *               productUrl:
 *                 type: string
 *               price:
 *                 type: number
 *               originalPrice:
 *                 type: number
 *               currency:
 *                 type: string
 *                 enum: [IDR, USD, EUR, GBP]
 *               stockStatus:
 *                 type: string
 *                 enum: [IN_STOCK, OUT_OF_STOCK, PREORDER, BACKORDER, DISCONTINUED]
 *               shippingCost:
 *                 type: number
 *               shippingEstimate:
 *                 type: string
 *               marketplaceRating:
 *                 type: number
 *               reviewCount:
 *                 type: integer
 *               isOfficialStore:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Offer updated successfully.
 *       400:
 *         description: Validation failed or conflict.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Offer not found or is inactive.
 */
offersRouter.put('/:id', authenticate, authorize('admin'), validate(updateOfferSchema), controller.updateOffer);

/**
 * @openapi
 * /api/v1/offers/{id}:
 *   delete:
 *     summary: Deactivate Marketplace Offer (Admin Only)
 *     description: Sets the isActive flag to false on the offer.
 *     tags:
 *       - Offers
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
 *         description: Offer successfully deactivated.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Offer not found or already inactive.
 */
offersRouter.delete('/:id', authenticate, authorize('admin'), controller.deleteOffer);

export default offersRouter;
export { offersRouter };
