
import React from 'react';

interface QRPreviewDisplayProps {
  generatedQR: string | null;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  foregroundColor?: string;
  backgroundColor?: string;
}

export function QRPreviewDisplay({ 
  generatedQR, 
  canvasRef, 
  foregroundColor, 
  backgroundColor 
}: QRPreviewDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-start space-y-4">
      <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-200">
        {generatedQR ? (
          <img 
            src={generatedQR} 
            alt="Generated QR Code" 
            className="w-64 h-64 object-contain"
          />
        ) : (
          <canvas 
            ref={canvasRef} 
            className="w-64 h-64 border border-gray-300 rounded"
          />
        )}
      </div>
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600 max-w-xs">
          Your QR code will appear here as you fill in the form fields
        </p>
        {foregroundColor && backgroundColor && (
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: foregroundColor }}></div>
              Foreground
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded border" style={{ backgroundColor: backgroundColor }}></div>
              Background
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
