
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface CanvasAreaProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  zoom: number;
  backgroundLoaded?: boolean;
  backgroundError?: string | null;
}

export const CanvasArea = ({ canvasRef, zoom, backgroundLoaded, backgroundError }: CanvasAreaProps) => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="h-full w-full flex items-center justify-center p-4 bg-gray-100 overflow-auto">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 relative min-w-fit">
        {/* Canvas Container */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="border border-gray-200 rounded block"
            style={{ 
              width: '800px',
              height: '600px',
              opacity: backgroundLoaded ? 1 : 0.8
            }}
          />
          
          {/* Loading overlay */}
          {!backgroundLoaded && !backgroundError && (
            <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center rounded">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                <div className="text-lg font-medium text-gray-800 mb-2">Setting up canvas...</div>
                <div className="text-sm text-gray-600">Preparing your template editor</div>
                <div className="text-xs text-gray-500 mt-2">This usually takes a few seconds</div>
              </div>
            </div>
          )}
          
          {/* Success indicator (briefly shown) */}
          {backgroundLoaded && !backgroundError && (
            <div className="absolute top-2 right-2 bg-green-100 border border-green-200 text-green-700 px-3 py-2 rounded-md flex items-center gap-2 text-sm shadow-sm">
              <CheckCircle className="w-4 h-4" />
              Canvas Ready
            </div>
          )}
          
          {/* Error overlay */}
          {backgroundError && (
            <div className="absolute inset-0 bg-red-50 border border-red-200 text-red-700 flex items-center justify-center rounded">
              <div className="text-center p-4 max-w-md">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                <div className="text-lg font-medium mb-2">Canvas Setup Issue</div>
                <div className="text-sm mb-4 text-gray-600">{backgroundError}</div>
                <div className="space-y-2">
                  <Button 
                    onClick={handleRetry}
                    variant="destructive"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retry Setup
                  </Button>
                  <div className="text-xs text-gray-500">
                    Try refreshing if the issue persists
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
