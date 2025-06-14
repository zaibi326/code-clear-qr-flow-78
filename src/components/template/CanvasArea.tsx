
import React from 'react';

interface CanvasAreaProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  zoom: number;
}

export const CanvasArea = ({ canvasRef, zoom }: CanvasAreaProps) => {
  return (
    <div className="h-full w-full flex items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <canvas
          ref={canvasRef}
          className="border border-gray-100 rounded"
          style={{ 
            width: '800px',
            height: '600px'
          }}
        />
      </div>
    </div>
  );
};
