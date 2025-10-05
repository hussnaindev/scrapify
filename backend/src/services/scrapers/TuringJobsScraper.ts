/**
 * Turing Remote Jobs Scraper
 * Scrapes remote job listings from Turing.com
 */

import axios from 'axios';
import { TuringJob } from '../../types';
import { BaseScraper, ScraperConfig, ScraperResult, ScrapingOptions } from '../base/BaseScraper';

export class TuringJobsScraper extends BaseScraper {
    constructor() {
        const config: ScraperConfig = {
            id: 'turing-remote-jobs',
            name: 'Turing Remote Jobs',
            description: 'Scrape remote job listings from Turing.com',
            url: 'https://turing.com/api/remote-jobs?sortBy=publishedOnJobBoard,desc&limit=1000&offset=0&locale=en',
            enabled: true,
            supportedFormats: ['json', 'csv'],
            defaultFormat: 'json',
            estimatedRecords: 1000,
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

        const limit = Math.min(options?.limit || 1000, 1000);

        try {
            const url = `https://turing.com/api/remote-jobs?sortBy=publishedOnJobBoard,desc&limit=${limit}&offset=0&locale=en`;
            const response = await axios.get<TuringJob[]>(url, {
                timeout: this.config.timeout,
                headers: this.config.headers
            });

            const jobs = response.data || [];
            const processedJobs = jobs.map((job: TuringJob) => ({
                jobId: job.jobId,
                createdDate: job.createdDate,
                updatedDate: job.updatedDate,
                industry: job.industry,
                customerWeeklyHourEngagement: job.customerWeeklyHourEngagement,
                publishedOnJobBoard: job.publishedOnJobBoard,
                role: job.role,
                companySize: job.companySize,
                publicTitle: job.publicTitle,
                isActive: job.isActive,
                showOnJobBoard: job.showOnJobBoard,
                fulfilmentProbability: job.fulfilmentProbability,
                directApplyUrl: job.directApplyUrl,
                description: job.description,
            }));

            return {
                data: processedJobs,
                recordCount: processedJobs.length,
                metadata: {
                    duration: 0,
                    url: this.config.url,
                    timestamp: new Date().toISOString()
                }
            };

        } catch (error) {
            console.error('Error scraping Turing jobs:', error);
            throw new Error(`Failed to scrape Turing jobs: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}