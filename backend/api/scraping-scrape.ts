import type { VercelRequest, VercelResponse } from '@vercel/node';
import { scrapingService } from '../src/services/scrapingService';
import { ScrapingRequest } from '../src/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const scrapingRequest: ScrapingRequest = req.body;

        if (!scrapingRequest.source || !scrapingRequest.format) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields',
                message: 'Source and format are required'
            });
        }

        const result = await scrapingService.scrapeData(scrapingRequest);

        res.json({
            success: true,
            data: result.data,
            metadata: {
                source: scrapingRequest.source,
                format: scrapingRequest.format,
                timestamp: new Date().toISOString(),
                duration: 0, // You can add timing here
                recordCount: result.recordCount
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            metadata: {
                source: req.body?.source,
                format: req.body?.format,
                timestamp: new Date().toISOString(),
                duration: 0
            }
        });
    }
}