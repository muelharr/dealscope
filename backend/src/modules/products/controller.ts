import { Request, Response } from 'express';
import { ProductService } from './service';
import { sendSuccess, sendError } from '../../shared/utils/response';
import { buildPaginationMeta } from '../../shared/utils/pagination';
import { ProductResponse, ProductWithRelations, ProductQueryFilters } from './types';

const productService = new ProductService();

/**
 * Maps a database Product record to the canonical ProductResponse DTO format.
 */
function mapProductToResponse(product: ProductWithRelations): ProductResponse {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    images: product.images,
    dealScore: product.dealScore,
    rating: typeof product.rating?.toNumber === 'function' ? product.rating.toNumber() : Number(product.rating),
    reviewCount: product.reviewCount,
    specifications: product.specifications as Record<string, string | number | boolean>,
    category: {
      id: product.category.id,
      name: product.category.name,
      slug: product.category.slug,
    },
    brand: {
      id: product.brand.id,
      name: product.brand.name,
      slug: product.brand.slug,
    },
    offers: product.marketplaceOffers?.map((offer) => ({
      id: offer.id,
      marketplace: {
        id: offer.marketplace.id,
        name: offer.marketplace.name,
        slug: offer.marketplace.slug,
      },
      price: typeof offer.price?.toNumber === 'function' ? offer.price.toNumber() : Number(offer.price),
      url: offer.productUrl,
      inStock: offer.stockStatus === 'IN_STOCK',
      availabilityText: offer.stockStatus === 'IN_STOCK' ? 'In Stock' : 'Out of Stock',
      availabilityType: offer.stockStatus === 'IN_STOCK' ? 'positive' : 'negative',
    })),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export class ProductController {
  /**
   * GET /products
   * Retrieves paginated list of products.
   */
  public listProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const filters = req.query as unknown as ProductQueryFilters;
      const { items, total } = await productService.getProducts(filters);
      
      const meta = buildPaginationMeta(total, filters.limit, (filters.page - 1) * filters.limit);
      const data = items.map((p) => mapProductToResponse(p as unknown as ProductWithRelations));

      sendSuccess(res, data, 200, meta);
    } catch (err) {
      sendError(
        res,
        500,
        'INTERNAL_SERVER_ERROR',
        err instanceof Error ? err.message : String(err)
      );
    }
  };

  /**
   * GET /products/:id
   * Retrieves single product by ID.
   */
  public getProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);

      if (!product) {
        sendError(res, 404, 'NOT_FOUND', 'Product not found or has been deleted.');
        return;
      }

      sendSuccess(res, mapProductToResponse(product));
    } catch (err) {
      sendError(
        res,
        500,
        'INTERNAL_SERVER_ERROR',
        err instanceof Error ? err.message : String(err)
      );
    }
  };

  /**
   * POST /products
   * Admin only. Creates new product.
   */
  public createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await productService.createProduct(req.body);
      sendSuccess(res, mapProductToResponse(product), 201);
    } catch (err) {
      sendError(
        res,
        500,
        'INTERNAL_SERVER_ERROR',
        err instanceof Error ? err.message : String(err)
      );
    }
  };

  /**
   * PUT /products/:id
   * Admin only. Updates product.
   */
  public updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const product = await productService.updateProduct(id, req.body);
      sendSuccess(res, mapProductToResponse(product), 200);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('not found') || msg.includes('deleted')) {
        sendError(res, 404, 'NOT_FOUND', msg);
        return;
      }
      sendError(res, 500, 'INTERNAL_SERVER_ERROR', msg);
    }
  };

  /**
   * DELETE /products/:id
   * Admin only. Soft deletes product.
   */
  public deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await productService.deleteProduct(id);
      sendSuccess(res, { message: 'Product successfully deleted.' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('not found') || msg.includes('deleted')) {
        sendError(res, 404, 'NOT_FOUND', msg);
        return;
      }
      sendError(res, 500, 'INTERNAL_SERVER_ERROR', msg);
    }
  };
}
