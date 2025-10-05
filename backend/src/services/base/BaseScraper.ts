/**
 * Base Scraper Interface
 * Defines the contract that all scrapers must implement
 */

export interface ScraperConfig {
    id: string;
    name: string;
    description: string;
    url: string;
    enabled: boolean;
    supportedFormats: ('json' | 'csv' | 'xml')[];
    defaultFormat: 'json' | 'csv' | 'xml';
    estimatedRecords?: number;
    timeout?: number;
    headers?: Record<string, string>;
    // Puppeteer-specific options
    usePuppeteer?: boolean;
    puppeteerOptions?: {
        headless?: boolean;
        args?: string[];
        viewport?: {
            width: number;
            height: number;
        };
    };
}

export interface ScrapingOptions {
    limit?: number;
    timeout?: number;
    headers?: Record<string, string>;
}

export interface ScraperResult {
    data: any;
    recordCount: number;
    metadata?: {
        duration?: number;
        url?: string;
        timestamp?: string;
    };
}

/**
 * Base Scraper Class
 * Provides common functionality for all scrapers
 */
export abstract class BaseScraper {
    protected config: ScraperConfig;

    constructor(config: ScraperConfig) {
        this.config = config;
    }

    /**
     * Get scraper configuration
     */
    getConfig(): ScraperConfig {
        return this.config;
    }

    /**
     * Check if scraper supports the given format
     */
    supportsFormat(format: string): boolean {
        return this.config.supportedFormats.includes(format as any);
    }

    /**
     * Main scraping method that all scrapers must implement
     */
    abstract scrape(options?: ScrapingOptions): Promise<ScraperResult>;

    /**
     * Validate scraping options
     */
    protected validateOptions(options?: ScrapingOptions): void {
        if (options?.limit && options.limit < 1) {
            throw new Error('Limit must be greater than 0');
        }
    }

    /**
     * Apply default options and merge with provided options
     */
    protected getMergedOptions(options?: ScrapingOptions): ScrapingOptions {
        return {
            timeout: this.config.timeout || 30000,
            headers: { ...this.config.headers, ...options?.headers },
            ...options
        };
    }

    /**
     * Apply limit to results if specified
     */
    protected applyLimit<T>(data: T[], limit?: number): T[] {
        if (limit && limit > 0) {
            return data.slice(0, limit);
        }
        return data;
    }

    /**
     * Format data based on requested format
     */
    formatData(data: any, format: string): any {
        switch (format) {
            case 'csv':
                return this.convertToCSV(data);
            case 'xml':
                return this.convertToXML(data);
            case 'json':
            default:
                return data;
        }
    }

    /**
     * Convert data to CSV format
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
}