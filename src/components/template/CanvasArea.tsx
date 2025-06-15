
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
        {/* Canvas - always rendered with stable DOM structure */}
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
          
          {/* Loading overlay - absolutely positioned to not affect DOM structure */}
          {!backgroundLoaded && !backgroundError && (
            <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center rounded">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <div className="text-lg font-medium text-gray-800 mb-2">Canvas is initializing...</div>
                <div className="text-sm text-gray-600">Loading your template and setting up the editor</div>
              </div>
            </div>
          )}
          
          {/* Error overlay - absolutely positioned */}
          {backgroundError && (
            <div className="absolute inset-0 bg-red-50 border border-red-200 text-red-700 flex items-center justify-center rounded">
              <div className="text-center p-4">
                <div className="text-lg font-medium mb-2">Failed to load canvas</div>
                <div className="text-sm">{backgroundError}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
