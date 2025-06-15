
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle, AlertCircle, Loader2, FileImage, FileText } from 'lucide-react';

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
              opacity: backgroundLoaded ? 1 : 0.7,
              transform: `scale(${zoom})`,
              transformOrigin: 'center center'
            }}
          />
          
          {/* Loading overlay */}
          {!backgroundLoaded && !backgroundError && (
            <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center rounded backdrop-blur-sm">
              <div className="text-center p-6">
                <div className="relative mb-4">
                  <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto" />
                  <div className="absolute inset-0 rounded-full border-2 border-blue-200 animate-pulse"></div>
                </div>
                <div className="text-lg font-semibold text-gray-800 mb-2">Initializing Canvas</div>
                <div className="text-sm text-gray-600 mb-3">Setting up your template editor...</div>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <FileImage className="w-4 h-4" />
                  <span>Loading JPG, PNG & PDF support</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Success indicator */}
          {backgroundLoaded && !backgroundError && (
            <div className="absolute top-3 right-3 bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-md text-sm flex items-center gap-2 shadow-sm animate-in fade-in duration-500">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">Ready to Edit</span>
            </div>
          )}
          
          {/* Error overlay */}
          {backgroundError && (
            <div className="absolute inset-0 bg-red-50 border-2 border-red-200 text-red-700 flex items-center justify-center rounded backdrop-blur-sm">
              <div className="text-center p-6 max-w-md">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <div className="text-lg font-semibold mb-3">Canvas Setup Failed</div>
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
                    Retry Initialization
                  </Button>
                  <div className="text-xs text-gray-500 mt-2">
                    Supports JPG, PNG, and PDF files
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* File format support indicator */}
          {backgroundLoaded && !backgroundError && (
            <div className="absolute bottom-3 left-3 bg-white bg-opacity-90 border border-gray-200 text-gray-600 px-3 py-2 rounded-md text-xs flex items-center gap-2 shadow-sm">
              <FileText className="w-3 h-3" />
              <span>JPG • PNG • PDF Ready</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
