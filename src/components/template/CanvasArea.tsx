
import React from 'react';

interface CanvasAreaProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  zoom: number;
  backgroundLoaded?: boolean;
  backgroundError?: string | null;
}

export const CanvasArea = ({ canvasRef, zoom, backgroundLoaded, backgroundError }: CanvasAreaProps) => {
  return (
    <div className="h-full w-full flex items-center justify-center p-4 bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 relative">
        {/* Canvas - always rendered with stable DOM structure */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="border border-gray-200 rounded max-w-full max-h-full block"
            style={{ 
              width: '600px',
              height: '450px',
              opacity: backgroundLoaded ? 1 : 0.5
            }}
          />
          
          {/* Loading overlay - absolutely positioned to not affect DOM structure */}
          {!backgroundLoaded && !backgroundError && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <div className="text-sm text-gray-600">Loading canvas...</div>
              </div>
            </div>
          )}
          
          {/* Error overlay - absolutely positioned */}
          {backgroundError && (
            <div className="absolute top-2 left-2 bg-red-100 border border-red-300 text-red-700 px-3 py-1 rounded-md text-xs z-10">
              {backgroundError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
