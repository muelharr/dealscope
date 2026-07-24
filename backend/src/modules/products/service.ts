import { Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { CreateProductRequest, UpdateProductRequest, ProductQueryFilters } from './types';

export class ProductService {
  /**
   * Generates a normalized unique slug for a product name.
   */
  public async generateUniqueSlug(name: string): Promise<string> {
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    let slug = baseSlug || 'product';
    let count = 0;

    let isUnique = false;
    while (!isUnique) {
      const existing = await prisma.product.findUnique({
        where: { slug },
      });
      if (!existing) {
        isUnique = true;
      } else {
        count++;
        slug = `${baseSlug}-${count}`;
      }
    }

    return slug;
  }

  /**
   * Retrieves products with filters, sorting, and pagination.
   * Excludes soft-deleted products.
   */
  public async getProducts(filters: ProductQueryFilters) {
    const { page, limit, sortBy, sortOrder, category, brand, priceMin, priceMax, search } = filters;

    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
    };

    // Category filter (slug or uuid)
    if (category) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(category);
      if (isUuid) {
        where.categoryId = category;
      } else {
        where.category = { slug: category };
      }
    }

    // Brand filter (slug or uuid)
    if (brand) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(brand);
      if (isUuid) {
        where.brandId = brand;
      } else {
        where.brand = { slug: brand };
      }
    }

    // Price range filter via MarketplaceOffers
    if (priceMin !== undefined || priceMax !== undefined) {
      where.marketplaceOffers = {
        some: {
          AND: [
            ...(priceMin !== undefined ? [{ price: { gte: priceMin } }] : []),
            ...(priceMax !== undefined ? [{ price: { lte: priceMax } }] : []),
          ],
        },
      };
    }

    // Text search (name, description, category name, brand name)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { name: { contains: search, mode: 'insensitive' } } },
        { brand: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const total = await prisma.product.count({ where });
    const skip = (page - 1) * limit;

    const items = await prisma.product.findMany({
      where,
      include: {
        category: true,
        brand: true,
        marketplaceOffers: {
          include: {
            marketplace: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    });

    return {
      items,
      total,
    };
  }

  /**
   * Fetches a single active product by ID.
   */
  public async getProductById(id: string) {
    const product = await prisma.product.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        category: true,
        brand: true,
        marketplaceOffers: {
          include: {
            marketplace: true,
          },
        },
      },
    });

    return product;
  }

  /**
   * Creates a new product.
   */
  public async createProduct(data: CreateProductRequest) {
    const slug = await this.generateUniqueSlug(data.name);

    return prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        images: data.images,
        dealScore: data.dealScore,
        categoryId: data.categoryId,
        brandId: data.brandId,
        specifications: data.specifications as Prisma.InputJsonValue,
      },
      include: {
        category: true,
        brand: true,
        marketplaceOffers: {
          include: {
            marketplace: true,
          },
        },
      },
    });
  }

  /**
   * Updates an active product. Reject if soft-deleted.
   */
  public async updateProduct(id: string, data: UpdateProductRequest) {
    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing || existing.deletedAt !== null) {
      throw new Error('Product not found or has been deleted.');
    }

    const updateData: Prisma.ProductUpdateInput = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
      updateData.slug = await this.generateUniqueSlug(data.name);
    }
    if (data.description !== undefined) {
      updateData.description = data.description;
    }
    if (data.images !== undefined) {
      updateData.images = data.images;
    }
    if (data.dealScore !== undefined) {
      updateData.dealScore = data.dealScore;
    }
    if (data.categoryId !== undefined) {
      updateData.category = { connect: { id: data.categoryId } };
    }
    if (data.brandId !== undefined) {
      updateData.brand = { connect: { id: data.brandId } };
    }
    if (data.specifications !== undefined) {
      updateData.specifications = data.specifications as Prisma.InputJsonValue;
    }

    return prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        brand: true,
        marketplaceOffers: {
          include: {
            marketplace: true,
          },
        },
      },
    });
  }

  /**
   * Soft deletes a product by ID.
   */
  public async deleteProduct(id: string) {
    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing || existing.deletedAt !== null) {
      throw new Error('Product not found or has already been deleted.');
    }

    return prisma.product.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
