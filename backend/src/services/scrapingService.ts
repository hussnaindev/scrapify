/**
 * Scraping Service
 * Handles the core scraping logic and data processing
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { GitHubMostStarredApiResponse, ScrapingRequest, ScrapingSource, TuringJob } from '../types';

class ScrapingService {
    private scrapingSources: ScrapingSource[] = [
        {
            id: 'bullish-markets',
            name: 'Top 100 Bullish Markets',
            description: 'Scrape cryptocurrency markets from Bullish.com with 24h volume data',
            url: 'https://www.bullish.com/embeds/markets-table-embeddable',
            enabled: true,
            supportedFormats: ['json', 'csv'],
            defaultFormat: 'json',
            estimatedRecords: 150
        },
        {
            id: 'github-most-starred',
            name: 'GitHub Most Starred Repositories',
            description: 'Scrape trending repositories from GitHub',
            url: 'https://github.com/search/repositories?q=stars%3A%3E1000&o=desc&s=stars',
            enabled: true,
            supportedFormats: ['json', 'csv'],
            defaultFormat: 'json',
            estimatedRecords: 25
        },

        {
            id: 'turing-remote-jobs',
            name: 'Turing Remote Jobs',
            description: 'Scrape remote job listings from Turing.com',
            url: 'https://turing.com/api/remote-jobs?sortBy=publishedOnJobBoard,desc&limit=1000&offset=0&locale=en',
            enabled: true,
            supportedFormats: ['json', 'csv'],
            defaultFormat: 'json',
            estimatedRecords: 1000
        },
        {
            id: 'quickbooks-pricing',
            name: 'QuickBooks Pricing',
            description: 'Scrape QuickBooks pricing plans and offers',
            url: 'https://quickbooks.intuit.com/qbmds-data/us/billing_offers_us.json?v4=5',
            enabled: true,
            supportedFormats: ['json', 'csv'],
            defaultFormat: 'json',
            estimatedRecords: 4
        },
        {
            id: 'news-headlines',
            name: 'Latest News Headlines',
            description: 'Scrape latest news headlines from major sources',
            url: 'https://newsapi.org/v2/top-headlines',
            enabled: true,
            supportedFormats: ['json', 'csv', 'xml'],
            defaultFormat: 'json',
            estimatedRecords: 20
        },
        {
            id: 'amazon-bestsellers',
            name: 'Amazon Bestsellers',
            description: 'Scrape Amazon bestseller products across categories',
            url: 'https://www.amazon.com/bestsellers',
            enabled: true,
            supportedFormats: ['json', 'csv'],
            defaultFormat: 'json',
            estimatedRecords: 50
        },
    ];

    private scrapingHistory: Array<{
        id: string;
        source: string;
        format: string;
        timestamp: string;
        duration: number;
        recordCount: number;
        success: boolean;
    }> = [];

    /**
     * Get all available scraping sources
     * @returns Array of available scraping sources
     */
    async getAvailableSources(): Promise<ScrapingSource[]> {
        return this.scrapingSources.filter(source => source.enabled);
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
        const source = this.scrapingSources.find(s => s.id === request.source);

        if (!source) {
            throw new Error(`Scraping source '${request.source}' not found`);
        }

        if (!source.supportedFormats.includes(request.format)) {
            throw new Error(`Format '${request.format}' not supported for source '${request.source}'`);
        }

        // Simulate scraping based on source type
        let scrapedData: any;

        switch (request.source) {
            case 'bullish-markets':
                scrapedData = await this.scrapeBullishMarkets(request.options);
                break;
            case 'amazon-bestsellers':
                scrapedData = await this.scrapeAmazonBestsellers(request.options);
                break;
            case 'github-most-starred':
                scrapedData = await this.scrapeGitHubMostStarred(request.options);
                break;
            case 'news-headlines':
                scrapedData = await this.scrapeNewsHeadlines(request.options);
                break;
            case 'turing-remote-jobs':
                scrapedData = await this.scrapeTuringJobs(request.options);
                break;
            case 'quickbooks-pricing':
                scrapedData = await this.scrapeQuickBooksPricing(request.options);
                break;
            case 'test':
                scrapedData = await this.scrapeTestData(request.options);
                break;
            default:
                throw new Error(`Scraping logic not implemented for source '${request.source}'`);
        }

        // Format data according to request
        const formattedData = this.formatData(scrapedData, request.format);
        const recordCount = Array.isArray(scrapedData) ? scrapedData.length : 1;

        // Log scraping activity
        this.logScrapingActivity(request.source, request.format, recordCount, true);

        return {
            data: formattedData,
            recordCount
        };
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
        const activeSources = this.scrapingSources.filter(s => s.enabled).length;
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
     * Scrape bullish markets data from Bullish.com
     * @param options - Scraping options
     * @returns Real bullish markets data
     */
    private async scrapeBullishMarkets(options?: any): Promise<any[]> {
        try {
            // Fetch the markets table page from Bullish.com
            const response = await axios.get(
                'https://www.bullish.com/embeds/markets-table-embeddable?5abd7e47_page=2',
                {
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                        'Accept-Language': 'en-US,en;q=0.5',
                        'Accept-Encoding': 'gzip, deflate, br',
                        'Connection': 'keep-alive',
                        'Upgrade-Insecure-Requests': '1'
                    }
                }
            );

            const $ = cheerio.load(response.data);

            // Find all market elements
            const markets = $('[market-table-symbol]');
            const totalMarkets = markets.length;

            if (totalMarkets < 20) {
                throw new Error('Not enough markets found on Bullish.com');
            }

            // Get total volume for 24 hours
            const totalVolume24Hrs = $('[class="volumes-table-row w-dyn-items"] [market-table-value="total-volume"]')
                .first()
                .text()
                .trim();

            const marketsData: any[] = [];

            // Parse each market
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

            // Apply limit if specified
            const limit = options?.limit || marketsData.length;
            console.log(marketsData.length);
            console.log(limit);
            return marketsData.slice(0, limit || marketsData.length);

        } catch (error) {
            console.error('Error scraping Bullish markets:', error);
            return []
        }
    }

    /**
     * Scrape Amazon bestsellers data (placeholder implementation)
     * @param options - Scraping options
     * @returns Mock Amazon bestsellers data
     */
    private async scrapeAmazonBestsellers(options?: any): Promise<any[]> {
        return [
            { title: 'Wireless Headphones', price: '$29.99', rating: 4.5, category: 'Electronics' },
            { title: 'Coffee Maker', price: '$89.99', rating: 4.2, category: 'Kitchen' },
            { title: 'Yoga Mat', price: '$24.99', rating: 4.7, category: 'Sports' },
            { title: 'Bluetooth Speaker', price: '$39.99', rating: 4.3, category: 'Electronics' },
            { title: 'Water Bottle', price: '$19.99', rating: 4.6, category: 'Sports' }
        ].slice(0, options?.limit || 5);
    }

    /**
     * Scrape GitHub most starred repositories (placeholder implementation)
     * @param options - Scraping options
     * @returns Mock GitHub most starred data
     */
    private async scrapeGitHubMostStarred(options?: any): Promise<any[]> {
        if (!options?.limit || options?.limit > 100) {
            options.limit = 100;
        }
        const response = await axios.get<GitHubMostStarredApiResponse>(`https://api.github.com/search/repositories?q=stars%3A%3E1000&o=desc&s=stars&per_page=${options?.limit}`);
        const data = response.data;
        const repositories = data.items;
        return repositories.map((repo) => ({
            id: repo.id,
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description,
            stars: repo.stargazers_count,
            url: repo.html_url,
            language: repo.language,
            owner: repo.owner.login,
            topics: repo.topics,
        }));
    }

    /**
     * Scrape news headlines (placeholder implementation)
     * @param options - Scraping options
     * @returns Mock news headlines data
     */
    private async scrapeNewsHeadlines(options?: any): Promise<any[]> {
        // This is a placeholder; real implementation would use NewsApiTopHeadlinesResponse
        // and fetch from NewsAPI with a valid API key
        return [
            { title: 'Tech Innovation Breakthrough', source: 'TechNews', publishedAt: '2024-01-15T10:00:00Z' },
            { title: 'Market Analysis Report', source: 'FinanceToday', publishedAt: '2024-01-15T09:30:00Z' },
            { title: 'Climate Change Update', source: 'EcoNews', publishedAt: '2024-01-15T08:45:00Z' },
            { title: 'Sports Championship Results', source: 'SportsDaily', publishedAt: '2024-01-15T07:20:00Z' },
            { title: 'Health Research Findings', source: 'HealthWeekly', publishedAt: '2024-01-15T06:15:00Z' }
        ].slice(0, options?.limit || 5);
    }

    /**
     * Scrape remote jobs from Turing.com
     * @param options - Scraping options
     * @returns Array of remote jobs
     */
    private async scrapeTuringJobs(options?: any): Promise<any[]> {
        if (!options?.limit || options?.limit > 1000) {
            options.limit = 1000;
        }
        const url = `https://turing.com/api/remote-jobs?sortBy=publishedOnJobBoard,desc&limit=${options?.limit}&offset=0&locale=en`;
        const response = await axios.get<TuringJob[]>(url, {
            timeout: options?.timeout || 30000,
            headers: options?.headers || {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.5',
            }
        });
        const jobs = response.data || [];
        return jobs.map((job: TuringJob) => ({
            jobId: job.jobId,
            createdDate: job.createdDate,
            updatedDate: job.updatedDate,
            industry: job.industry,
            customerWeeklyHourEngagement: job.customerWeeklyHourEngagement,
            publishedOnJobBoard: job.publishedOnJobBoard,
            // skillsExpression: job.skillsExpression.,
            // optionalSkills: job.optionalSkills,
            role: job.role,
            companySize: job.companySize,
            publicTitle: job.publicTitle,
            isActive: job.isActive,
            // jobLanguageContent: job.jobLanguageContent,
            showOnJobBoard: job.showOnJobBoard,
            fulfilmentProbability: job.fulfilmentProbability,
            directApplyUrl: job.directApplyUrl,
            // requiredSkills: job.requiredSkills,
            description: job.description,
        }))
    }



    /**
     * Scrape QuickBooks pricing data
     * @param options - Scraping options
     * @returns Array of QuickBooks pricing plans
     */
    private async scrapeQuickBooksPricing(options?: any): Promise<any[]> {
        try {
            const response = await axios.get(
                'https://quickbooks.intuit.com/qbmds-data/us/billing_offers_us.json?v4=5',
                {
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                        'Accept': 'application/json',
                        'Accept-Language': 'en-US,en;q=0.5',
                        'Accept-Encoding': 'gzip, deflate, br',
                        'Connection': 'keep-alive'
                    }
                }
            );

            const data = response.data;

            // Parse the QuickBooks pricing data similar to the provided logic
            const campaigns = data?.campaigns?.default?.default?.QBO;
            if (!campaigns) {
                throw new Error('Invalid QuickBooks pricing data structure');
            }

            // Extract offer IDs for different QuickBooks plans
            const simpleStartOfferID = campaigns.QBO_SIMPLE_START?.MONTHLY?.PAID?.offer_id;
            const essentialsOfferID = campaigns.QBO_ESSENTIALS?.MONTHLY?.PAID?.offer_id;
            const plusOfferID = campaigns.QBO_PLUS?.MONTHLY?.PAID?.offer_id;
            const advancedOfferID = campaigns.QBO_ADVANCED?.MONTHLY?.PAID?.offer_id;

            const offerIDs = [simpleStartOfferID, essentialsOfferID, plusOfferID, advancedOfferID].filter(Boolean);

            const pricingData: any[] = [];

            for (const offerID of offerIDs) {
                const offer = data.offerDefinitions?.[offerID];
                if (!offer) {
                    console.warn(`Offer not found with ID ${offerID}`);
                    continue;
                }

                // Extract plan name from offer name (e.g., "QBO Simple Start US" -> "Simple Start")
                const offerNameMatch = offer.name?.match(/QBO\s*(.*?)\s*US/);
                const planName = offerNameMatch?.[1];

                if (!planName) {
                    console.warn(`Could not extract plan name from offer: ${offer.name}`);
                    continue;
                }

                // Validate required fields
                if (
                    offer.discountDuration == null ||
                    offer.discountUnit == null ||
                    offer.discountPriceWhole == null
                ) {
                    console.warn(`Missing required offer info for ${planName}`);
                    continue;
                }

                pricingData.push({
                    plan: planName,
                    price: Number(offer.basePrice || 0),
                    discountedPrice: Number(`${offer.discountPriceWhole}.${offer.discountPriceCents || 0}`),
                    category: planName,
                    discountDuration: offer.discountDuration.toString(),
                    discountUnit: offer.discountUnit,
                    offerName: offer.name,
                    offerId: offerID
                });
            }

            if (pricingData.length === 0) {
                throw new Error('No QuickBooks pricing data could be extracted');
            }

            // Apply limit if specified
            const limit = options?.limit || pricingData.length;
            return pricingData.slice(0, limit);

        } catch (error) {
            console.error('Error scraping QuickBooks pricing:', error);
            throw new Error(`Failed to scrape QuickBooks pricing: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }



    /**
     * Scrape test data (for development/testing)
     * @param options - Scraping options
     * @returns Mock test data
     */
    private async scrapeTestData(options?: any): Promise<any[]> {
        return [
            { id: 1, name: 'Test Item 1', value: 'Sample Data 1' },
            { id: 2, name: 'Test Item 2', value: 'Sample Data 2' },
            { id: 3, name: 'Test Item 3', value: 'Sample Data 3' },
            { id: 4, name: 'Test Item 4', value: 'Sample Data 4' },
            { id: 5, name: 'Test Item 5', value: 'Sample Data 5' }
        ].slice(0, options?.limit || 5);
    }

    /**
     * Format data according to requested format
     * @param data - Raw scraped data
     * @param format - Output format (json, csv, xml)
     * @returns Formatted data
     */
    private formatData(data: any, format: string): any {
        switch (format) {
            case 'json':
                return data;
            case 'csv':
                return this.convertToCSV(data);
            case 'xml':
                return this.convertToXML(data);
            default:
                return data;
        }
    }

    /**
     * Convert data to CSV format
     * @param data - Data to convert
     * @returns CSV formatted string
     */
    private convertToCSV(data: any[]): string {
        if (!Array.isArray(data) || data.length === 0) {
            return '';
        }

        const headers = Object.keys(data[0]);
        const csvRows = [headers.join(',')];

        for (const row of data) {
            const values = headers.map(header => {
                const value = row[header];
                return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
            });
            csvRows.push(values.join(','));
        }

        return csvRows.join('\n');
    }

    /**
     * Convert data to XML format
     * @param data - Data to convert
     * @returns XML formatted string
     */
    private convertToXML(data: any[]): string {
        if (!Array.isArray(data)) {
            return `<data>${JSON.stringify(data)}</data>`;
        }

        const xmlRows = data.map((item, index) => {
            const itemXml = Object.entries(item)
                .map(([key, value]) => `<${key}>${value}</${key}>`)
                .join('');
            return `<item id="${index}">${itemXml}</item>`;
        });

        return `<data>${xmlRows.join('')}</data>`;
    }

    /**
     * Log scraping activity
     * @param source - Scraping source
     * @param format - Output format
     * @param recordCount - Number of records scraped
     * @param success - Whether scraping was successful
     */
    private logScrapingActivity(
        source: string,
        format: string,
        recordCount: number,
        success: boolean
    ): void {
        this.scrapingHistory.push({
            id: `scrape_${Date.now()}`,
            source,
            format,
            timestamp: new Date().toISOString(),
            duration: 0, // This would be calculated in real implementation
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
