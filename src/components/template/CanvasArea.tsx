
import React from 'react';

interface CanvasAreaProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  zoom: number;
  backgroundLoaded?: boolean;
  backgroundError?: string | null;
}

export const CanvasArea = ({ canvasRef, zoom, backgroundLoaded, backgroundError }: CanvasAreaProps) => {
  return (
    <div className="h-full w-full flex items-center justify-center p-4 bg-gray-100 overflow-auto">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 relative min-w-fit">
        {/* Canvas Container - Always rendered */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="border border-gray-200 rounded block"
            style={{ 
              width: '800px',
              height: '600px',
              opacity: backgroundLoaded ? 1 : 0.7
            }}
          />
          
          {/* Loading overlay */}
          {!backgroundLoaded && !backgroundError && (
            <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center rounded">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <div className="text-lg font-medium text-gray-800 mb-2">Canvas is initializing...</div>
                <div className="text-sm text-gray-600">Loading your template and setting up the editor</div>
              </div>
            </div>
          )}
          
          {/* Error overlay */}
          {backgroundError && (
            <div className="absolute inset-0 bg-red-50 border border-red-200 text-red-700 flex items-center justify-center rounded">
              <div className="text-center p-4">
                <div className="text-lg font-medium mb-2">Canvas initialization failed</div>
                <div className="text-sm mb-4">{backgroundError}</div>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
