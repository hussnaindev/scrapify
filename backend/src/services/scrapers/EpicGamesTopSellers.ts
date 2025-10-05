/**
 * Epic Games Top Sellers Scraper
 * Scrapes top selling games from Epic Games Store using Puppeteer to bypass 403 errors
 */

import puppeteer, { Browser, Page } from 'puppeteer';
import { BaseScraper, ScraperConfig, ScraperResult, ScrapingOptions } from '../base/BaseScraper';

export class EpicGamesTopSellersScraper extends BaseScraper {
    private browser: Browser | null = null;

    constructor() {
        const config: ScraperConfig = {
            id: 'epic-games-top-sellers',
            name: 'Epic Games Top Sellers',
            description: 'Scrape top selling games from Epic Games Store with pricing information',
            url: 'https://store.epicgames.com/en-US/collection/top-sellers',
            enabled: true,
            supportedFormats: ['json', 'csv'],
            defaultFormat: 'json',
            estimatedRecords: 50,
            timeout: 60000, // Increased timeout for Puppeteer
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            }
        };
        super(config);
    }

    async scrape(options?: ScrapingOptions): Promise<ScraperResult> {
        this.validateOptions(options);

        let browser: Browser | null = null;
        let page: Page | null = null;

        try {
            // Launch Puppeteer browser
            browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--single-process',
                    '--disable-gpu'
                ]
            });

            page = await browser.newPage();

            // Set user agent to look like a real browser
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

            // Set extra HTTP headers
            await page.setExtraHTTPHeaders({
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
            });

            // Navigate to Epic Games store
            console.log('Navigating to Epic Games store...');
            let response: any;
            try {
                response = await page.goto('https://store.epicgames.com/en-US/collection/top-sellers', {
                    waitUntil: 'domcontentloaded', // Changed from networkidle0
                    timeout: this.config.timeout
                });
            } catch (error: any) {
                if (error?.message?.includes('detached')) {
                    // Try again with different wait strategy
                    await page.goto('https://store.epicgames.com/en-US/collection/top-sellers', {
                        waitUntil: 'load',
                        timeout: this.config.timeout
                    });
                } else {
                    throw error;
                }
            }

            if (!response || !response.ok()) {
                throw new Error(`Failed to load page: ${response?.status() || 'Unknown error'}`);
            }

            // Wait for content to load
            await new Promise(resolve => setTimeout(resolve, 3000));
            // Extract games data using Puppeteer's page evaluation
            const gamesData = await page.evaluate(() => {
                const games: any[] = [];

                // Try multiple selectors for Epic Games store layout
                const selectors = [
                    '[data-testid="game-card"]',
                    '.game-card',
                    '[class*="game-card"]',
                    '[class*="GameCard"]',
                    '.css-1jnx0a8',
                    '[class*="game"]',
                    '[class*="Game"]',
                    'a[href*="/p/"]'
                ];

                // Use any[] type for DOM elements since we're in browser context
                let gameElements: any[] = [];

                // Fix the syntax error and use globalThis for proper browser context
                for (const selector of selectors) {
                    gameElements = Array.from((globalThis as any).document.querySelectorAll(selector));
                    if (gameElements.length > 0) {
                        console.log(`Found ${gameElements.length} games with selector: ${selector}`);
                        break;
                    }
                }

                gameElements.forEach((element: any, index: number) => {
                    try {
                        // Extract data using DOM queries within the element
                        const getTextContent = (element: any, selectors: string[]): string => {
                            for (const selector of selectors) {
                                const el = element.querySelector(selector);
                                if (el) {
                                    const text = el.textContent?.trim();
                                    if (text) return text;
                                }
                            }
                            return '';
                        };

                        const getHref = (element: any): string => {
                            const link = element.querySelector('a');
                            if (link) {
                                const href = link.getAttribute('href');
                                return href ? (href.startsWith('http') ? href : `https://store.epicgames.com${href}`) : '';
                            }
                            return '';
                        };

                        const name = getTextContent(element, [
                            '[data-testid="game-title"]',
                            '.game-title',
                            '.game-name',
                            'h3',
                            'h4',
                            '[class*="title"]',
                            '[class*="name"]'
                        ]);

                        const price = getTextContent(element, [
                            '[data-testid="game-price"]',
                            '.price',
                            '.game-price',
                            '[class*="price"]',
                            '.css-1jnx0a8'
                        ]);

                        const discountPercentage = getTextContent(element, [
                            '.discount',
                            '.sale-badge',
                            '[class*="discount"]',
                            '[class*="sale"]',
                            '[class*="off"]'
                        ]);

                        const link = getHref(element);

                        // Calculate discounted price if we have original price and discount
                        let discountedPrice = price || 'Free';
                        if (price && discountPercentage) {
                            const priceMatch = price.match(/[\d,]+\.?\d*/);
                            const discountMatch = discountPercentage.match(/(\d+)%/);

                            if (priceMatch && discountMatch) {
                                const originalPrice = parseFloat(priceMatch[0].replace(/,/g, ''));
                                const discount = parseFloat(discountMatch[1]);

                                if (originalPrice > 0 && discount > 0) {
                                    const calculatedPrice = originalPrice * (1 - discount / 100);
                                    discountedPrice = `$${calculatedPrice.toFixed(2)}`;
                                }
                            }
                        }

                        if (name) {
                            games.push({
                                name,
                                price: price || 'Free',
                                discountPercentage: discountPercentage || '0%',
                                discountedPrice,
                                link: link || 'https://store.epicgames.com/en-US/collection/top-sellers',
                                rank: index + 1
                            });
                        }
                    } catch (error) {
                        console.warn(`Error parsing game ${index}:`, error);
                    }
                });

                return games;
            });

            if (gamesData.length === 0) {
                throw new Error('No game data could be parsed from Epic Games Store');
            }

            const limitedData = this.applyLimit(gamesData, options?.limit);

            return {
                data: limitedData,
                recordCount: limitedData.length,
                metadata: {
                    duration: 0,
                    url: this.config.url,
                    timestamp: new Date().toISOString()
                }
            };

        } catch (error) {
            console.error('Error scraping Epic Games Top Sellers:', error);
            throw new Error(`Failed to scrape Epic Games Top Sellers: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            // Clean up browser resources
            if (page) {
                try {
                    await page.close();
                } catch (error) {
                    console.warn('Error closing page:', error);
                }
            }
            if (browser) {
                try {
                    await browser.close();
                } catch (error) {
                    console.warn('Error closing browser:', error);
                }
            }
        }
    }
}