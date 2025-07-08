
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, AlertCircle } from 'lucide-react';

interface APIConnectionErrorProps {
  apiError: string | null;
  isRetrying: boolean;
  onRetry: () => void;
  onCancel: () => void;
}

export const APIConnectionError: React.FC<APIConnectionErrorProps> = ({
  apiError,
  isRetrying,
  onRetry,
  onCancel
}) => {
  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onCancel} className="hover:bg-gray-100/80">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Canva-Style PDF Editor
            </h1>
          </div>
        </div>
      </div>

      {/* API Error with modern design */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Connection Failed</h3>
                <p className="text-sm text-gray-600">PDF.co API is not accessible</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-700">{apiError}</p>
              <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-xl border border-red-100">
                <p className="text-sm font-medium mb-2 text-red-800">Possible causes:</p>
                <ul className="text-xs space-y-1 text-red-700">
                  <li>• Invalid or expired API key</li>
                  <li>• Network connectivity issues</li>
                  <li>• API service temporarily unavailable</li>
                  <li>• File URL not accessible by PDF.co</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 flex gap-3">
              <Button 
                onClick={onRetry} 
                variant="outline" 
                size="sm"
                disabled={isRetrying}
                className="flex-1"
              >
                {isRetrying ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                    Testing...
                  </>
                ) : (
                  'Retry Connection'
                )}
              </Button>
              <Button onClick={onCancel} variant="ghost" size="sm" className="flex-1">
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
