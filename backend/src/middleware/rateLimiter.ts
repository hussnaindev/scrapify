/**
 * Rate limiting middleware
 * Prevents abuse by limiting the number of requests per IP address
 */

import { NextFunction, Request, Response } from 'express';

// Simple in-memory rate limiter
const requestCounts = new Map<string, { count: number; resetTime: number }>();

const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'); // 1 minute
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');

/**
 * Rate limiting middleware
 * Limits requests per IP address within a time window
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const rateLimiter = (req: Request, res: Response, next: NextFunction): void => {
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();

    // Get or create client record
    let clientRecord = requestCounts.get(clientIP);

    if (!clientRecord || now > clientRecord.resetTime) {
        // Reset or create new record
        clientRecord = {
            count: 1,
            resetTime: now + WINDOW_MS
        };
        requestCounts.set(clientIP, clientRecord);
    } else {
        // Increment count
        clientRecord.count++;
    }

    // Check if limit exceeded
    if (clientRecord.count > MAX_REQUESTS) {
        res.status(429).json({
            success: false,
            error: 'Too many requests',
            message: `Rate limit exceeded. Maximum ${MAX_REQUESTS} requests per ${WINDOW_MS / 1000} seconds.`,
            retryAfter: Math.ceil((clientRecord.resetTime - now) / 1000),
            timestamp: new Date().toISOString()
        });
        return;
    }

    // Add rate limit headers
    res.set({
        'X-RateLimit-Limit': MAX_REQUESTS.toString(),
        'X-RateLimit-Remaining': Math.max(0, MAX_REQUESTS - clientRecord.count).toString(),
        'X-RateLimit-Reset': new Date(clientRecord.resetTime).toISOString()
    });

    next();
};

/**
 * Cleanup old entries from memory periodically
 * Runs every 5 minutes to prevent memory leaks
 */
setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of requestCounts.entries()) {
        if (now > record.resetTime) {
            requestCounts.delete(ip);
        }
    }
}, 5 * 60 * 1000); // 5 minutes
