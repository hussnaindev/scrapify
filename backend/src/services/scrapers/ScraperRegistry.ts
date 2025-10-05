/**
 * Scraper Registry
 * Factory pattern for managing and creating scrapers
 */

import { BaseScraper, ScraperConfig } from '../base/BaseScraper';
import { BullishMarketsScraper } from './BullishMarketsScraper';
import { GitHubMostStarredScraper } from './GitHubMostStarredScraper';
import { QuickBooksPricingScraper } from './QuickBooksPricingScraper';
import { SpotifyMostFollowedScraper } from './SpotifyMostFollowedScraper';
import { TuringJobsScraper } from './TuringJobsScraper';

export class ScraperRegistry {
    private static scrapers: Map<string, BaseScraper> = new Map();
    private static scraperConfigs: Map<string, ScraperConfig> = new Map();

    /**
     * Register a scraper
     */
    static register(scraper: BaseScraper): void {
        const config = scraper.getConfig();
        this.scrapers.set(config.id, scraper);
        this.scraperConfigs.set(config.id, config);
    }

    /**
     * Get a scraper by ID
     */
    static getScraper(id: string): BaseScraper | undefined {
        return this.scrapers.get(id);
    }

    /**
     * Get all available scraper configurations
     */
    static getAllConfigs(): ScraperConfig[] {
        return Array.from(this.scraperConfigs.values()).filter(config => config.enabled);
    }

    /**
     * Get configuration for a specific scraper
     */
    static getConfig(id: string): ScraperConfig | undefined {
        return this.scraperConfigs.get(id);
    }

    /**
     * Check if a scraper is registered
     */
    static hasScraper(id: string): boolean {
        return this.scrapers.has(id);
    }

    /**
     * Initialize all scrapers
     */
    static initializeScrapers(): void {
        // Register all available scrapers
        this.register(new BullishMarketsScraper());
        this.register(new GitHubMostStarredScraper());
        this.register(new TuringJobsScraper());
        this.register(new QuickBooksPricingScraper());
        this.register(new SpotifyMostFollowedScraper());
    }

    /**
     * Get all registered scraper IDs
     */
    static getRegisteredScraperIds(): string[] {
        return Array.from(this.scrapers.keys());
    }
}