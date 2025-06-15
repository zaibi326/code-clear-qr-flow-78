
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
              opacity: backgroundLoaded ? 1 : 0.6
            }}
          />
          
          {/* Loading overlay */}
          {!backgroundLoaded && !backgroundError && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-3" />
                <div className="text-sm font-medium text-gray-800 mb-1">Initializing canvas...</div>
                <div className="text-xs text-gray-600">Setting up your template editor</div>
              </div>
            </div>
          )}
          
          {/* Success indicator (briefly shown) */}
          {backgroundLoaded && !backgroundError && (
            <div className="absolute top-2 right-2 bg-green-100 border border-green-200 text-green-700 px-2 py-1 rounded text-xs flex items-center gap-1 shadow-sm animate-pulse">
              <CheckCircle className="w-3 h-3" />
              Ready
            </div>
          )}
          
          {/* Error overlay */}
          {backgroundError && (
            <div className="absolute inset-0 bg-red-50 border border-red-200 text-red-700 flex items-center justify-center rounded">
              <div className="text-center p-4 max-w-md">
                <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <div className="text-sm font-medium mb-2">Canvas Setup Issue</div>
                <div className="text-xs mb-3 text-gray-600">{backgroundError}</div>
                <Button 
                  onClick={handleRetry}
                  variant="destructive"
                  size="sm"
                  className="flex items-center gap-1 text-xs px-2 py-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Retry
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
