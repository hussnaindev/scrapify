import type { VercelRequest, VercelResponse } from '@vercel/node';
import { scrapingService } from '../src/services/scrapingService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const sources = await scrapingService.getAvailableSources();
        res.json({
            success: true,
            data: sources,
            message: 'Scraping sources retrieved successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}