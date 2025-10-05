/**
 * TypeScript type definitions for Scrapify Frontend
 */

// Scraping source types
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

// Scraping request types
export interface ScrapingRequest {
    source: string;
    format: 'json' | 'csv' | 'xml';
    options?: {
        limit?: number;
        timeout?: number;
        headers?: Record<string, string>;
    };
}

// Scraping response types
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

// Scraping status types
export interface ScrapingStatus {
    activeSources: number;
    totalScrapes: number;
    recentActivity: ScrapingActivity[];
    systemHealth: 'healthy' | 'warning' | 'error';
}

export interface ScrapingActivity {
    id: string;
    source: string;
    format: string;
    timestamp: string;
    duration: number;
    recordCount: number;
    success: boolean;
}

// UI state types
export interface LoadingState {
    isLoading: boolean;
    message?: string;
}

export interface ErrorState {
    hasError: boolean;
    message?: string;
    details?: string;
}

// Component prop types
export interface ScrapingCardProps {
    source: ScrapingSource;
    onScrape: (source: ScrapingSource, format: string, limit?: number) => void | Promise<void>;
    isLoading?: boolean;
}

export interface FormatSelectorProps {
    formats: ('json' | 'csv' | 'xml')[];
    selectedFormat: string;
    onFormatChange: (format: string) => void;
    disabled?: boolean;
}

// Theme types
export type Theme = 'light' | 'dark';

// Notification types
export interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number;
    timestamp: string;
}

export interface NewsApiTopHeadlinesResponse {
    status: string;
    totalResults: number;
    articles: any[];
}

// Spotify Most Followed Artists types
export interface SpotifyArtist {
    rank: number;
    position: string;
    image: string;
    artist: string;
    followers: string;
    dailyChange: string;
    weeklyChange: string;
    spotifyId: string;
    gender: string;
    genre: string;
    country: string;
    language: string;
}

// Epic Games Top Sellers types
export interface EpicGame {
    name: string;
    price: string;
    discountPercentage: string;
    discountedPrice: string;
    link: string;
    rank?: number;
}