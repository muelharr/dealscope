import { Router } from 'express';
import { ComparisonController } from './controller';
import { validate } from '../../middleware/validation.middleware';
import { comparisonQuerySchema } from './schemas';

const router = Router();
const controller = new ComparisonController();

/**
 * @swagger
 * tags:
 *   name: Comparison
 *   description: Product comparison endpoints
 */

/**
 * @swagger
 * /api/v1/comparison:
 *   get:
 *     summary: Compare 2 to 4 products side-by-side
 *     tags: [Comparison]
 *     parameters:
 *       - in: query
 *         name: productIds
 *         schema:
 *           type: string
 *         required: true
 *         description: A comma-separated list of 2 to 4 product UUIDs.
 *         example: "8114f2e5-1921-4f2e-5192-13bc58d4a6f8,2e58114f-4f2e-1921-bc58-d4a6f8135192"
 *     responses:
 *       "200":
 *         description: "Successful comparison response."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ComparisonResponse'
 *       "400":
 *         description: "Invalid input (e.g., invalid UUID, incorrect count of IDs, duplicate IDs)."
 *       "404":
 *         description: "One or more products not found."
 */
router.get('/', validate(comparisonQuerySchema), controller.compareProducts);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     ComparisonProductSummary:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         brand:
 *           type: string
 *         category:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         dealScore:
 *           type: number
 *           format: float
 *         rating:
 *           type: number
 *           format: float
 *         reviewCount:
 *           type: integer
 *
 *     ComparisonBestOffer:
 *       type: object
 *       properties:
 *         marketplace:
 *           type: string
 *         price:
 *           type: number
 *           format: float
 *         originalPrice:
 *           type: number
 *           format: float
 *         shippingCost:
 *           type: number
 *           format: float
 *         effectivePrice:
 *           type: number
 *           format: float
 *         discountPercentage:
 *           type: number
 *           format: float
 *         officialStore:
 *           type: boolean
 *         stockStatus:
 *           $ref: '#/components/schemas/StockStatus'
 *
 *     ComparisonProduct:
 *       type: object
 *       properties:
 *         productSummary:
 *           $ref: '#/components/schemas/ComparisonProductSummary'
 *         bestOffer:
 *           $ref: '#/components/schemas/ComparisonBestOffer'
 *         lowestHistoricalPrice:
 *           type: number
 *           format: float
 *           nullable: true
 *         highestHistoricalPrice:
 *           type: number
 *           format: float
 *           nullable: true
 *         trendIndicator:
 *           type: string
 *           enum: [up, down, flat]
 *         marketplaceCount:
 *           type: integer
 *
 *     ComparisonResponse:
 *       type: object
 *       properties:
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ComparisonProduct'
 *         summary:
 *           type: object
 *           properties:
 *             cheapestProductId:
 *               type: string
 *               format: uuid
 *               nullable: true
 *             highestDiscountProductId:
 *               type: string
 *               format: uuid
 *               nullable: true
 *             highestDealScoreProductId:
 *               type: string
 *               format: uuid
 *               nullable: true
 *             bestRatedProductId:
 *               type: string
 *               format: uuid
 *               nullable: true
 *         meta:
 *           type: object
 *           properties:
 *             comparisonCount:
 *               type: integer
 */
