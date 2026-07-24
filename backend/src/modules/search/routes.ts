import { Router } from 'express';
import { SearchController } from './controller';
import { validate } from '../../middleware/validation.middleware';
import { searchQuerySchema } from './schemas';

const searchRouter = Router();
const controller = new SearchController();

/**
 * @openapi
 * /api/v1/search:
 *   get:
 *     summary: Discover Products and Offers
 *     description: Core discovery endpoint supporting search keywords, filters, custom sortings, best offers details, trends, and pagination.
 *     tags:
 *       - Search
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *       - in: query
 *         name: marketplace
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
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
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [dealScore, newest, price, discount]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
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
 *     responses:
 *       200:
 *         description: Search results retrieved successfully.
 *       400:
 *         description: Validation failed.
 */
searchRouter.get('/', validate(searchQuerySchema), controller.search);

export default searchRouter;
export { searchRouter };
