import * as cheerio from 'cheerio';
import { BaseScraperProvider } from './base.provider';
import { ScrapedProduct, ScrapedProductDetail, ScrapedPrice } from '../types';
import logger from '../../../shared/utils/logger';

export class ShopeeScraperProvider extends BaseScraperProvider {
  public get providerName(): string {
    return 'Shopee';
  }

  public get marketplaceSlug(): string {
    return 'shopee';
  }

  /**
   * Search products on Shopee by query string and page
   */
  public async searchProducts(query: string, page: number = 1): Promise<ScrapedProduct[]> {
    const encodedQuery = encodeURIComponent(query);
    const pageIndex = Math.max(0, page - 1);
    const searchUrl = `https://shopee.co.id/search?keyword=${encodedQuery}&page=${pageIndex}`;

    try {
      const response = await this.fetchWithRetry<string>(searchUrl, {
        headers: {
          'Referer': 'https://shopee.co.id/',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      const $ = cheerio.load(response.data);
      const scrapedProducts: ScrapedProduct[] = [];

      // Extract JSON-LD / HTML product items from Cheerio
      $('script[type="application/ld+json"]').each((_, script) => {
        try {
          const json = JSON.parse($(script).html() || '{}');
          if (json['@type'] === 'ItemList' && Array.isArray(json.itemListElement)) {
            json.itemListElement.forEach((item: Record<string, unknown>) => {
              const prod = (item.item || item) as { name?: string; url?: string; offers?: { price?: string | number; seller?: { name?: string } }; image?: string };
              if (prod && prod.name) {
                const rawPrice = parseFloat(String(prod.offers?.price || '0'));
                // Shopee API sometimes uses price in 100,000 units
                const price = rawPrice > 100000000 ? Math.round(rawPrice / 100000) : rawPrice;
                // Only keep products with a real, parseable price — do not fabricate one.
                if (price > 0) {
                  scrapedProducts.push({
                    name: prod.name,
                    url: prod.url || searchUrl,
                    price,
                    imageUrl: prod.image,
                    seller: prod.offers?.seller?.name,
                    marketplaceSlug: this.marketplaceSlug,
                  });
                }
              }
            });
          }
        } catch {
          // Ignore JSON parse errors
        }
      });

      // Parse Shopee DOM items
      $('.shopee-search-item-result__item, div[data-sqe="item"]').each((_, element) => {
        const card = $(element);
        const name = card.find('div[data-sqe="name"], .aria-hidden').text().trim();
        const priceText = card.find('span._3c_23s, ._1w9f8d, font').first().text().trim();
        const href = card.find('a').attr('href') || '';

        if (name && priceText) {
          const price = this.parsePrice(priceText);
          if (price > 0) {
            const fullUrl = href.startsWith('http') ? href : `https://shopee.co.id${href}`;
            scrapedProducts.push({
              name,
              url: fullUrl,
              price,
              imageUrl: card.find('img').attr('src') || '',
              marketplaceSlug: this.marketplaceSlug,
              inStock: true,
            });
          }
        }
      });

      // No fallback mock list: when scraping yields nothing, return an empty
      // array so downstream services can report "no results" honestly instead
      // of ingesting fabricated products with invented prices/ratings.
      logger.info(`[Shopee] Scraped ${scrapedProducts.length} search products for '${query}'`);
      return scrapedProducts;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      logger.error(`[Shopee] searchProducts failed for '${query}': ${msg}`);
      throw error;
    }
  }

  /**
   * Get full product detail from Shopee URL
   */
  public async getProductDetail(url: string): Promise<ScrapedProductDetail> {
    try {
      const response = await this.fetchWithRetry<string>(url, {
        headers: {
          'Referer': 'https://shopee.co.id/',
        },
      });

      const $ = cheerio.load(response.data);
      let name = $('meta[property="og:title"]').attr('content') || $('h1, title').first().text().trim();
      let priceText = $('meta[property="og:price:amount"]').attr('content') || $('.pq8P07, ._3n5odx').first().text().trim();
      let description = $('meta[property="og:description"]').attr('content') || $('div.product-detail').text().trim();
      const imageUrl = $('meta[property="og:image"]').attr('content');

      // Extract JSON-LD script if available
      interface ShopeeJsonLd {
        '@type'?: string;
        name?: string;
        description?: string;
        offers?: { price?: string };
      }
      let jsonLdData: ShopeeJsonLd | null = null;
      $('script[type="application/ld+json"]').each((_, script) => {
        try {
          const parsed = JSON.parse($(script).html() || '{}') as ShopeeJsonLd;
          if (parsed['@type'] === 'Product') {
            jsonLdData = parsed;
          }
        } catch {
          // Ignore parse errors
        }
      });

      const ld = jsonLdData as ShopeeJsonLd | null;
      if (ld) {
        name = ld.name || name;
        description = ld.description || description;
        if (ld.offers) {
          const p = parseFloat(ld.offers.price || '0');
          if (p > 0) priceText = `${p > 100000000 ? Math.round(p / 100000) : p}`;
        }
      }

      name = name.replace(/ \| Shopee Indonesia$/i, '').trim();
      const rawPrice = this.parsePrice(priceText);
      const price = rawPrice > 100000000 ? Math.round(rawPrice / 100000) : rawPrice;

      const images: string[] = [];
      if (imageUrl) images.push(imageUrl);
      $('img._39B4AV, img.shopee-image').each((_, img) => {
        const src = $(img).attr('src');
        if (src && !images.includes(src)) images.push(src);
      });

      return {
        name: name || 'Shopee Product',
        description: description || '',
        url,
        images,
        price,
        seller: '',
        inStock: price > 0,
        marketplaceSlug: this.marketplaceSlug,
      };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      logger.error(`[Shopee] getProductDetail failed for ${url}: ${msg}`);
      throw error;
    }
  }

  /**
   * Get current price only for quick price alert verification
   */
  public async getProductPrice(url: string): Promise<ScrapedPrice> {
    const detail = await this.getProductDetail(url);
    return {
      url,
      price: detail.price,
      originalPrice: detail.originalPrice,
      inStock: detail.inStock,
      currency: 'IDR',
      timestamp: new Date(),
    };
  }

  /**
   * Helper to parse IDR strings like "Rp2.399.000" into numeric value 2399000
   */
  private parsePrice(priceStr: string): number {
    if (!priceStr) return 0;
    const digitsOnly = priceStr.replace(/[^0-9]/g, '');
    const val = parseInt(digitsOnly, 10);
    return isNaN(val) ? 0 : val;
  }
}
