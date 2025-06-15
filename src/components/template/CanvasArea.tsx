
import React from 'react';

interface CanvasAreaProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  zoom: number;
}

export const CanvasArea = ({ canvasRef, zoom }: CanvasAreaProps) => {
  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-3">
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
