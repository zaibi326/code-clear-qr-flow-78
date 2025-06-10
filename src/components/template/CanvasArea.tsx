
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface CanvasAreaProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  zoom: number;
}

export const CanvasArea = ({ canvasRef, zoom }: CanvasAreaProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white">
          <canvas
            ref={canvasRef}
            className="border border-gray-200 rounded shadow-sm mx-auto block"
          />
          <div className="text-center mt-4 text-sm text-gray-500">
            Zoom: {Math.round(zoom * 100)}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
