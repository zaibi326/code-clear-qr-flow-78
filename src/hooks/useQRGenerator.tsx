
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import QRCodeLib from 'qrcode';

export interface QRCodeConfig {
  content: string;
  type: 'url' | 'text' | 'email' | 'phone' | 'wifi' | 'vcard';
  size: number;
  errorCorrection: 'L' | 'M' | 'Q' | 'H';
  foregroundColor: string;
  backgroundColor: string;
  borderSize: number;
  logoUrl?: string;
}

export const useQRGenerator = () => {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [config, setConfig] = useState<QRCodeConfig>({
    content: 'https://www.example.com',
    type: 'url',
    size: 256,
    errorCorrection: 'M',
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF',
    borderSize: 4
  });

  const [generatedQR, setGeneratedQR] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQRCode = async () => {
    if (!config.content.trim()) {
      console.log('No content provided for QR generation');
      return;
    }

    setIsGenerating(true);
    console.log('Starting QR generation with config:', config);
    
    try {
      const canvas = canvasRef.current;
      if (!canvas) {
        console.log('Canvas not found, creating temporary canvas');
        // Create a temporary canvas if ref is not available
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = config.size;
        tempCanvas.height = config.size;
        
        await QRCodeLib.toCanvas(tempCanvas, config.content, {
          width: config.size,
          margin: Math.floor(config.borderSize / 4),
          color: {
            dark: config.foregroundColor,
            light: config.backgroundColor,
          },
          errorCorrectionLevel: config.errorCorrection,
        });

        const dataURL = tempCanvas.toDataURL('image/png');
        setGeneratedQR(dataURL);
        console.log('QR code generated successfully with temporary canvas');
        return;
      }

      await QRCodeLib.toCanvas(canvas, config.content, {
        width: config.size,
        margin: Math.floor(config.borderSize / 4),
        color: {
          dark: config.foregroundColor,
          light: config.backgroundColor,
        },
        errorCorrectionLevel: config.errorCorrection,
      });

      const dataURL = canvas.toDataURL('image/png');
      setGeneratedQR(dataURL);
      console.log('QR code generated successfully');
      
    } catch (error) {
      console.error('QR generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate QR code. Please check your content.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (config.content.trim()) {
      console.log('Config changed, regenerating QR code:', config);
      generateQRCode();
    }
  }, [config]);

  const formatContentForType = (content: string, type: string) => {
    switch (type) {
      case 'email':
        return content.includes('mailto:') ? content : `mailto:${content}`;
      case 'phone':
        return content.includes('tel:') ? content : `tel:${content}`;
      case 'url':
        if (!content.includes('://')) {
          return `https://${content}`;
        }
        return content;
      default:
        return content;
    }
  };

  const handleContentChange = (value: string) => {
    const formattedContent = formatContentForType(value, config.type);
    setConfig(prev => ({ ...prev, content: formattedContent }));
  };

  return {
    config,
    setConfig,
    generatedQR,
    isGenerating,
    canvasRef,
    handleContentChange,
    generateQRCode
  };
};
