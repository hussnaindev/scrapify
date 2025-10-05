/**
 * Scraping Service - Updated for Scalability
 * Uses the new scraper registry architecture
 */

import { ScrapingRequest, ScrapingSource } from '../types';
import { ScraperRegistry } from './scrapers/ScraperRegistry';

class ScrapingService {
    private scrapingHistory: Array<{
        id: string;
        source: string;
        format: string;
        timestamp: string;
        duration: number;
        recordCount: number;
        success: boolean;
    }> = [];

    constructor() {
        // Initialize all scrapers on service startup
        ScraperRegistry.initializeScrapers();
    }

    /**
     * Get all available scraping sources
     * @returns Array of available scraping sources
     */
    async getAvailableSources(): Promise<ScrapingSource[]> {
        const configs = ScraperRegistry.getAllConfigs();

        return configs.map(config => ({
            id: config.id,
            name: config.name,
            description: config.description,
            url: config.url,
            enabled: config.enabled,
            supportedFormats: config.supportedFormats,
            defaultFormat: config.defaultFormat,
            estimatedRecords: config.estimatedRecords
        }));
    }

    /**
     * Scrape data from a specific source
     * @param request - Scraping request parameters
     * @returns Scraped data and metadata
     */
    async scrapeData(request: ScrapingRequest): Promise<{
        data: any;
        recordCount: number;
    }> {
        const scraper = ScraperRegistry.getScraper(request.source);

        if (!scraper) {
            throw new Error(`Scraping source '${request.source}' not found`);
        }

        if (!scraper.supportsFormat(request.format)) {
            throw new Error(`Format '${request.format}' not supported for source '${request.source}'`);
        }

        const startTime = Date.now();
        let scrapedData: any;
        let recordCount: number;

        try {
            // Use the scraper to get raw data
            const result = await scraper.scrape(request.options);
            scrapedData = result.data;
            recordCount = result.recordCount;

            // Format data according to request
            const formattedData = scraper.formatData(scrapedData, request.format);

            // Log successful scraping activity
            this.logScrapingActivity(request.source, request.format, recordCount, true, Date.now() - startTime);

            return {
                data: formattedData,
                recordCount
            };

        } catch (error) {
            // Log failed scraping activity
            this.logScrapingActivity(request.source, request.format, 0, false, Date.now() - startTime);
            throw error;
        }
    }

    /**
     * Get current scraping status and history
     * @returns Scraping status information
     */
    async getScrapingStatus(): Promise<{
        activeSources: number;
        totalScrapes: number;
        recentActivity: any[];
        systemHealth: 'healthy' | 'warning' | 'error';
    }> {
        const activeSources = ScraperRegistry.getAllConfigs().length;
        const totalScrapes = this.scrapingHistory.length;
        const recentActivity = this.scrapingHistory.slice(-10).reverse();

        return {
            activeSources,
            totalScrapes,
            recentActivity,
            systemHealth: 'healthy'
        };
    }

    /**
     * Log scraping activity
     * @param source - Scraping source
     * @param format - Output format
     * @param recordCount - Number of records scraped
     * @param success - Whether scraping was successful
     * @param duration - Duration of the scraping operation
     */
    private logScrapingActivity(
        source: string,
        format: string,
        recordCount: number,
        success: boolean,
        duration: number
    ): void {
        this.scrapingHistory.push({
            id: `scrape_${Date.now()}`,
            source,
            format,
            timestamp: new Date().toISOString(),
            duration,
            recordCount,
            success
        });

        // Keep only last 100 entries
        if (this.scrapingHistory.length > 100) {
            this.scrapingHistory = this.scrapingHistory.slice(-100);
        }
    }
}

export const scrapingService = new ScrapingService();