
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-red-900">Connection Error</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-600">
            {apiError || 'Failed to connect to PDF.co API. Some features may be limited.'}
          </p>
          
          <div className="space-y-2">
            <Button 
              onClick={onRetry} 
              disabled={isRetrying}
              className="w-full"
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry Connection
                </>
              )}
            </Button>
            
            <Button variant="outline" onClick={onCancel} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
          
          <p className="text-sm text-gray-500">
            You can still use basic PDF viewing features without API connection.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
