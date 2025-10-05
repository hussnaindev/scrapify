/**
 * GitHub Most Starred Scraper
 * Scrapes trending repositories from GitHub
 */

import axios from 'axios';
import { GitHubMostStarredApiResponse } from '../../types';
import { BaseScraper, ScraperConfig, ScraperResult, ScrapingOptions } from '../base/BaseScraper';

export class GitHubMostStarredScraper extends BaseScraper {
    constructor() {
        const config: ScraperConfig = {
            id: 'github-most-starred',
            name: 'GitHub Most Starred Repositories',
            description: 'Scrape trending repositories from GitHub',
            url: 'https://github.com/search/repositories?q=stars%3A%3E1000&o=desc&s=stars',
            enabled: true,
            supportedFormats: ['json', 'csv'],
            defaultFormat: 'json',
            estimatedRecords: 100,
            timeout: 30000,
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Scrapify/1.0'
            }
        };
        super(config);
    }

    async scrape(options?: ScrapingOptions): Promise<ScraperResult> {
        this.validateOptions(options);

        // Apply default limit for GitHub API
        const limit = Math.min(options?.limit || 100, 100);

        try {
            const response = await axios.get<GitHubMostStarredApiResponse>(
                `https://api.github.com/search/repositories?q=stars%3A%3E1000&o=desc&s=stars&per_page=${limit}`,
                {
                    timeout: this.config.timeout,
                    headers: this.config.headers
                }
            );

            const repositories = response.data.items.map((repo) => ({
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

            return {
                data: repositories,
                recordCount: repositories.length,
                metadata: {
                    duration: 0,
                    url: this.config.url,
                    timestamp: new Date().toISOString()
                }
            };

        } catch (error) {
            console.error('Error scraping GitHub repositories:', error);
            throw new Error(`Failed to scrape GitHub repositories: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}