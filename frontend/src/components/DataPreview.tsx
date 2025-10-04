/**
 * DataPreview component - displays scraped data in a formatted table
 */

import { Copy, Database, Download, Eye, EyeOff } from 'lucide-react';
import React from 'react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader } from './ui/Card';

export interface DataPreviewProps {
  data: any;
  format: string;
  source: string;
  onDownload: () => void;
  onCopy: () => void;
}

const DataPreview: React.FC<DataPreviewProps> = ({ 
  data, 
  format, 
  source, 
  onDownload, 
  onCopy 
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [showRawData, setShowRawData] = React.useState(false);

  const formatDataForDisplay = (data: any) => {
    if (format === 'json') {
      return JSON.stringify(data, null, 2);
    }
    return data;
  };

  const renderTableData = () => {
    if (!Array.isArray(data)) return null;

    const headers = Object.keys(data[0] || {});
    const displayData = isExpanded ? data : data.slice(0, 5);

    return (
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  {header.replace(/([A-Z])/g, ' $1').trim()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayData.map((row: any, index: number) => (
              <tr key={index} className="hover:bg-blue-50 transition-colors duration-200">
                {headers.map((header) => (
                  <td
                    key={header}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium"
                  >
                    {row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderRawData = () => {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-6 rounded-lg overflow-x-auto border border-gray-700 shadow-lg">
        <pre className="text-sm whitespace-pre-wrap font-mono">
          {formatDataForDisplay(data)}
        </pre>
      </div>
    );
  };

  return (
    <Card className="mt-8 bg-white/80 backdrop-blur-sm border-2 border-gray-200 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
              <Database className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                Scraped Data Preview
              </h3>
              <p className="text-sm text-gray-600">Source: {source}</p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200 shadow-sm">
              {format.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setShowRawData(!showRawData)}
              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 shadow-md hover:shadow-lg transition-all duration-300"
              size="sm"
              icon={showRawData ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            >
              {showRawData ? 'Hide Raw' : 'Show Raw'}
            </Button>
            <Button
              onClick={onCopy}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300"
              size="sm"
              icon={<Copy className="h-4 w-4" />}
            >
              Copy
            </Button>
            <Button
              onClick={onDownload}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-md hover:shadow-lg transition-all duration-300"
              size="sm"
              icon={<Download className="h-4 w-4" />}
            >
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {showRawData ? (
          renderRawData()
        ) : (
          <>
            {Array.isArray(data) ? (
              <>
                {renderTableData()}
                {data.length > 5 && (
                  <div className="mt-6 text-center">
                    <Button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300"
                      size="sm"
                    >
                      {isExpanded ? 'Show Less' : `Show All ${data.length} Records`}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-lg border border-gray-200 shadow-sm">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                  {formatDataForDisplay(data)}
                </pre>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DataPreview;
