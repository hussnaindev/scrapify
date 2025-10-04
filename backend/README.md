# Scrapify Backend

The backend API server for the Scrapify data scraping dashboard.

## Overview

This is a Node.js Express server built with TypeScript that provides RESTful APIs for data scraping operations. It includes comprehensive error handling, rate limiting, security middleware, and a modular architecture.

## Architecture

### Core Components

- **Express Server** (`src/index.ts`) - Main server entry point
- **Middleware** (`src/middleware/`) - Custom middleware for error handling and rate limiting
- **Routes** (`src/routes/`) - API route handlers
- **Services** (`src/services/`) - Business logic and data processing
- **Types** (`src/types/`) - TypeScript type definitions

### Key Features

- **TypeScript** - Full type safety and IntelliSense support
- **Security** - Helmet for security headers, CORS configuration
- **Rate Limiting** - In-memory rate limiting to prevent abuse
- **Error Handling** - Comprehensive error handling with proper HTTP status codes
- **Logging** - Morgan for HTTP request logging
- **Health Checks** - System health monitoring endpoints

## API Endpoints

### Health Endpoints

#### GET `/api/health`
Returns basic system health information.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "uptime": 123.45,
    "timestamp": "2024-01-15T10:00:00Z",
    "version": "1.0.0",
    "environment": "development",
    "memory": {
      "used": 45,
      "total": 128,
      "percentage": 35
    }
  }
}
```

#### GET `/api/health/detailed`
Returns detailed system information including process details, memory usage, and CPU information.

### Scraping Endpoints

#### GET `/api/scraping/sources`
Returns all available scraping sources.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "bullish-markets",
      "name": "Top 100 Bullish Markets",
      "description": "Scrape the top 100 bullish cryptocurrency markets",
      "url": "https://api.example.com/bullish-markets",
      "enabled": true,
      "supportedFormats": ["json", "csv"],
      "defaultFormat": "json",
      "estimatedRecords": 100
    }
  ]
}
```

#### POST `/api/scraping/scrape`
Initiates a scraping operation for a specific source.

**Request Body:**
```json
{
  "source": "bullish-markets",
  "format": "json",
  "options": {
    "limit": 10,
    "timeout": 30000
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "symbol": "BTC",
      "price": 45000,
      "change": "+5.2%",
      "volume": "2.1B"
    }
  ],
  "metadata": {
    "source": "bullish-markets",
    "format": "json",
    "timestamp": "2024-01-15T10:00:00Z",
    "duration": 1250,
    "recordCount": 5
  }
}
```

#### GET `/api/scraping/status`
Returns scraping system status and recent activity.

#### POST `/api/scraping/test`
Test endpoint for development and debugging.

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment mode | `development` |
| `FRONTEND_URL` | CORS allowed origin | `http://localhost:3000` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in milliseconds | `60000` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |
| `SCRAPING_TIMEOUT` | Default scraping timeout | `30000` |
| `MAX_CONCURRENT_SCRAPES` | Max concurrent scraping operations | `5` |
| `LOG_LEVEL` | Logging level | `info` |

### Example .env File

```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
SCRAPING_TIMEOUT=30000
MAX_CONCURRENT_SCRAPES=5
LOG_LEVEL=info
```

## Development

### Prerequisites

- Node.js v18 or higher
- npm or yarn

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

### Project Structure

```
src/
├── index.ts              # Main server entry point
├── types/
│   └── index.ts          # TypeScript type definitions
├── middleware/
│   ├── errorHandler.ts   # Global error handling
│   └── rateLimiter.ts    # Rate limiting middleware
├── routes/
│   ├── health.ts         # Health check routes
│   └── scraping.ts       # Scraping API routes
└── services/
    └── scrapingService.ts # Core scraping logic
```

## Error Handling

The server includes comprehensive error handling:

- **Global Error Handler** - Catches all unhandled errors
- **Async Error Wrapper** - Handles async route errors
- **HTTP Status Codes** - Proper status codes for different error types
- **Error Logging** - Detailed error logging with context
- **Client-Friendly Messages** - Sanitized error messages for clients

### Error Response Format

```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2024-01-15T10:00:00Z"
}
```

## Rate Limiting

The server implements in-memory rate limiting:

- **Window-based** - Sliding window rate limiting
- **IP-based** - Rate limiting per IP address
- **Configurable** - Adjustable limits via environment variables
- **Headers** - Rate limit information in response headers

### Rate Limit Headers

- `X-RateLimit-Limit` - Maximum requests per window
- `X-RateLimit-Remaining` - Remaining requests in current window
- `X-RateLimit-Reset` - Window reset time

## Security

Security measures implemented:

- **Helmet** - Security headers (XSS protection, HSTS, etc.)
- **CORS** - Cross-origin resource sharing configuration
- **Rate Limiting** - Protection against abuse
- **Input Validation** - Request validation and sanitization
- **Error Sanitization** - Sensitive information filtering

## Monitoring

### Health Checks

The server provides comprehensive health monitoring:

- **Basic Health** - System status and memory usage
- **Detailed Health** - Process information, CPU usage, environment details
- **Uptime Tracking** - Server uptime monitoring

### Logging

- **Morgan** - HTTP request logging
- **Console Logging** - Development and error logging
- **Structured Logging** - JSON-formatted logs for production

## Production Deployment

### Building

```bash
npm run build
```

### Running

```bash
npm start
```

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["npm", "start"]
```

## Testing

### Manual Testing

Use the provided test endpoint:

```bash
curl -X POST http://localhost:3001/api/scraping/test
```

### API Testing

Test all endpoints using curl or Postman:

```bash
# Health check
curl http://localhost:3001/api/health

# Get sources
curl http://localhost:3001/api/scraping/sources

# Scrape data
curl -X POST http://localhost:3001/api/scraping/scrape \
  -H "Content-Type: application/json" \
  -d '{"source": "test", "format": "json"}'
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Change the PORT in .env file
   - Kill existing processes on port 3001

2. **CORS Errors**
   - Verify FRONTEND_URL in .env matches your frontend URL
   - Check browser console for CORS error details

3. **Rate Limit Exceeded**
   - Wait for the rate limit window to reset
   - Increase RATE_LIMIT_MAX_REQUESTS if needed

4. **Memory Issues**
   - Monitor memory usage via health endpoints
   - Restart server if memory usage is high

### Debug Mode

Set `NODE_ENV=development` for detailed error messages and logging.

## Contributing

1. Follow TypeScript best practices
2. Add proper error handling
3. Include JSDoc comments for functions
4. Test all endpoints manually
5. Update this documentation for new features

## License

MIT License - see LICENSE file for details.
