
import React from 'react';

interface CanvasAreaProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  zoom: number;
}

export const CanvasArea = ({ canvasRef, zoom }: CanvasAreaProps) => {
  return (
    <div className="h-full w-full bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="h-full p-6 flex flex-col">
        {/* Canvas Container */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative max-w-full max-h-full">
            <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-300">
              <canvas
                ref={canvasRef}
                className="border border-gray-200 rounded max-w-full max-h-full"
                style={{ 
                  maxWidth: '800px',
                  maxHeight: '600px',
                  width: '800px',
                  height: '600px'
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Canvas Info Bar */}
        <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-500 border-t pt-4">
          <div className="flex items-center space-x-2">
            <span className="font-medium">Zoom:</span>
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">{Math.round(zoom * 100)}%</span>
          </div>
          <div className="text-gray-400">•</div>
          <span>Click and drag to move objects</span>
          <div className="text-gray-400">•</div>
          <span>Select objects to edit properties</span>
        </div>
      </div>
    </div>
  );
};
