# Scrapify Frontend

The frontend dashboard for the Scrapify data scraping service, built with React and TypeScript.

## Overview

This is a modern React application that provides a beautiful, responsive dashboard for data scraping operations. It features a clean UI with real-time updates, multiple output formats, and comprehensive error handling.

## Architecture

### Core Components

- **Dashboard** (`src/components/Dashboard.tsx`) - Main dashboard layout
- **ScrapingCard** (`src/components/ScrapingCard.tsx`) - Individual scraping source cards
- **UI Components** (`src/components/ui/`) - Reusable UI components
- **API Utils** (`src/utils/api.ts`) - API communication utilities
- **Types** (`src/types/`) - TypeScript type definitions

### Key Features

- **React 18** - Latest React features with hooks
- **TypeScript** - Full type safety and IntelliSense
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast development and building
- **Responsive Design** - Mobile-first responsive layout
- **Real-time Updates** - Live status updates and notifications
- **Error Handling** - Comprehensive error states and user feedback

## Components

### Dashboard Component

The main dashboard component that orchestrates the entire application:

- **Header** - Application title and refresh button
- **Status Cards** - System health and recent activity
- **Scraping Grid** - Grid of available scraping sources
- **Data Preview** - Last scraped data with download/copy options

### ScrapingCard Component

Individual cards for each scraping source:

- **Source Information** - Name, description, and estimated records
- **Format Selection** - Dropdown for output format (JSON, CSV, XML)
- **Scrape Button** - Action button with loading states
- **Status Messages** - Success/error notifications

### UI Components

Reusable components built with Tailwind CSS:

- **Button** - Multiple variants (primary, secondary, success, warning, error)
- **Card** - Container with header, content, and footer sections
- **Select** - Custom styled dropdown component
- **Alert** - Notification component with different variants
- **LoadingSpinner** - Animated loading indicator

## Styling

### Tailwind CSS Configuration

The application uses a custom Tailwind configuration with:

- **Custom Colors** - Primary, secondary, success, warning, error palettes
- **Custom Animations** - Fade-in, slide-up, and pulse animations
- **Responsive Design** - Mobile-first breakpoints
- **Component Classes** - Pre-built component styles

### Color Palette

```css
Primary: Blue shades (50-900)
Secondary: Gray shades (50-900)
Success: Green shades (50-900)
Warning: Yellow shades (50-900)
Error: Red shades (50-900)
```

### Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 768px
- **Desktop**: 768px - 1024px
- **Large**: > 1024px

## API Integration

### API Client

The frontend uses Axios for API communication with:

- **Base Configuration** - Default headers and timeout
- **Request Interceptors** - Logging and error handling
- **Response Interceptors** - Error processing and status codes
- **Type Safety** - Full TypeScript integration

### API Functions

```typescript
// Health API
healthApi.getHealth()
healthApi.getDetailedHealth()

// Scraping API
scrapingApi.getSources()
scrapingApi.scrapeData(request)
scrapingApi.getStatus()
scrapingApi.testScraping()
```

### Data Handling

- **Download Function** - Downloads data as files (JSON, CSV, XML)
- **Clipboard Function** - Copies data to clipboard
- **Format Conversion** - Handles different data formats

## State Management

### Local State

The application uses React hooks for state management:

- **useState** - Component-level state
- **useEffect** - Side effects and lifecycle
- **Custom Hooks** - Reusable state logic (if needed)

### State Structure

```typescript
// Dashboard state
{
  sources: ScrapingSource[]
  loading: boolean
  scrapingLoading: string | null
  error: string | null
  lastScrapedData: ScrapingData | null
}

// ScrapingCard state
{
  selectedFormat: string
  error: string | null
  success: string | null
}
```

## Error Handling

### Error States

- **Network Errors** - Connection and timeout errors
- **API Errors** - Server-side errors with proper messages
- **Validation Errors** - Input validation and format errors
- **User Feedback** - Clear error messages and recovery options

### Error Components

- **Alert Component** - Different variants for different error types
- **Loading States** - Visual feedback during operations
- **Retry Mechanisms** - Options to retry failed operations

## Performance

### Optimization Techniques

- **Code Splitting** - Lazy loading of components
- **Memoization** - React.memo for expensive components
- **Bundle Optimization** - Vite's built-in optimizations
- **Image Optimization** - Optimized assets and lazy loading

### Loading States

- **Skeleton Loading** - Placeholder content during loading
- **Progressive Loading** - Incremental content loading
- **Error Boundaries** - Graceful error handling

## Development

### Prerequisites

- Node.js v18 or higher
- npm or yarn

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

### Project Structure

```
src/
├── main.tsx              # Application entry point
├── App.tsx               # Root component
├── App.css               # Global styles
├── components/
│   ├── Dashboard.tsx     # Main dashboard
│   ├── ScrapingCard.tsx  # Scraping source cards
│   └── ui/               # Reusable UI components
├── utils/
│   ├── api.ts            # API utilities
│   └── cn.ts             # Class name utility
├── types/
│   └── index.ts          # TypeScript types
└── index.css             # Tailwind CSS imports
```

## Configuration

### Vite Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
```

### Environment Variables

```bash
VITE_API_URL=http://localhost:3001/api
```

## Building for Production

### Build Process

```bash
npm run build
```

This creates an optimized production build in the `dist` directory.

### Build Output

- **Optimized Bundle** - Minified JavaScript and CSS
- **Asset Optimization** - Compressed images and fonts
- **Source Maps** - For debugging production issues
- **Tree Shaking** - Removes unused code

### Deployment

The built files can be deployed to any static hosting service:

- **Vercel** - Zero-config deployment
- **Netlify** - Drag and drop deployment
- **AWS S3** - Static website hosting
- **GitHub Pages** - Free hosting for public repos

## Testing

### Manual Testing

1. **Load Sources** - Verify sources load correctly
2. **Scrape Data** - Test scraping with different formats
3. **Error Handling** - Test error states and recovery
4. **Responsive Design** - Test on different screen sizes
5. **Download/Copy** - Test data export functionality

### Browser Testing

Test in multiple browsers:

- **Chrome** - Primary development browser
- **Firefox** - Cross-browser compatibility
- **Safari** - macOS compatibility
- **Edge** - Windows compatibility

## Accessibility

### WCAG Compliance

- **Keyboard Navigation** - Full keyboard accessibility
- **Screen Reader Support** - Proper ARIA labels
- **Color Contrast** - Sufficient contrast ratios
- **Focus Management** - Clear focus indicators

### Accessibility Features

- **Semantic HTML** - Proper HTML structure
- **ARIA Labels** - Screen reader support
- **Focus Traps** - Modal and dropdown focus management
- **High Contrast** - Accessible color schemes

## Browser Support

### Supported Browsers

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

### Polyfills

The application includes necessary polyfills for:

- **ES2020 Features** - Modern JavaScript features
- **CSS Grid** - Layout support
- **Fetch API** - HTTP requests

## Troubleshooting

### Common Issues

1. **Build Errors**
   - Check TypeScript errors
   - Verify all imports are correct
   - Clear node_modules and reinstall

2. **API Connection Issues**
   - Verify backend server is running
   - Check CORS configuration
   - Verify API URL in environment variables

3. **Styling Issues**
   - Check Tailwind CSS configuration
   - Verify class names are correct
   - Clear browser cache

4. **Performance Issues**
   - Check bundle size
   - Optimize images and assets
   - Use React DevTools for profiling

### Debug Mode

Enable debug mode by setting:

```bash
NODE_ENV=development
```

This enables:
- Detailed error messages
- Source maps
- Hot reload
- Development tools

## Contributing

### Development Guidelines

1. **TypeScript** - Use strict TypeScript
2. **Components** - Create reusable components
3. **Styling** - Use Tailwind CSS classes
4. **Error Handling** - Implement proper error states
5. **Documentation** - Add JSDoc comments

### Code Style

- **ESLint** - Follow ESLint rules
- **Prettier** - Consistent code formatting
- **TypeScript** - Strict type checking
- **Component Structure** - Consistent component patterns

## License

MIT License - see LICENSE file for details.
