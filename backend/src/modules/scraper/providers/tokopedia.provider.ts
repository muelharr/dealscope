import * as cheerio from 'cheerio';
import { BaseScraperProvider } from './base.provider';
import { ScrapedProduct, ScrapedProductDetail, ScrapedPrice } from '../types';
import logger from '../../../shared/utils/logger';

export class TokopediaScraperProvider extends BaseScraperProvider {
  public get providerName(): string {
    return 'Tokopedia';
  }

  public get marketplaceSlug(): string {
    return 'tokopedia';
  }

  /**
   * Search products on Tokopedia by query string and page
   */
  public async searchProducts(query: string, page: number = 1): Promise<ScrapedProduct[]> {
    const encodedQuery = encodeURIComponent(query);
    const searchUrl = `https://www.tokopedia.com/search?st=product&q=${encodedQuery}&page=${page}`;

    try {
      const response = await this.fetchWithRetry<string>(searchUrl, {
        headers: {
          'Referer': 'https://www.tokopedia.com/',
        },
      });

      const $ = cheerio.load(response.data);
      const scrapedProducts: ScrapedProduct[] = [];

      // Extract JSON-LD or search item cards from Cheerio HTML
      $('div[data-testid="lstCL2ProductList"] > div, div[data-testid="master-product-card"]').each((_, element) => {
        const card = $(element);
        const name = card.find('[data-testid="spnSRPProdName"], .css-205r5l').text().trim();
        const priceText = card.find('[data-testid="spnSRPProdPrice"], .css-o5u20d').text().trim();
        const productUrl = card.find('a').attr('href') || '';
        const imageUrl = card.find('img').attr('src') || '';
        const seller = card.find('[data-testid="spnSRPProdShopName"], .css-1rn0irl').text().trim();
        const ratingText = card.find('[data-testid="spnSRPProdRating"], .css-t70v7n').text().trim();

        if (name && priceText) {
          const price = this.parsePrice(priceText);
          if (price > 0) {
            const fullUrl = productUrl.startsWith('http') ? productUrl : `https://www.tokopedia.com${productUrl}`;
            const rating = parseFloat(ratingText);

            scrapedProducts.push({
              name,
              url: fullUrl,
              price,
              imageUrl,
              seller: seller || undefined,
              rating: !isNaN(rating) ? rating : undefined,
              marketplaceSlug: this.marketplaceSlug,
              inStock: true,
            });
          }
        }
      });

      // Fallback if DOM selectors are dynamic: parse JSON scripts embedded in page
      if (scrapedProducts.length === 0) {
        $('script[type="application/ld+json"]').each((_, script) => {
          try {
            const json = JSON.parse($(script).html() || '{}');
            if (json['@type'] === 'ItemList' && Array.isArray(json.itemListElement)) {
              json.itemListElement.forEach((item: Record<string, unknown>) => {
                const prod = (item.item || item) as { name?: string; url?: string; image?: string; offers?: { price?: string; lowPrice?: string; seller?: { name?: string } } };
                if (prod && prod.name && prod.offers) {
                  const price = parseFloat(prod.offers.price || prod.offers.lowPrice || '0');
                  if (price > 0) {
                    scrapedProducts.push({
                      name: prod.name,
                      url: prod.url || searchUrl,
                      price,
                      imageUrl: prod.image,
                      seller: prod.offers.seller?.name,
                      marketplaceSlug: this.marketplaceSlug,
                      inStock: true,
                    });
                  }
                }
              });
            }
          } catch {
            // Ignore JSON parse errors for non-matching scripts
          }
        });
      }

      // No fallback mock list: when scraping yields nothing, return an empty
      // array so downstream services can report "no results" honestly instead
      // of ingesting fabricated products with invented prices/ratings.
      logger.info(`[Tokopedia] Scraped ${scrapedProducts.length} search products for '${query}'`);
      return scrapedProducts;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      logger.error(`[Tokopedia] searchProducts failed for '${query}': ${msg}`);
      throw error;
    }
  }

  /**
   * Get full product detail from Tokopedia URL
   */
  public async getProductDetail(url: string): Promise<ScrapedProductDetail> {
    try {
      const response = await this.fetchWithRetry<string>(url, {
        headers: {
          'Referer': 'https://www.tokopedia.com/',
        },
      });

      const $ = cheerio.load(response.data);
      let name = $('h1[data-testid="lblpdpDetailProductName"], h1').first().text().trim();
      let priceText = $('div[data-testid="lblPDPDetailProductPrice"], .price').first().text().trim();
      let description = $('div[data-testid="lblPDPDescriptionDetailPage"]').text().trim();
      let seller = $('a[data-testid="llbPDPFooterShopName"]').text().trim();
      const ratingText = $('span[data-testid="lblPDPDetailProductRatingNumber"]').text().trim();

      const images: string[] = [];
      $('img[data-testid="PDPImageMain"], img[data-testid="PDPImageThumbnail"]').each((_, img) => {
        const src = $(img).attr('src');
        if (src && !images.includes(src)) images.push(src);
      });

      // Extract details from OpenGraph or JSON-LD if DOM tags missing
      interface TokopediaJsonLd {
        '@type'?: string;
        name?: string;
        description?: string;
        image?: string | string[];
        offers?: { price?: string; seller?: { name?: string } };
      }
      let jsonLdData: TokopediaJsonLd | null = null;
      $('script[type="application/ld+json"]').each((_, script) => {
        try {
          const parsed = JSON.parse($(script).html() || '{}') as TokopediaJsonLd;
          if (parsed['@type'] === 'Product') {
            jsonLdData = parsed;
          }
        } catch {
          // Ignore parse errors
        }
      });

      const ld = jsonLdData as TokopediaJsonLd | null;
      if (ld) {
        name = name || ld.name || 'Tokopedia Product';
        description = description || ld.description || '';
        if (ld.image) {
          const imgs = Array.isArray(ld.image) ? ld.image : [ld.image];
          imgs.forEach((img: string) => { if (!images.includes(img)) images.push(img); });
        }
        if (ld.offers) {
          const p = parseFloat(ld.offers.price || '0');
          if (p > 0) priceText = `Rp ${p}`;
          seller = seller || ld.offers.seller?.name || '';
        }
      }

      // OpenGraph Fallbacks
      name = name || $('meta[property="og:title"]').attr('content') || 'Tokopedia Product';
      priceText = priceText || $('meta[property="og:price:amount"]').attr('content') || '';
      if (images.length === 0) {
        const ogImg = $('meta[property="og:image"]').attr('content');
        if (ogImg) images.push(ogImg);
      }

      const price = this.parsePrice(priceText);
      const isOfficialStore = $('[data-testid="imgPDPDetailShopBadge"]').length > 0 || seller.toLowerCase().includes('official');
      const rating = parseFloat(ratingText);

      return {
        name,
        description: description || '',
        url,
        images,
        price,
        seller,
        rating: !isNaN(rating) ? rating : undefined,
        inStock: price > 0,
        isOfficialStore,
        marketplaceSlug: this.marketplaceSlug,
      };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      logger.error(`[Tokopedia] getProductDetail failed for ${url}: ${msg}`);
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
   * Helper to parse IDR strings like "Rp 1.500.000" into numeric value 1500000
   */
  private parsePrice(priceStr: string): number {
    if (!priceStr) return 0;
    const digitsOnly = priceStr.replace(/[^0-9]/g, '');
    const val = parseInt(digitsOnly, 10);
    return isNaN(val) ? 0 : val;
  }
}
