import { Router } from 'express';
import { WishlistController } from './controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import { addWishlistSchema, removeWishlistSchema } from './schemas';

const wishlistRouter = Router();
const controller = new WishlistController();

/**
 * @openapi
 * /api/v1/wishlist:
 *   get:
 *     summary: Retrieve User Wishlist
 *     description: Returns saved products for the authenticated user with live offer details and price drop badges.
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist items retrieved successfully.
 *       401:
 *         description: Unauthorized.
 */
wishlistRouter.get('/', authenticate, controller.getWishlist);

/**
 * @openapi
 * /api/v1/wishlist:
 *   post:
 *     summary: Add Product to Wishlist
 *     description: Bookmarks a product for the authenticated user.
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Product added to wishlist.
 *       400:
 *         description: Bad request.
 */
wishlistRouter.post('/', authenticate, validate(addWishlistSchema), controller.addToWishlist);

/**
 * @openapi
 * /api/v1/wishlist/{productId}:
 *   delete:
 *     summary: Remove Product from Wishlist
 *     description: Unbookmarks a product for the authenticated user.
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product removed from wishlist.
 *       404:
 *         description: Wishlist item not found.
 */
wishlistRouter.delete('/:productId', authenticate, validate(removeWishlistSchema), controller.removeFromWishlist);

export default wishlistRouter;
export { wishlistRouter };
