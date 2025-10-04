/**
 * Health check routes
 * Provides system health status and monitoring endpoints
 */

import { Request, Response, Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { HealthCheckResponse } from '../types';

const router = Router();

/**
 * Get system health status
 * @route GET /api/health
 * @returns Health status information
 */
router.get('/', asyncHandler(async (req: Request, res: Response) => {
    const memoryUsage = process.memoryUsage();
    const totalMemory = memoryUsage.heapTotal;
    const usedMemory = memoryUsage.heapUsed;
    const memoryPercentage = Math.round((usedMemory / totalMemory) * 100);

    const healthData: HealthCheckResponse = {
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        memory: {
            used: Math.round(usedMemory / 1024 / 1024), // MB
            total: Math.round(totalMemory / 1024 / 1024), // MB
            percentage: memoryPercentage
        }
    };

    res.json({
        success: true,
        data: healthData,
        message: 'System is healthy',
        timestamp: new Date().toISOString()
    });
}));

/**
 * Get detailed system information
 * @route GET /api/health/detailed
 * @returns Detailed system information
 */
router.get('/detailed', asyncHandler(async (req: Request, res: Response) => {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    const detailedInfo = {
        process: {
            pid: process.pid,
            uptime: process.uptime(),
            version: process.version,
            platform: process.platform,
            arch: process.arch
        },
        memory: {
            rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
            heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
            heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
            external: Math.round(memoryUsage.external / 1024 / 1024), // MB
            arrayBuffers: Math.round(memoryUsage.arrayBuffers / 1024 / 1024) // MB
        },
        cpu: {
            user: cpuUsage.user,
            system: cpuUsage.system
        },
        environment: {
            nodeEnv: process.env.NODE_ENV || 'development',
            port: process.env.PORT || 3001,
            corsOrigin: process.env.FRONTEND_URL || 'http://localhost:3000'
        }
    };

    res.json({
        success: true,
        data: detailedInfo,
        message: 'Detailed system information retrieved',
        timestamp: new Date().toISOString()
    });
}));

export default router;
