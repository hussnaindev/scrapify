/**
 * API utility functions for communicating with the Scrapify backend
 */

import axios, { AxiosResponse } from 'axios';
import {
    ApiResponse,
    HealthCheckResponse,
    ScrapingRequest,
    ScrapingResponse,
    ScrapingSource,
    ScrapingStatus
} from '../types';

// API base configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';


// Create axios instance with default configuration
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30 seconds
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
    (config) => {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error('❌ API Response Error:', error.response?.data || error.message);

        // Handle common error cases
        if (error.response?.status === 429) {
            throw new Error('Too many requests. Please try again later.');
        } else if (error.response?.status === 500) {
            throw new Error('Server error. Please try again later.');
        } else if (error.code === 'ECONNABORTED') {
            throw new Error('Request timeout. Please try again.');
        } else if (!error.response) {
            throw new Error('Network error. Please check your connection.');
        }

        throw error;
    }
);

/**
 * Health check API functions
 */
export const healthApi = {
    /**
     * Get system health status
     * @returns Promise<HealthCheckResponse>
     */
    getHealth: async (): Promise<HealthCheckResponse> => {
        const response: AxiosResponse<ApiResponse<HealthCheckResponse>> =
            await apiClient.get('/health');
        return response.data.data!;
    },

    /**
     * Get detailed system information
     * @returns Promise<any>
     */
    getDetailedHealth: async (): Promise<any> => {
        const response: AxiosResponse<ApiResponse> =
            await apiClient.get('/health/detailed');
        return response.data.data;
    },
};

/**
 * Scraping API functions
 */
export const scrapingApi = {
    /**
     * Get available scraping sources
     * @returns Promise<ScrapingSource[]>
     */
    getSources: async (): Promise<ScrapingSource[]> => {
        const response: AxiosResponse<ApiResponse<ScrapingSource[]>> =
            await apiClient.get('/scraping/sources');
        return response.data.data!;
    },

    /**
     * Scrape data from a specific source
     * @param request - Scraping request parameters
     * @returns Promise<ScrapingResponse>
     */
    scrapeData: async (request: ScrapingRequest): Promise<ScrapingResponse> => {
        const response: AxiosResponse<ScrapingResponse> =
            await apiClient.post('/scraping/scrape', request);
        return response.data;
    },

    /**
     * Get scraping status and history
     * @returns Promise<ScrapingStatus>
     */
    getStatus: async (): Promise<ScrapingStatus> => {
        const response: AxiosResponse<ApiResponse<ScrapingStatus>> =
            await apiClient.get('/scraping/status');
        return response.data.data!;
    },

    /**
     * Test scraping endpoint
     * @returns Promise<any>
     */
    testScraping: async (): Promise<any> => {
        const response: AxiosResponse<ApiResponse> =
            await apiClient.post('/scraping/test');
        return response.data.data;
    },
};

/**
 * Utility function to download data as a file
 * @param data - Data to download
 * @param filename - Name of the file
 * @param format - File format (json, csv, xml)
 */
export const downloadData = (
    data: any,
    filename: string,
    format: 'json' | 'csv' | 'xml'
): void => {
    let content: string;
    let mimeType: string;
    let extension: string;

    switch (format) {
        case 'json':
            content = JSON.stringify(data, null, 2);
            mimeType = 'application/json';
            extension = 'json';
            break;
        case 'csv':
            content = typeof data === 'string' ? data : JSON.stringify(data);
            mimeType = 'text/csv';
            extension = 'csv';
            break;
        case 'xml':
            content = typeof data === 'string' ? data : JSON.stringify(data);
            mimeType = 'application/xml';
            extension = 'xml';
            break;
        default:
            content = JSON.stringify(data, null, 2);
            mimeType = 'application/json';
            extension = 'json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
};

/**
 * Utility function to copy data to clipboard
 * @param data - Data to copy
 * @param format - Data format
 * @returns Promise<boolean>
 */
export const copyToClipboard = async (
    data: any,
    format: 'json' | 'csv' | 'xml'
): Promise<boolean> => {
    try {
        let content: string;

        switch (format) {
            case 'json':
                content = JSON.stringify(data, null, 2);
                break;
            case 'csv':
                content = typeof data === 'string' ? data : JSON.stringify(data);
                break;
            case 'xml':
                content = typeof data === 'string' ? data : JSON.stringify(data);
                break;
            default:
                content = JSON.stringify(data, null, 2);
        }

        await navigator.clipboard.writeText(content);
        return true;
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
    }
};

export default apiClient;
