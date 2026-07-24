import { Router } from 'express';
import { HealthController } from './controller';

const healthRouter = Router();
const controller = new HealthController();

/**
 * @openapi
 * /api/v1/health:
 *   get:
 *     summary: Check system health status
 *     description: Probes connection states for the relational database (Postgres) and cache (Redis).
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: System operational.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: UP
 *                     database:
 *                       type: string
 *                       example: CONNECTED
 *                     cache:
 *                       type: string
 *                       example: CONNECTED
 *                     timestamp:
 *                       type: string
 *                       example: 2026-07-24T10:24:00.000Z
 *                 timestamp:
 *                   type: string
 *                   example: 2026-07-24T10:24:00.000Z
 *       530:
 *         description: Database or cache integration offline.
 */
healthRouter.get('/', controller.checkHealth);

export default healthRouter;
export { healthRouter };
