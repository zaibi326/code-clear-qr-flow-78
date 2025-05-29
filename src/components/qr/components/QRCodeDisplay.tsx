
import React, { useEffect, useRef, useState } from 'react';
import { QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QRCodeLib from 'qrcode';

interface QRCodeDisplayProps {
  content: string;
  customizeData: any;
  onQRGenerated: (dataURL: string) => void;
}

export function QRCodeDisplay({ content, customizeData, onQRGenerated }: QRCodeDisplayProps) {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generatedQR, setGeneratedQR] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error('Canvas not found');

      await QRCodeLib.toCanvas(canvas, content, {
        width: customizeData.size,
        margin: Math.floor(customizeData.borderSize / 4),
        color: {
          dark: customizeData.foregroundColor,
          light: customizeData.backgroundColor,
        },
        errorCorrectionLevel: customizeData.errorCorrection,
      });

      const dataURL = canvas.toDataURL('image/png');
      setGeneratedQR(dataURL);
      onQRGenerated(dataURL);
      
      toast({
        title: "Success",
        description: "QR code generated successfully!"
      });
    } catch (error) {
      console.error('QR generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate QR code.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    generateQRCode();
  }, []);

  return (
    <div className="text-center space-y-4">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <div className="relative inline-block">
        {isGenerating ? (
          <div 
            className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center animate-pulse"
            style={{ width: Math.min(customizeData.size, 300), height: Math.min(customizeData.size, 300) }}
          >
            <QrCode className="h-16 w-16 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Generating...</p>
          </div>
        ) : generatedQR ? (
          <img 
            src={generatedQR} 
            alt="Generated QR Code"
            className="border-2 border-gray-200 rounded-lg shadow-lg"
            style={{ width: Math.min(customizeData.size, 300), height: Math.min(customizeData.size, 300) }}
          />
        ) : (
          <div 
            className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center"
            style={{ width: Math.min(customizeData.size, 300), height: Math.min(customizeData.size, 300) }}
          >
            <p className="text-gray-500">Failed to generate</p>
          </div>
        )}
      </div>
    </div>
  );
}
