import { PrismaClient, StockStatus, Currency } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up database...');

  await prisma.priceHistory.deleteMany({});
  await prisma.marketplaceOffer.deleteMany({});
  await prisma.priceAlert.deleteMany({});
  await prisma.wishlist.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.activityLog.deleteMany({});
  await prisma.aiSummary.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.brand.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.marketplace.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding initial data...');

  // 1. Create Users
  const passwordHash = bcrypt.hashSync('password123', 10);

  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@dealscope.com',
      role: 'admin',
      emailVerified: true,
      accounts: {
        create: {
          type: 'credentials',
          provider: 'credentials',
          providerAccountId: 'admin@dealscope.com',
          password: passwordHash,
        },
      },
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      name: 'Regular User',
      email: 'user@dealscope.com',
      role: 'user',
      emailVerified: true,
      accounts: {
        create: {
          type: 'credentials',
          provider: 'credentials',
          providerAccountId: 'user@dealscope.com',
          password: passwordHash,
        },
      },
    },
  });

  // 2. Create Categories
  const electronics = await prisma.category.create({
    data: {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Gadgets, devices, and tech accessories.',
    },
  });

  const laptops = await prisma.category.create({
    data: {
      name: 'Laptops',
      slug: 'laptops',
      description: 'Portable computers for work and gaming.',
      parentId: electronics.id,
    },
  });

  const smartphones = await prisma.category.create({
    data: {
      name: 'Smartphones',
      slug: 'smartphones',
      description: 'Mobile phones and handheld devices.',
      parentId: electronics.id,
    },
  });

  // 3. Create Brands
  const apple = await prisma.brand.create({
    data: {
      name: 'Apple',
      slug: 'apple',
      logoUrl: 'https://logo.clearbit.com/apple.com',
    },
  });

  await prisma.brand.create({
    data: {
      name: 'Samsung',
      slug: 'samsung',
      logoUrl: 'https://logo.clearbit.com/samsung.com',
    },
  });

  // 4. Create Marketplaces
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

  // 5. Create Products
  const macbook = await prisma.product.create({
    data: {
      name: 'Apple MacBook Pro 14" M3',
      slug: 'apple-macbook-pro-14-m3',
      description: 'The 14-inch MacBook Pro with M3 chip is a powerhouse for creative professionals.',
      images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'],
      dealScore: 92,
      rating: 4.85,
      reviewCount: 450,
      categoryId: laptops.id,
      brandId: apple.id,
      specifications: { RAM: '8GB', Storage: '512GB SSD', Chip: 'Apple M3' },
    },
  });

  const iphone = await prisma.product.create({
    data: {
      name: 'Apple iPhone 15 Pro Max',
      slug: 'apple-iphone-15-pro-max',
      description: 'Titanium design, A17 Pro chip, customizable Action button, and 5x Telephoto camera.',
      images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800'],
      dealScore: 88,
      rating: 4.70,
      reviewCount: 328,
      categoryId: smartphones.id,
      brandId: apple.id,
      specifications: { Screen: '6.7-inch Super Retina XDR', Storage: '256GB' },
    },
  });

  // 6. Create Marketplace Offers
  const macbookOffer1 = await prisma.marketplaceOffer.create({
    data: {
      productId: macbook.id,
      marketplaceId: amazon.id,
      productUrl: 'https://amazon.com/dp/macbookpro14',
      price: 1499.00,
      originalPrice: 1599.00,
      currency: Currency.USD,
      stockStatus: StockStatus.IN_STOCK,
      shippingCost: 0.00,
      isOfficialStore: true,
      marketplaceRating: 4.90,
      reviewCount: 200,
    },
  });

  await prisma.marketplaceOffer.create({
    data: {
      productId: macbook.id,
      marketplaceId: bestbuy.id,
      productUrl: 'https://bestbuy.com/site/macbookpro14',
      price: 1519.00,
      originalPrice: 1599.00,
      currency: Currency.USD,
      stockStatus: StockStatus.IN_STOCK,
      shippingCost: 10.00,
      isOfficialStore: true,
      marketplaceRating: 4.80,
      reviewCount: 150,
    },
  });

  const iphoneOffer1 = await prisma.marketplaceOffer.create({
    data: {
      productId: iphone.id,
      marketplaceId: amazon.id,
      productUrl: 'https://amazon.com/dp/iphone15promax',
      price: 1099.00,
      originalPrice: 1199.00,
      currency: Currency.USD,
      stockStatus: StockStatus.IN_STOCK,
      shippingCost: 0.00,
      isOfficialStore: true,
      marketplaceRating: 4.85,
      reviewCount: 300,
    },
  });

  // 7. Create Price History
  await prisma.priceHistory.createMany({
    data: [
      {
        marketplaceOfferId: macbookOffer1.id,
        productId: macbook.id,
        price: 1599.00,
        originalPrice: 1599.00,
        shippingCost: 0.00,
        currency: Currency.USD,
        stockStatus: StockStatus.IN_STOCK,
        recordedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
      {
        marketplaceOfferId: macbookOffer1.id,
        productId: macbook.id,
        price: 1549.00,
        originalPrice: 1599.00,
        shippingCost: 0.00,
        currency: Currency.USD,
        stockStatus: StockStatus.IN_STOCK,
        recordedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
      {
        marketplaceOfferId: macbookOffer1.id,
        productId: macbook.id,
        price: 1499.00,
        originalPrice: 1599.00,
        shippingCost: 0.00,
        currency: Currency.USD,
        stockStatus: StockStatus.IN_STOCK,
        recordedAt: new Date(),
      },
      {
        marketplaceOfferId: iphoneOffer1.id,
        productId: iphone.id,
        price: 1199.00,
        originalPrice: 1199.00,
        shippingCost: 0.00,
        currency: Currency.USD,
        stockStatus: StockStatus.IN_STOCK,
        recordedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
      {
        marketplaceOfferId: iphoneOffer1.id,
        productId: iphone.id,
        price: 1099.00,
        originalPrice: 1199.00,
        shippingCost: 0.00,
        currency: Currency.USD,
        stockStatus: StockStatus.IN_STOCK,
        recordedAt: new Date(),
      },
    ],
  });

  // 8. Create AI Summary
  await prisma.aiSummary.create({
    data: {
      productId: macbook.id,
      verdict: 'Highly Recommended',
      summary: 'The MacBook Pro 14" M3 is an excellent entry-level professional laptop with stellar battery life and a stunning display.',
      pros: ['Incredible battery life', 'Beautiful Liquid Retina XDR display', 'Fast performance'],
      cons: ['Base model only has 8GB RAM', 'Limited port selection compared to higher tiers'],
    },
  });

  // 9. Create Wishlist Entries
  await prisma.wishlist.create({
    data: {
      userId: regularUser.id,
      productId: macbook.id,
      targetPrice: 1399.00,
      priority: 1,
    },
  });

  // 10. Create Activity Logs
  await prisma.activityLog.createMany({
    data: [
      {
        userId: regularUser.id,
        action: 'login',
        details: { ip: '127.0.0.1' },
      },
      {
        userId: regularUser.id,
        action: 'add_to_wishlist',
        details: { productId: macbook.id },
      },
    ],
  });

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
