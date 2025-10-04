# Scrapify

A powerful data scraping dashboard for extracting information from various sources with a single click.

## Features

- **Single-Click Scraping**: Extract data from multiple sources with just one click
- **Multiple Output Formats**: Support for JSON, CSV, and XML formats
- **Modern Dashboard**: Beautiful, responsive UI built with React and Tailwind CSS
- **RESTful API**: Clean, well-documented API endpoints
- **TypeScript**: Full type safety across frontend and backend
- **Real-time Status**: Live updates on scraping progress and system health

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API communication

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **CORS** for cross-origin requests
- **Helmet** for security headers
- **Morgan** for request logging
- **Rate limiting** for API protection

## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd scrapify
   ```

2. **Install dependencies for all packages**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp backend/env.example backend/.env
   
   # Edit the .env file with your configuration
   nano backend/.env
   ```

4. **Start the development servers**
   ```bash
   # Start both frontend and backend concurrently
   npm run dev
   ```

   Or start them separately:
   ```bash
   # Backend (runs on http://localhost:3001)
   npm run dev:backend
   
   # Frontend (runs on http://localhost:3000)
   npm run dev:frontend
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000` to see the dashboard.

## Project Structure

```
scrapify/
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── index.ts        # Main server entry point
│   │   ├── types/          # TypeScript type definitions
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API route handlers
│   │   └── services/       # Business logic services
│   ├── package.json
│   ├── tsconfig.json
│   └── env.example
├── frontend/               # React TypeScript frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── utils/          # Utility functions
│   │   ├── types/          # TypeScript types
│   │   └── main.tsx        # App entry point
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── package.json            # Root package.json
└── README.md
```

## API Documentation

### Base URL
```
http://localhost:3001/api
```

### Endpoints

#### Health Check
- **GET** `/health` - Get system health status
- **GET** `/health/detailed` - Get detailed system information

#### Scraping
- **GET** `/scraping/sources` - Get available scraping sources
- **POST** `/scraping/scrape` - Scrape data from a source
- **GET** `/scraping/status` - Get scraping status and history
- **POST** `/scraping/test` - Test scraping endpoint

### Example API Usage

```bash
# Get available sources
curl http://localhost:3001/api/scraping/sources

# Scrape data
curl -X POST http://localhost:3001/api/scraping/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "source": "bullish-markets",
    "format": "json",
    "options": {
      "limit": 10
    }
  }'
```

## Available Scraping Sources

The dashboard includes several pre-configured scraping sources:

1. **Top 100 Bullish Markets** - Cryptocurrency market data
2. **Amazon Bestsellers** - Product information from Amazon
3. **GitHub Trending** - Trending repositories from GitHub
4. **Latest News Headlines** - News headlines from various sources

## Configuration

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# Scraping Configuration
SCRAPING_TIMEOUT=30000
MAX_CONCURRENT_SCRAPES=5

# Logging
LOG_LEVEL=info
```

## Development

### Backend Development
```bash
cd backend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
```

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
```

## Building for Production

1. **Build both frontend and backend**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   cd backend
   npm start
   ```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

---

**Scrapify** - Making data extraction simple and efficient! 🚀