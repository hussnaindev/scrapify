/**
 * TypeScript type definitions for Scrapify Backend
 */

// Scraping request/response types
export interface ScrapingRequest {
    source: string;
    format: 'json' | 'csv' | 'xml';
    options?: {
        limit?: number;
        timeout?: number;
        headers?: Record<string, string>;
    };
}

export interface ScrapingResponse {
    success: boolean;
    data?: any;
    error?: string;
    metadata: {
        source: string;
        format: string;
        timestamp: string;
        duration: number;
        recordCount?: number;
    };
}

// Scraping source configuration
export interface ScrapingSource {
    id: string;
    name: string;
    description: string;
    url: string;
    enabled: boolean;
    supportedFormats: ('json' | 'csv' | 'xml')[];
    defaultFormat: 'json' | 'csv' | 'xml';
    estimatedRecords?: number;
    lastUpdated?: string;
}

// API response wrapper
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    timestamp: string;
}

// Health check response
export interface HealthCheckResponse {
    status: 'healthy' | 'unhealthy';
    uptime: number;
    timestamp: string;
    version: string;
    environment: string;
    memory: {
        used: number;
        total: number;
        percentage: number;
    };
}

// Error types
export interface ApiError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}
