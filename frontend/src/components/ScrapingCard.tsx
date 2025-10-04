/**
 * ScrapingCard component - displays individual scraping source cards
 */

import { Clock, Database, Download, FileText } from 'lucide-react';
import React, { useState } from 'react';
import { ScrapingSource } from '../types';
import { Button } from './ui/Button';
import { Card, CardContent, CardFooter, CardHeader } from './ui/Card';
import { Select } from './ui/Select';

export interface ScrapingCardProps {
  source: ScrapingSource;
  onScrape: (source: ScrapingSource, format: string) => Promise<void>;
  isLoading?: boolean;
}

const ScrapingCard: React.FC<ScrapingCardProps> = ({ 
  source, 
  onScrape, 
  isLoading = false 
}) => {
  const [selectedFormat, setSelectedFormat] = useState(source.defaultFormat);

  const handleScrape = async () => {
    await onScrape(source, selectedFormat);
  };

  const formatOptions = source.supportedFormats.map(format => ({
    value: format,
    label: format.toUpperCase(),
  }));

  const getSourceIcon = (sourceId: string) => {
    switch (sourceId) {
      case 'bullish-markets':
        return <Database className="h-6 w-6 text-white" />;
      case 'amazon-bestsellers':
        return <FileText className="h-6 w-6 text-white" />;
      case 'github-trending':
        return <Database className="h-6 w-6 text-white" />;
      case 'news-headlines':
        return <FileText className="h-6 w-6 text-white" />;
      default:
        return <Database className="h-6 w-6 text-white" />;
    }
  };

  const getSourceBadge = (sourceId: string) => {
    switch (sourceId) {
      case 'bullish-markets':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm">Live Data</span>;
      case 'amazon-bestsellers':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 shadow-sm">Mock Data</span>;
      case 'github-trending':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200 shadow-sm">Mock Data</span>;
      case 'news-headlines':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200 shadow-sm">Mock Data</span>;
      default:
        return null;
    }
  };

  const getCardGradient = (sourceId: string) => {
    switch (sourceId) {
      case 'bullish-markets':
        return 'from-emerald-50 to-green-50 border-emerald-200';
      case 'amazon-bestsellers':
        return 'from-amber-50 to-orange-50 border-amber-200';
      case 'github-trending':
        return 'from-blue-50 to-indigo-50 border-blue-200';
      case 'news-headlines':
        return 'from-red-50 to-pink-50 border-red-200';
      default:
        return 'from-gray-50 to-slate-50 border-gray-200';
    }
  };

  const getIconBg = (sourceId: string) => {
    switch (sourceId) {
      case 'bullish-markets':
        return 'bg-gradient-to-br from-emerald-500 to-green-600';
      case 'amazon-bestsellers':
        return 'bg-gradient-to-br from-amber-500 to-orange-600';
      case 'github-trending':
        return 'bg-gradient-to-br from-blue-500 to-indigo-600';
      case 'news-headlines':
        return 'bg-gradient-to-br from-red-500 to-pink-600';
      default:
        return 'bg-gradient-to-br from-gray-500 to-slate-600';
    }
  };

  return (
    <Card className={`h-full flex flex-col bg-gradient-to-br ${getCardGradient(source.id)} border-2 hover:shadow-xl hover:scale-105 transition-all duration-300 group`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${getIconBg(source.id)} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
              {getSourceIcon(source.id)}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                  {source.name}
                </h3>
                {getSourceBadge(source.id)}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {source.description}
              </p>
            </div>
          </div>
          {source.estimatedRecords && (
            <div className="flex items-center space-x-1 text-xs text-gray-500 bg-white/60 px-2 py-1 rounded-full">
              <Clock className="h-3 w-3" />
              <span className="font-medium">~{source.estimatedRecords}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="space-y-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Output Format
            </label>
            <Select
              options={formatOptions}
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value as 'json' | 'csv' | 'xml')}
              disabled={isLoading}
              className="bg-white/80 border-gray-300 focus:border-gray-400 focus:ring-gray-400"
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-6">
        <Button
          onClick={handleScrape}
          disabled={isLoading}
          loading={isLoading}
          className={`w-full py-3 text-sm font-semibold transition-all duration-300 ${
            source.id === 'bullish-markets' 
              ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg hover:shadow-xl' 
              : 'bg-gradient-to-r from-gray-600 to-slate-700 hover:from-gray-700 hover:to-slate-800 shadow-lg hover:shadow-xl'
          }`}
          icon={<Download className="h-4 w-4" />}
        >
          {isLoading ? 'Scraping...' : 'Scrape Data'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ScrapingCard;
