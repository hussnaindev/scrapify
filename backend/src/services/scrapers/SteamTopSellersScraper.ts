/**
 * Steam Top Sellers Scraper
 * Scrapes top selling games from Steam store
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { BaseScraper, ScraperConfig, ScraperResult, ScrapingOptions } from '../base/BaseScraper';

interface SteamGame {
    rank: number;
    appId: string;
    title: string;
    url: string;
    imageUrl: string;
    releaseDate: string;
    reviewScore: string;
    reviewPercentage: string;
    reviewCount: string;
    priceFinal: number;
    priceOriginal?: number;
    discountPercentage?: number;
    platforms: string;
    creatorIds: string;
    itemKey: string;
}

interface SteamApiResponse {
    success: number;
    results_html: string;
    total_count: number;
    start: number;
}

export class SteamTopSellersScraper extends BaseScraper {
    constructor() {
        const config: ScraperConfig = {
            id: 'steam-top-sellers',
            name: 'Steam Top Sellers',
            description: 'Scrape top selling games from Steam store',
            url: 'https://store.steampowered.com/search/results/?query&start=0&count=50&dynamic_data=&sort_by=_ASC&supportedlang=english&snr=1_7_7_globaltopsellers_7&filter=globaltopsellers&infinite=1',
            enabled: true,
            supportedFormats: ['json', 'csv'],
            defaultFormat: 'json',
            estimatedRecords: 50,
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.5',
            }
        };
        super(config);
    }

    async scrape(options?: ScrapingOptions): Promise<ScraperResult> {
        this.validateOptions(options);

        const limit = Math.min(options?.limit || 50, 50);
        const startTime = Date.now();

        try {
            const url = `https://store.steampowered.com/search/results/?query&start=0&count=${limit}&dynamic_data=&sort_by=_ASC&supportedlang=english&snr=1_7_7_globaltopsellers_7&filter=globaltopsellers&infinite=1`;

            const response = await axios.get<SteamApiResponse>(url, {
                timeout: this.config.timeout,
                headers: this.config.headers
            });

            if (response.data.success !== 1 || !response.data.results_html) {
                throw new Error('Invalid response from Steam API');
            }

            const games = this.parseHTML(response.data.results_html);
            const processedGames = games.slice(0, limit);

            const duration = Date.now() - startTime;

            return {
                data: processedGames,
                recordCount: processedGames.length,
                metadata: {
                    duration,
                    url: this.config.url,
                    timestamp: new Date().toISOString()
                }
            };

        } catch (error) {
            console.error('Error scraping Steam top sellers:', error);
            throw new Error(`Failed to scrape Steam top sellers: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    private parseHTML(html: string): SteamGame[] {
        const $ = cheerio.load(html);
        const games: SteamGame[] = [];

        // Find all game result rows
        $('a.search_result_row').each((index, element) => {
            const $element = $(element);

            // Extract basic information
            const rank = index + 1;
            const appId = $element.attr('data-ds-appid') || '';
            const itemKey = $element.attr('data-ds-itemkey') || '';
            const url = $element.attr('href') || '';

            // Extract title
            const title = $element.find('span.title').text().trim();

            // Extract image URL
            const imageUrl = $element.find('div.search_capsule img').attr('src') || '';

            // Extract release date
            const releaseDate = $element.find('div.search_released').text().trim();

            // Extract review information
            const reviewElement = $element.find('span.search_review_summary');
            const reviewScore = reviewElement.attr('class')?.replace('search_review_summary ', '') || '';
            const reviewTooltip = reviewElement.attr('data-tooltip-html') || '';

            // Parse review tooltip to extract percentage and count
            let reviewPercentage = '';
            let reviewCount = '';
            if (reviewTooltip) {
                const percentageMatch = reviewTooltip.match(/(\d+)% of the ([\d,]+) user reviews/);
                if (percentageMatch) {
                    reviewPercentage = percentageMatch[1] + '%';
                    reviewCount = percentageMatch[2].replace(/,/g, '');
                }
            }

            // Extract price information
            const priceElement = $element.find('div.search_price_discount_combined');
            const priceFinalAttr = priceElement.attr('data-price-final') || '0';
            const priceFinal = parseInt(priceFinalAttr, 10) / 100; // Convert cents to dollars

            const discountBlock = $element.find('div.discount_block');
            const discountPercentage = discountBlock.attr('data-discount');
            const discountPercentageNum = discountPercentage ? parseInt(discountPercentage, 10) : undefined;

            const originalPriceElement = discountBlock.find('div.discount_original_price');

            let priceOriginal: number | undefined;

            if (originalPriceElement.length > 0) {
                // Has discount
                const originalPriceText = originalPriceElement.text().trim().replace('$', '');
                priceOriginal = parseFloat(originalPriceText);
            }

            // Extract platforms
            const platformsArray: string[] = [];
            $element.find('span.platform_img').each((_, platformEl) => {
                const platformClass = $(platformEl).attr('class') || '';
                if (platformClass.includes('win')) platformsArray.push('Windows');
                else if (platformClass.includes('mac')) platformsArray.push('Mac');
                else if (platformClass.includes('linux')) platformsArray.push('Linux');
            });

            // Check for VR support
            if ($element.find('span.vr_supported').length > 0) {
                platformsArray.push('VR Supported');
            }
            const platforms = platformsArray.join(', ');

            // Extract creator IDs
            const crtrIdsAttr = $element.attr('data-ds-crtrids') || '[]';
            const creatorIdsArray: string[] = [];
            try {
                const crtrIds = JSON.parse(crtrIdsAttr);
                if (Array.isArray(crtrIds)) {
                    creatorIdsArray.push(...crtrIds.map(id => id.toString()));
                }
            } catch (e) {
                // Ignore parsing errors
            }
            const creatorIds = creatorIdsArray.join(', ');

            games.push({
                rank,
                appId,
                title,
                url,
                imageUrl,
                releaseDate,
                reviewScore,
                reviewPercentage,
                reviewCount,
                priceFinal,
                priceOriginal,
                discountPercentage: discountPercentageNum,
                platforms,
                creatorIds,
                itemKey
            });
        });

        return games;
    }
}

