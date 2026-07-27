import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import logger from '../../../shared/utils/logger';
import { ScrapedProduct, ScrapedProductDetail, ScrapedPrice, ProviderStats } from '../types';

export abstract class BaseScraperProvider {
  public abstract get providerName(): string;
  public abstract get marketplaceSlug(): string;

  public abstract searchProducts(query: string, page?: number): Promise<ScrapedProduct[]>;
  public abstract getProductDetail(url: string): Promise<ScrapedProductDetail>;
  public abstract getProductPrice(url: string): Promise<ScrapedPrice>;

  protected client: AxiosInstance;
  protected lastRequestTime: number = 0;
  protected minRequestIntervalMs: number = 1000; // 1 request / second rate limit

  protected stats: ProviderStats = {
    provider: '',
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    blockedRequests: 0,
    successRate: 100,
  };

  private userAgents: string[] = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:124.0) Gecko/20100101 Firefox/124.0',
  ];

  constructor() {
    this.client = axios.create({
      timeout: 10000,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
    });

    if (process.env.SCRAPER_PROXY_URL) {
      try {
        const proxyUrl = new URL(process.env.SCRAPER_PROXY_URL);
        this.client.defaults.proxy = {
          host: proxyUrl.hostname,
          port: parseInt(proxyUrl.port || '8080', 10),
          auth: proxyUrl.username ? { username: proxyUrl.username, password: proxyUrl.password } : undefined,
          protocol: proxyUrl.protocol.replace(':', ''),
        };
      } catch (err) {
        logger.warn(`[BaseScraperProvider] Invalid SCRAPER_PROXY_URL specified: ${err}`);
      }
    }
  }

  protected getRandomUserAgent(): string {
    const index = Math.floor(Math.random() * this.userAgents.length);
    return this.userAgents[index];
  }

  protected async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastRequestTime;
    if (elapsed < this.minRequestIntervalMs) {
      const waitTime = this.minRequestIntervalMs - elapsed;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
    this.lastRequestTime = Date.now();
  }

  protected async fetchWithRetry<T = unknown>(
    url: string,
    options: AxiosRequestConfig = {},
    maxRetries: number = 3
  ): Promise<AxiosResponse<T>> {
    this.stats.provider = this.providerName;
    this.stats.totalRequests++;

    let attempt = 0;
    let delay = 1000;

    while (attempt < maxRetries) {
      attempt++;
      await this.enforceRateLimit();

      const headers = {
        'User-Agent': this.getRandomUserAgent(),
        ...(options.headers || {}),
      };

      try {
        logger.debug(`[${this.providerName}] HTTP Fetch attempt ${attempt}/${maxRetries}: ${url}`);
        const response = await this.client.request<T>({
          url,
          ...options,
          headers,
        });

        // Check for soft blocking keywords in body if string response
        if (typeof response.data === 'string') {
          const bodyLower = (response.data as string).toLowerCase();
          if (
            bodyLower.includes('captcha') ||
            bodyLower.includes('access denied') ||
            bodyLower.includes('blocked') ||
            bodyLower.includes('robot check')
          ) {
            this.stats.blockedRequests++;
            logger.warn(`[${this.providerName}] Anti-scraping / CAPTCHA block detected on attempt ${attempt} for ${url}`);
            throw new Error(`Blocked by anti-scraping system on ${this.providerName}`);
          }
        }

        this.stats.successfulRequests++;
        this.stats.lastScrapedAt = new Date().toISOString();
        this.recalculateSuccessRate();
        logger.info(`[${this.providerName}] Successfully scraped URL: ${url}`);
        return response;
      } catch (error: unknown) {
        const isLastAttempt = attempt >= maxRetries;
        const errObj = error as { message?: string; response?: { status?: number } };
        const statusCode = errObj.response?.status;
        const errMsg = errObj.message || String(error);

        if (statusCode === 403 || statusCode === 429) {
          this.stats.blockedRequests++;
          logger.warn(`[${this.providerName}] HTTP ${statusCode} Blocked on ${url}`);
        }

        if (isLastAttempt) {
          this.stats.failedRequests++;
          this.recalculateSuccessRate();
          logger.error(`[${this.providerName}] Scraping failed after ${maxRetries} attempts for ${url}: ${errMsg}`);
          throw error;
        }

        logger.warn(`[${this.providerName}] Request failed (${errMsg}), retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }

    throw new Error(`Failed to fetch ${url} after ${maxRetries} retries`);
  }

  private recalculateSuccessRate(): void {
    if (this.stats.totalRequests > 0) {
      const successful = this.stats.successfulRequests;
      this.stats.successRate = Number(((successful / this.stats.totalRequests) * 100).toFixed(2));
    }
  }

  public getStats(): ProviderStats {
    this.stats.provider = this.providerName;
    return { ...this.stats };
  }
}
