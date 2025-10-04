/**
 * Scraping routes
 * Handles all scraping-related API endpoints
 */

import { Request, Response, Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { scrapingService } from '../services/scrapingService';
import { ScrapingRequest, ScrapingResponse } from '../types';

const router = Router();

/**
 * Get available scraping sources
 * @route GET /api/scraping/sources
 * @returns List of available scraping sources
 */
router.get('/sources', asyncHandler(async (req: Request, res: Response) => {
    const sources = await scrapingService.getAvailableSources();

    res.json({
        success: true,
        data: sources,
        message: 'Scraping sources retrieved successfully',
        timestamp: new Date().toISOString()
    });
}));

/**
 * Scrape data from a specific source
 * @route POST /api/scraping/scrape
 * @param body - Scraping request parameters
 * @returns Scraped data in requested format
 */
router.post('/scrape', asyncHandler(async (req: Request, res: Response) => {
    const scrapingRequest: ScrapingRequest = req.body;

    // Validate request
    if (!scrapingRequest.source || !scrapingRequest.format) {
        res.status(400).json({
            success: false,
            error: 'Missing required fields',
            message: 'Source and format are required',
            timestamp: new Date().toISOString()
        });
        return;
    }

    const startTime = Date.now();

    try {
        const result = await scrapingService.scrapeData(scrapingRequest);
        const duration = Date.now() - startTime;

        const response: ScrapingResponse = {
            success: true,
            data: result.data,
            metadata: {
                source: scrapingRequest.source,
                format: scrapingRequest.format,
                timestamp: new Date().toISOString(),
                duration,
                recordCount: result.recordCount
            }
        };

        res.json(response);
    } catch (error) {
        const duration = Date.now() - startTime;

        const response: ScrapingResponse = {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            metadata: {
                source: scrapingRequest.source,
                format: scrapingRequest.format,
                timestamp: new Date().toISOString(),
                duration
            }
        };

        res.status(500).json(response);
    }
}));

/**
 * Get scraping status/history
 * @route GET /api/scraping/status
 * @returns Current scraping status and recent activity
 */
router.get('/status', asyncHandler(async (req: Request, res: Response) => {
    const status = await scrapingService.getScrapingStatus();

    res.json({
        success: true,
        data: status,
        message: 'Scraping status retrieved successfully',
        timestamp: new Date().toISOString()
    });
}));

/**
 * Test scraping endpoint (for development)
 * @route POST /api/scraping/test
 * @param body - Test scraping parameters
 * @returns Test scraping result
 */
router.post('/test', asyncHandler(async (req: Request, res: Response) => {
    const testRequest = {
        source: 'test',
        format: 'json' as const,
        options: { limit: 5 }
    };

    const result = await scrapingService.scrapeData(testRequest);

    res.json({
        success: true,
        data: result,
        message: 'Test scraping completed successfully',
        timestamp: new Date().toISOString()
    });
}));

export default router;
