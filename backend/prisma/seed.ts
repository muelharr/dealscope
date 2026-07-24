import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database...');
  // Delete in reverse order of dependencies
  await prisma.comparisonHistory.deleteMany({});
  await prisma.aiSummary.deleteMany({});
  await prisma.activityLog.deleteMany({});
  await prisma.searchHistory.deleteMany({});
  await prisma.wishlist.deleteMany({});
  await prisma.priceHistory.deleteMany({});
  await prisma.marketplaceOffer.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.marketplace.deleteMany({});
  await prisma.brand.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding initial data...');

  // 1. Create Categories
  const electronics = await prisma.category.create({
    data: {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Gadgets, devices, and accessories',
    },
  });

  const laptops = await prisma.category.create({
    data: {
      name: 'Laptops',
      slug: 'laptops',
      description: 'Notebooks and portable computers',
      parentId: electronics.id,
    },
  });

  const smartphones = await prisma.category.create({
    data: {
      name: 'Smartphones',
      slug: 'smartphones',
      description: 'Mobile phones and handheld devices',
      parentId: electronics.id,
    },
  });

  // 2. Create Brands
  const apple = await prisma.brand.create({
    data: {
      name: 'Apple',
      slug: 'apple',
      logoUrl: 'https://logo.clearbit.com/apple.com',
    },
  });

  // 3. Create Marketplaces
  const amazon = await prisma.marketplace.create({
    data: {
      name: 'Amazon',
      slug: 'amazon',
      logoUrl: 'https://logo.clearbit.com/amazon.com',
    },
  });

  const bestbuy = await prisma.marketplace.create({
    data: {
      name: 'Best Buy',
      slug: 'bestbuy',
      logoUrl: 'https://logo.clearbit.com/bestbuy.com',
    },
  });

  // 4. Create Products
  const macbook = await prisma.product.create({
    data: {
      title: 'MacBook Pro 14" (M3, 2023)',
      slug: 'macbook-pro-14-m3-2023',
      description: 'Apple MacBook Pro 14-inch with M3 chip, 8GB Unified Memory, 512GB SSD storage.',
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
      currentPrice: 1499.00,
      originalPrice: 1599.00,
      dealScore: 85,
      rating: 4.8,
      reviewCount: 142,
      categoryId: laptops.id,
      brandId: apple.id,
    },
  });

  const iphone = await prisma.product.create({
    data: {
      title: 'iPhone 15 Pro Max (256GB)',
      slug: 'iphone-15-pro-max-256gb',
      description: 'The ultimate iPhone with titanium design, A17 Pro chip, and advanced camera system.',
      imageUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5',
      currentPrice: 1099.00,
      originalPrice: 1199.00,
      dealScore: 92,
      rating: 4.9,
      reviewCount: 328,
      categoryId: smartphones.id,
      brandId: apple.id,
    },
  });

  // 5. Create Price History
  await prisma.priceHistory.createMany({
    data: [
      { productId: macbook.id, price: 1599.00, recordedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { productId: macbook.id, price: 1549.00, recordedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
      { productId: macbook.id, price: 1499.00, recordedAt: new Date() },
      { productId: iphone.id, price: 1199.00, recordedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { productId: iphone.id, price: 1149.00, recordedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
      { productId: iphone.id, price: 1099.00, recordedAt: new Date() },
    ],
  });

  // 6. Create Marketplace Offers
  await prisma.marketplaceOffer.createMany({
    data: [
      {
        productId: macbook.id,
        marketplaceId: amazon.id,
        price: 1499.00,
        url: 'https://amazon.com/dp/macbookpro14',
        inStock: true,
        availabilityText: 'In Stock',
        availabilityType: 'positive',
      },
      {
        productId: macbook.id,
        marketplaceId: bestbuy.id,
        price: 1519.00,
        url: 'https://bestbuy.com/site/macbookpro14',
        inStock: true,
        availabilityText: 'Only 3 left',
        availabilityType: 'warning',
      },
      {
        productId: iphone.id,
        marketplaceId: amazon.id,
        price: 1099.00,
        url: 'https://amazon.com/dp/iphone15promax',
        inStock: true,
        availabilityText: 'In Stock',
        availabilityType: 'positive',
      },
    ],
  });

  // 7. Create AI Summaries
  await prisma.aiSummary.create({
    data: {
      productId: macbook.id,
      verdict: 'Highly Recommended',
      summary: 'The MacBook Pro 14" M3 is an excellent entry-level professional laptop with stellar battery life and a stunning display.',
      pros: ['Incredible battery life', 'Beautiful Liquid Retina XDR display', 'Fast performance'],
      cons: ['Base model only has 8GB RAM', 'Limited port selection compared to higher tiers'],
    },
  });

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
