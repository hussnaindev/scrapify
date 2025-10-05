/**
 * ScrapingCard component - Updated for scalability
 * Now uses configuration-driven approach for better maintainability
 */

import { Download } from 'lucide-react';
import React, { useState } from 'react';
import { ScrapingSource } from '../types';
import { Button } from './ui/Button';
import { Card, CardContent, CardFooter, CardHeader } from './ui/Card';
import { Select } from './ui/Select';

// Configuration for special handling of different scrapers
const SCRAPER_CONFIG = {
  'github-most-starred': {
    defaultLimit: 10,
    limitOptions: [
      { value: '10', label: '10' },
      { value: '50', label: '50' },
      { value: '100', label: '100' },
    ],
    limitLabel: 'Repos'
  },
  'turing-remote-jobs': {
    defaultLimit: 100,
    limitOptions: [
      { value: '100', label: '100' },
      { value: '500', label: '500' },
      { value: '1000', label: '1000' },
    ],
    limitLabel: 'Jobs'
  }
};

const WHITE_ICONS = ['bullish-markets', 'turing-remote-jobs'];

export interface ScrapingCardProps {
  source: ScrapingSource;
  onScrape: (source: ScrapingSource, format: string, limit?: number) => Promise<void>;
  isLoading?: boolean;
}

const ScrapingCard: React.FC<ScrapingCardProps> = ({ 
  source, 
  onScrape, 
  isLoading = false 
}) => {
  const [selectedFormat, setSelectedFormat] = useState(source.defaultFormat);
  const [selectedLimit, setSelectedLimit] = useState<number>(
    SCRAPER_CONFIG[source.id as keyof typeof SCRAPER_CONFIG]?.defaultLimit || 0
  );

  const handleScrape = async () => {
    const config = SCRAPER_CONFIG[source.id as keyof typeof SCRAPER_CONFIG];
    const limit = config ? selectedLimit : undefined;
    await onScrape(source, selectedFormat, limit);
  };

  const formatOptions = source.supportedFormats.map(format => ({
    value: format,
    label: format.toUpperCase(),
  }));

  const getSourceIcon = (sourceId: string) => {
    const iconClass = "h-16 w-16 object-contain";
    const whiteIconClass = `${iconClass} ${WHITE_ICONS.includes(sourceId) ? "bg-black rounded-xl p-2" : ""}`;

    switch (sourceId) {
      case 'bullish-markets':
        return (
          <img
            src="https://cdn.prod.website-files.com/67e428d18ac85216b5a9d0e4/67f949a57fa08489a0c7843a_Bullish-Logo.svg"
            alt="Bullish"
            className={whiteIconClass}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        );
      case 'github-most-starred':
        return (
          <img
            src="https://github.githubassets.com/images/modules/site/copilot/copilot.png"
            alt="GitHub"
            className={iconClass}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        );
      case 'turing-remote-jobs':
        return (
          <img
            src="https://www.turing.com/assets/Turing-Wordmark_White.svg"
            alt="Turing"
            className={whiteIconClass}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        );
      case 'spotify-most-followed':
        return (
          <img
            src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Black.png"
            alt="Spotify"
            className={iconClass}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        );
      case 'quickbooks-pricing':
        return (
          <img
            src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 36 36'%3e%3cpath fill='%232CA01C' d='M18 36c9.9411 0 18-8.0589 18-18 0-9.94114-8.0589-18-18-18C8.05886 0 0 8.05886 0 18c0 9.9411 8.05886 18 18 18Z'/%3e%3cpath fill='white' d='M12.0002 11c-3.86797 0-6.99996 3.136-6.99996 7 0 3.868 3.13199 7 6.99996 7h1.0001v-2.6h-1.0001c-2.42798 0-4.39995-1.972-4.39995-4.4 0-2.428 1.97197-4.4 4.39995-4.4h2.4041v13.6c0 1.436 1.1639 2.6 2.5999 2.6V11h-5.004ZM24.0038 25c3.868 0 6.9999-3.1361 6.9999-7 0-3.868-3.1319-7-6.9999-7h-1.0001v2.5999h1.0001c2.428 0 4.3999 1.9721 4.3999 4.4001s-1.9719 4.3999-4.3999 4.3999h-2.4041V8.79997c0-1.43602-1.1639-2.60002-2.5999-2.60002V25h5.004Z'/%3e%3c/svg%3e"
            alt="QuickBooks"
            className={iconClass}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        );
      default:
        return (
          <img
            src="https://cdn-icons-png.flaticon.com/512/2965/2965879.png"
            alt="Data"
            className={iconClass}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        );
    }
  };

  const getSourceBadge = (sourceId: string) => {
    const badgeConfig = {
      'bullish-markets': { text: 'Live Data', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
      'github-most-starred': { text: 'Live Data', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
      'turing-remote-jobs': { text: 'Live Data', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
      'quickbooks-pricing': { text: 'Live Data', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
      'spotify-most-followed': { text: 'Live Data', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    };

    const config = badgeConfig[sourceId as keyof typeof badgeConfig];
    
    return config ? (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.className} shadow-sm whitespace-nowrap`}>
        {config.text}
      </span>
    ) : null;
  };

  const renderLimitSelector = () => {
    const config = SCRAPER_CONFIG[source.id as keyof typeof SCRAPER_CONFIG];
    if (!config) return null;

    return (
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {config.limitLabel}
        </label>
        <Select
          options={config.limitOptions}
          value={selectedLimit.toString()}
          onChange={(e) => setSelectedLimit(Number(e.target.value))}
          disabled={isLoading}
          className="bg-white/80 border-gray-300 focus:border-gray-400 focus:ring-gray-400 w-full"
        />
      </div>
    );
  };

  return (
    <Card className={`h-full flex flex-col bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200 border-2 hover:shadow-xl hover:scale-105 transition-all duration-300 group min-h-[400px] max-h-[500px] overflow-hidden`}>
      <CardHeader className="pb-4 px-6 relative pt-12">
        <div className="absolute top-3 right-4 z-10">
          {getSourceBadge(source.id)}
        </div>

        <div className="flex items-start gap-2">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="flex-shrink-0">
              {getSourceIcon(source.id)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="mb-2">
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                  {source.name}
                </h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 overflow-hidden">
                {source.description}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 px-6 py-4 overflow-hidden">
        <div className="space-y-4">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Output Format
            </label>
            <Select
              options={formatOptions}
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value as 'json' | 'csv' | 'xml')}
              disabled={isLoading}
              className="bg-white/80 border-gray-300 focus:border-gray-400 focus:ring-gray-400 w-full"
            />
          </div>

          {/* Dynamic Limit Selection */}
          {renderLimitSelector()}
        </div>
      </CardContent>

      <CardFooter className="px-6 pt-4 pb-6 mt-auto">
        <Button
          onClick={handleScrape}
          disabled={isLoading}
          loading={isLoading}
          className={`w-full py-3 text-sm font-semibold transition-all duration-300 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg hover:shadow-xl`}
          icon={<Download className="h-4 w-4" />}
        >
          {isLoading ? 'Scraping...' : 'Scrape Data'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ScrapingCard;