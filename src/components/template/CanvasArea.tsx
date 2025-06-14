
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface CanvasAreaProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  zoom: number;
}

export const CanvasArea = ({ canvasRef, zoom }: CanvasAreaProps) => {
  return (
    <Card className="w-full h-full">
      <CardContent className="p-6 h-full">
        <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 min-h-[600px] flex flex-col items-center justify-center p-6">
          <div className="bg-white rounded shadow-lg p-2 max-w-full">
            <canvas
              ref={canvasRef}
              className="border border-gray-200 rounded max-w-full h-auto"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
          
          <div className="text-center mt-6 space-y-2">
            <div className="text-sm font-medium text-gray-600">
              Zoom: {Math.round(zoom * 100)}%
            </div>
            <div className="text-xs text-gray-500 max-w-md">
              Click and drag to move objects • Select objects to edit properties • Use the tools panel to add elements
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
