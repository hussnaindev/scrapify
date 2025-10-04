/**
 * Dashboard component - main dashboard layout with scraping cards
 */

import {
    Activity,
    AlertCircle,
    Database,
    RefreshCw
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ScrapingResponse, ScrapingSource } from '../types';
import { copyToClipboard, downloadData, scrapingApi } from '../utils/api';
import DataPreview from './DataPreview';
import ScrapingCard from './ScrapingCard';
import { Alert } from './ui/Alert';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';
import { LoadingSpinner } from './ui/LoadingSpinner';

const Dashboard: React.FC = () => {
  const [sources, setSources] = useState<ScrapingSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrapingLoading, setScrapingLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [lastScrapedData, setLastScrapedData] = useState<{
    source: string;
    format: string;
    data: any;
    timestamp: string;
  } | null>(null);

  // Load scraping sources on component mount
  useEffect(() => {
    loadSources();
  }, []);

  const loadSources = async () => {
    try {
      setLoading(true);
      setError(null);
      const sourcesData = await scrapingApi.getSources();
      setSources(sourcesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load scraping sources');
    } finally {
      setLoading(false);
    }
  };

  const handleScrape = async (source: ScrapingSource, format: string) => {
    try {
      setScrapingLoading(source.id);
      setError(null);
      setSuccess(null);

      const response: ScrapingResponse = await scrapingApi.scrapeData({
        source: source.id,
        format: format as 'json' | 'csv' | 'xml',
        options: { limit: 10 }
      });

      if (response.success && response.data) {
        setLastScrapedData({
          source: source.name,
          format: format,
          data: response.data,
          timestamp: response.metadata.timestamp
        });
        
        const recordCount = response.metadata.recordCount || 0;
        setSuccess(`Successfully scraped ${recordCount} records from ${source.name} in ${format.toUpperCase()} format!`);
      } else {
        throw new Error(response.error || 'Scraping failed');
      }
    } catch (err) {
      throw err; // Re-throw to be handled by ScrapingCard
    } finally {
      setScrapingLoading(null);
    }
  };

  const handleDownload = () => {
    if (lastScrapedData) {
      downloadData(
        lastScrapedData.data,
        `${lastScrapedData.source.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}`,
        lastScrapedData.format as 'json' | 'csv' | 'xml'
      );
    }
  };

  const handleCopy = async () => {
    if (lastScrapedData) {
      const success = await copyToClipboard(
        lastScrapedData.data,
        lastScrapedData.format as 'json' | 'csv' | 'xml'
      );
      if (success) {
        // You could show a toast notification here
        console.log('Data copied to clipboard');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-secondary-600">Loading scraping sources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Database className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Scrapify
                </h1>
                <p className="text-sm text-gray-600 font-medium">Data Scraping Dashboard</p>
              </div>
            </div>
            <Button
              onClick={loadSources}
              className="bg-gradient-to-r from-gray-600 to-slate-700 hover:from-gray-700 hover:to-slate-800 shadow-lg hover:shadow-xl transition-all duration-300"
              icon={<RefreshCw className="h-4 w-4" />}
              disabled={loading}
            >
              Refresh Sources
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Alert */}
        {success && (
          <div className="mb-6">
            <Alert variant="success" message={success} dismissible onDismiss={() => setSuccess(null)} />
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6">
            <Alert variant="error" message={error} dismissible onDismiss={() => setError(null)} />
          </div>
        )}

        {/* Data Preview */}
        {lastScrapedData && (
          <DataPreview
            data={lastScrapedData.data}
            format={lastScrapedData.format}
            source={lastScrapedData.source}
            onDownload={handleDownload}
            onCopy={handleCopy}
          />
        )}

        {/* Scraping Sources Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Available Scraping Sources
              </h2>
              <p className="text-gray-600">Choose a data source and start scraping</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 bg-white/60 px-4 py-2 rounded-full border border-gray-200">
              <Activity className="h-4 w-4 text-blue-500" />
              <span className="font-semibold">{sources.length} sources available</span>
            </div>
          </div>

          {sources.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-gray-200">
              <CardContent className="text-center py-16">
                <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <AlertCircle className="h-10 w-10 text-gray-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  No Scraping Sources Available
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  There are currently no scraping sources configured. Click refresh to load available sources.
                </p>
                <Button 
                  onClick={loadSources} 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Refresh Sources
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {sources.map((source) => (
                <ScrapingCard
                  key={source.id}
                  source={source}
                  onScrape={handleScrape}
                  isLoading={scrapingLoading === source.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-500 bg-white/60 px-6 py-3 rounded-full border border-gray-200">
            <span className="font-medium">Scrapify Dashboard v1.0.0</span>
            <span className="text-gray-400">•</span>
            <span>Built with React & Node.js</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
