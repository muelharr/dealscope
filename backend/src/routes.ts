import { Router } from 'express';
import { healthRouter } from './modules/health/routes';
import { authRouter } from './modules/auth/routes';
import { productsRouter } from './modules/products/routes';
import { offersRouter } from './modules/offers/routes';
import { OfferController } from './modules/offers/controller';
import { historyRouter } from './modules/history/routes';

import { priceAlertsRouter } from './modules/priceAlerts/routes';
import comparisonRouter from './modules/comparison/routes';

const apiRouter = Router();
const offerController = new OfferController();

apiRouter.use('/health', healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/products', productsRouter);
apiRouter.use('/offers', offersRouter);
apiRouter.get('/products/:productId/offers', offerController.getProductOffers);
apiRouter.use('/price-alerts', priceAlertsRouter);
apiRouter.use('/comparison', comparisonRouter);
apiRouter.use('/', historyRouter);

export default apiRouter;
export { apiRouter };
