
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface CanvasAreaProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  zoom: number;
}

export const CanvasArea = ({ canvasRef, zoom }: CanvasAreaProps) => {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 min-h-[600px] flex flex-col items-center justify-center">
          <div className="bg-white rounded shadow-lg p-2">
            <canvas
              ref={canvasRef}
              className="border border-gray-200 rounded max-w-full h-auto"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
          <div className="text-center mt-4 text-sm text-gray-500">
            Zoom: {Math.round(zoom * 100)}% | Click and drag to move objects | Select objects to edit properties
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
