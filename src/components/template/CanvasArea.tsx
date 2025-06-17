
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle, AlertCircle, Loader2, FileImage } from 'lucide-react';

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
            className="border border-gray-200 rounded block max-w-full max-h-full"
            style={{ 
              width: '800px',
              height: '600px',
              opacity: backgroundLoaded ? 1 : 0.5,
              transform: `scale(${zoom})`,
              transformOrigin: 'center center'
            }}
          />
          
          {/* Loading overlay */}
          {!backgroundLoaded && !backgroundError && (
            <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center rounded backdrop-blur-sm">
              <div className="text-center p-6">
                <div className="relative mb-4">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                </div>
                <div className="text-base font-semibold text-gray-800 mb-2">Loading Template</div>
                <div className="text-sm text-gray-600 mb-3">Preparing your document for editing...</div>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <FileImage className="w-4 h-4" />
                  <span>Processing PDF, JPG & PNG files</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Success indicator */}
          {backgroundLoaded && !backgroundError && (
            <div className="absolute top-3 right-3 bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-md text-sm flex items-center gap-2 shadow-sm animate-in fade-in duration-500">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">Template Loaded</span>
            </div>
          )}
          
          {/* Error overlay */}
          {backgroundError && (
            <div className="absolute inset-0 bg-red-50 border-2 border-red-200 text-red-700 flex items-center justify-center rounded backdrop-blur-sm">
              <div className="text-center p-6 max-w-md">
                <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
                <div className="text-base font-semibold mb-3">Template Loading Failed</div>
                <div className="text-sm mb-4 text-gray-700 bg-white p-3 rounded border">
                  {backgroundError}
                </div>
                <div className="space-y-2">
                  <Button 
                    onClick={handleRetry}
                    variant="destructive"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retry Loading
                  </Button>
                  <div className="text-xs text-gray-500 mt-2">
                    If this continues, try re-uploading your template
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
