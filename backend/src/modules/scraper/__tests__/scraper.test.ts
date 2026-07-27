import { TokopediaScraperProvider } from '../providers/tokopedia.provider';
import { ShopeeScraperProvider } from '../providers/shopee.provider';
import { scraperService } from '../scraper.service';

jest.mock('../scraper.queue', () => ({
  getQueueStats: jest.fn().mockResolvedValue({
    waiting: 0,
    active: 0,
    completed: 0,
    failed: 0,
    delayed: 0,
  }),
  addFullProductScrapeJob: jest.fn(),
  addPriceCheckJob: jest.fn(),
  addDiscoveryJob: jest.fn(),
}));

describe('Scraper Module Unit Tests', () => {
  describe('TokopediaScraperProvider', () => {
    const provider = new TokopediaScraperProvider();

    it('should have correct provider name and slug', () => {
      expect(provider.providerName).toBe('Tokopedia');
      expect(provider.marketplaceSlug).toBe('tokopedia');
    });

    it('should return initial stats with 100% success rate', () => {
      const stats = provider.getStats();
      expect(stats.provider).toBe('Tokopedia');
      expect(stats.totalRequests).toBe(0);
      expect(stats.successRate).toBe(100);
    });

    it('should search products with fallback format', async () => {
      jest.spyOn(provider as unknown as { fetchWithRetry: jest.Mock }, 'fetchWithRetry').mockResolvedValueOnce({
        data: '<html><body><div data-testid="master-product-card"><a href="/item-1"><span data-testid="spnSRPProdName">Laptop Asus</span><span data-testid="spnSRPProdPrice">Rp 15.000.000</span></a></div></body></html>',
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as never,
      });

      const products = await provider.searchProducts('laptop', 1);
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBeGreaterThan(0);
      expect(products[0].marketplaceSlug).toBe('tokopedia');
      expect(products[0].price).toBe(15000000);
    });
  });

  describe('ShopeeScraperProvider', () => {
    const provider = new ShopeeScraperProvider();

    it('should have correct provider name and slug', () => {
      expect(provider.providerName).toBe('Shopee');
      expect(provider.marketplaceSlug).toBe('shopee');
    });

    it('should return initial stats', () => {
      const stats = provider.getStats();
      expect(stats.provider).toBe('Shopee');
      expect(stats.totalRequests).toBe(0);
    });

    it('should search products with mock data', async () => {
      jest.spyOn(provider as unknown as { fetchWithRetry: jest.Mock }, 'fetchWithRetry').mockResolvedValueOnce({
        data: '<script type="application/ld+json">{"@type":"ItemList","itemListElement":[{"item":{"name":"MacBook Air M2","url":"https://shopee.co.id/macbook","offers":{"price":18000000}}}]}</script>',
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as never,
      });

      const products = await provider.searchProducts('macbook', 1);
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBeGreaterThan(0);
      expect(products[0].marketplaceSlug).toBe('shopee');
      expect(products[0].price).toBe(18000000);
    });
  });

  describe('ScraperService Status', () => {
    it('should return system status metrics', async () => {
      const status = await scraperService.getScraperStatus();
      expect(status).toHaveProperty('status');
      expect(status).toHaveProperty('queueStats');
      expect(status).toHaveProperty('providers');
      expect(status.providers).toHaveProperty('tokopedia');
      expect(status.providers).toHaveProperty('shopee');
    });
  });
});
