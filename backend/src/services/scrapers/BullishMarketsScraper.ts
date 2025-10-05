/**
 * Bullish Markets Scraper
 * Scrapes cryptocurrency markets from Bullish.com
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { BaseScraper, ScraperConfig, ScraperResult, ScrapingOptions } from '../base/BaseScraper';

export class BullishMarketsScraper extends BaseScraper {
    constructor() {
        const config: ScraperConfig = {
            id: 'bullish-markets',
            name: 'Top 100 Bullish Markets',
            description: 'Scrape cryptocurrency markets from Bullish.com with 24h volume data',
            url: 'https://www.bullish.com/embeds/markets-table-embeddable',
            enabled: true,
            supportedFormats: ['json', 'csv'],
            defaultFormat: 'json',
            estimatedRecords: 150,
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            }
        };
        super(config);
    }

    async scrape(options?: ScrapingOptions): Promise<ScraperResult> {
        this.validateOptions(options);
        const mergedOptions = this.getMergedOptions(options);

        try {
            const response = await axios.get(
                'https://www.bullish.com/embeds/markets-table-embeddable?5abd7e47_page=2',
                {
                    timeout: mergedOptions.timeout,
                    headers: mergedOptions.headers
                }
            );

            const $ = cheerio.load(response.data);
            const markets = $('[market-table-symbol]');
            const totalMarkets = markets.length;

            if (totalMarkets < 20) {
                throw new Error('Not enough markets found on Bullish.com');
            }

            const totalVolume24Hrs = $('[class="volumes-table-row w-dyn-items"] [market-table-value="total-volume"]')
                .first()
                .text()
                .trim();

            const marketsData: any[] = [];

            markets.each((index, market) => {
                try {
                    const marketElement = $(market);
                    const marketName = marketElement.find('.markets-table-name').text().trim();
                    const volume24Hrs = marketElement.find('[market-table-value="24h-volume"]').text().trim();

                    if (marketName && volume24Hrs) {
                        marketsData.push({
                            market: marketName,
                            volume24Hrs: `$${volume24Hrs}`,
                            totalMarkets: totalMarkets,
                            totalVolume24Hrs: `$${totalVolume24Hrs}`,
                            rank: index + 1
                        });
                    }
                } catch (error) {
                    console.warn(`Error parsing market ${index}:`, error);
                }
            });

            if (marketsData.length === 0) {
                throw new Error('No market data could be parsed from Bullish.com');
            }

            const limitedData = this.applyLimit(marketsData, options?.limit);

            return {
                data: limitedData,
                recordCount: limitedData.length,
                metadata: {
                    duration: 0, // Would be calculated in real implementation
                    url: this.config.url,
                    timestamp: new Date().toISOString()
                }
            };

        } catch (error) {
            console.error('Error scraping Bullish markets:', error);
            throw new Error(`Failed to scrape Bullish markets: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}