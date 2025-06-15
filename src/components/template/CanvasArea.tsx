
import React from 'react';

interface CanvasAreaProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  zoom: number;
  backgroundLoaded?: boolean;
  backgroundError?: string | null;
}

export const CanvasArea = ({ canvasRef, zoom, backgroundLoaded, backgroundError }: CanvasAreaProps) => {
  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-3 relative">
        {backgroundError && (
          <div className="absolute top-2 left-2 bg-red-100 border border-red-300 text-red-700 px-3 py-1 rounded-md text-xs z-10">
            {backgroundError}
          </div>
        )}
        
        {!backgroundLoaded && !backgroundError && (
          <div className="absolute top-2 left-2 bg-blue-100 border border-blue-300 text-blue-700 px-3 py-1 rounded-md text-xs z-10">
            Loading template...
          </div>
        )}
        
        <canvas
          ref={canvasRef}
          className="border border-gray-100 rounded max-w-full max-h-full"
          style={{ 
            width: '600px',
            height: '450px',
            display: 'block'
          }}
        />
      </div>
    </div>
  );
};
