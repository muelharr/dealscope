import { Router } from 'express';
import { healthRouter } from './modules/health/routes';
import { authRouter } from './modules/auth/routes';

const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/auth', authRouter);

export default apiRouter;
export { apiRouter };
