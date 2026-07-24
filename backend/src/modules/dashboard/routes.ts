import { Router } from 'express';
import { DashboardController } from './controller';
import { authenticate } from '../../middleware/auth.middleware';

const dashboardRouter = Router();
const controller = new DashboardController();

/**
 * @openapi
 * /api/v1/dashboard:
 *   get:
 *     summary: Retrieve User Dashboard Summary
 *     description: Returns consolidated wishlist counts, active price alert metrics, and recent notification feeds.
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User dashboard overview retrieved.
 */
dashboardRouter.get('/', authenticate, controller.getUserDashboard);

export default dashboardRouter;
export { dashboardRouter };
