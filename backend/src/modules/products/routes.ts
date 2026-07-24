import { Router } from 'express';
import { ProductController } from './controller';
import { validate } from '../../middleware/validation.middleware';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { createProductSchema, updateProductSchema, productQuerySchema } from './schemas';

const productsRouter = Router();
const controller = new ProductController();

/**
 * @openapi
 * /api/v1/products:
 *   get:
 *     summary: Retrieve products catalog
 *     description: Returns a paginated list of products matching search, brand, category, and price range filters. Excludes soft-deleted products.
 *     tags:
 *       - Products
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
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, dealScore, rating, createdAt]
 *           default: createdAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *       - in: query
 *         name: priceMin
 *         schema:
 *           type: number
 *       - in: query
 *         name: priceMax
 *         schema:
 *           type: number
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Products list successfully retrieved.
 *       400:
 *         description: Validation failed or invalid query parameter type/value.
 */
productsRouter.get('/', validate(productQuerySchema), controller.listProducts);

/**
 * @openapi
 * /api/v1/products/{id}:
 *   get:
 *     summary: Retrieve single Product details
 *     description: Returns detailed product properties, related category, brand, and live marketplace offers. Excludes soft-deleted products.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Product details successfully retrieved.
 *       404:
 *         description: Product not found or soft-deleted.
 */
productsRouter.get('/:id', controller.getProduct);

/**
 * @openapi
 * /api/v1/products:
 *   post:
 *     summary: Create a new Product (Admin Only)
 *     description: Saves a new product entry, automatically creating a unique URL-friendly slug.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - categoryId
 *               - brandId
 *               - description
 *               - images
 *               - dealScore
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 15 Pro Max
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *               brandId:
 *                 type: string
 *                 format: uuid
 *               description:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5"]
 *               dealScore:
 *                 type: integer
 *                 example: 95
 *               specifications:
 *                 type: object
 *                 example: { "Storage": "256GB" }
 *     responses:
 *       201:
 *         description: Product created successfully.
 *       400:
 *         description: Invalid request parameters or constraint validations.
 *       401:
 *         description: User session not authenticated.
 *       403:
 *         description: User role lack admin privileges.
 */
productsRouter.post('/', authenticate, authorize('admin'), validate(createProductSchema), controller.createProduct);

/**
 * @openapi
 * /api/v1/products/{id}:
 *   put:
 *     summary: Update an active Product (Admin Only)
 *     description: Partially updates product fields. Reject updates on soft-deleted products.
 *     tags:
 *       - Products
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               dealScore:
 *                 type: integer
 *               specifications:
 *                 type: object
 *     responses:
 *       200:
 *         description: Product updated successfully.
 *       400:
 *         description: Invalid update schema constraints.
 *       401:
 *         description: User session not authenticated.
 *       403:
 *         description: User lacks admin role privileges.
 *       404:
 *         description: Product not found or soft-deleted.
 */
productsRouter.put('/:id', authenticate, authorize('admin'), validate(updateProductSchema), controller.updateProduct);

/**
 * @openapi
 * /api/v1/products/{id}:
 *   delete:
 *     summary: Soft Delete a Product (Admin Only)
 *     description: Sets the deletedAt timestamp on the product record, filtering it from default queries.
 *     tags:
 *       - Products
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
 *         description: Product successfully soft-deleted.
 *       401:
 *         description: User session not authenticated.
 *       403:
 *         description: User lacks admin privileges.
 *       404:
 *         description: Product not found or already deleted.
 */
productsRouter.delete('/:id', authenticate, authorize('admin'), controller.deleteProduct);

export default productsRouter;
export { productsRouter };
