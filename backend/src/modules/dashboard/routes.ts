import { Router } from 'express';
import { DashboardController } from './controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';

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

/**
 * @openapi
 * /api/v1/dashboard/admin:
 *   get:
 *     summary: Retrieve Admin Dashboard Summary
 *     description: Returns overall system statistics like total users, products, marketplaces, etc.
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin dashboard overview retrieved.
 */
dashboardRouter.get('/admin', authenticate, authorize('admin'), controller.getAdminDashboard);

export default dashboardRouter;
export { dashboardRouter };
