
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
    <div className="text-center space-y-6">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <div className="relative inline-block">
        {isGenerating ? (
          <div 
            className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-dashed border-indigo-300 rounded-2xl flex flex-col items-center justify-center animate-pulse shadow-lg"
            style={{ width: Math.min(customizeData.size, 300), height: Math.min(customizeData.size, 300) }}
          >
            <QrCode className="h-16 w-16 text-indigo-400 mb-3" />
            <p className="text-sm text-indigo-600 font-medium">Generating your QR code...</p>
          </div>
        ) : generatedQR ? (
          <div className="relative">
            <img 
              src={generatedQR} 
              alt="Generated QR Code"
              className="border-2 border-indigo-200 rounded-2xl shadow-xl shadow-indigo-500/20 hover:shadow-2xl hover:shadow-indigo-500/30 transition-all duration-300"
              style={{ width: Math.min(customizeData.size, 300), height: Math.min(customizeData.size, 300) }}
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 pointer-events-none"></div>
          </div>
        ) : (
          <div 
            className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-dashed border-red-300 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ width: Math.min(customizeData.size, 300), height: Math.min(customizeData.size, 300) }}
          >
            <p className="text-red-500 font-medium">Failed to generate QR code</p>
          </div>
        )}
      </div>
    </div>
  );
}
