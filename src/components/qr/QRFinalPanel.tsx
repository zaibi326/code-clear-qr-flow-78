
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Download, Copy, Share2, QrCode, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { QRCodeType } from './QRGeneratorStepper';
import QRCodeLib from 'qrcode';

interface QRFinalPanelProps {
  qrType: QRCodeType;
  setupData: any;
  customizeData: any;
  onBack: () => void;
}

export function QRFinalPanel({ qrType, setupData, customizeData, onBack }: QRFinalPanelProps) {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generatedQR, setGeneratedQR] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const getQRContent = () => {
    switch (qrType.id) {
      case 'url':
      case 'multi-link':
      case 'pdf':
        return setupData.url || 'https://example.com';
      case 'email-static':
        return `mailto:${setupData.email}${setupData.subject ? `?subject=${setupData.subject}` : ''}`;
      case 'call-static':
        return `tel:${setupData.phone}`;
      case 'sms-static':
        return `sms:${setupData.phone}${setupData.message ? `?body=${setupData.message}` : ''}`;
      default:
        return setupData.content || 'Default content';
    }
  };

  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error('Canvas not found');

      const content = getQRContent();
      
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

  const handleDownload = () => {
    if (!generatedQR) return;

    const link = document.createElement('a');
    link.download = `qr-code-${qrType.id}-${Date.now()}.png`;
    link.href = generatedQR;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Success",
      description: "QR code downloaded successfully!"
    });
  };

  const handleCopy = async () => {
    if (!generatedQR) return;

    try {
      const response = await fetch(generatedQR);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      
      toast({
        title: "Success",
        description: "QR code copied to clipboard!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy QR code to clipboard",
        variant: "destructive"
      });
    }
  };

  const handleShare = async () => {
    if (!generatedQR) return;

    if (navigator.share) {
      try {
        const response = await fetch(generatedQR);
        const blob = await response.blob();
        const file = new File([blob], `qr-code-${qrType.id}-${Date.now()}.png`, { type: 'image/png' });
        
        await navigator.share({
          title: 'QR Code',
          text: `Check out this ${qrType.title} QR code`,
          files: [file]
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to share QR code",
          variant: "destructive"
        });
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500 text-white">
              <CheckCircle className="h-5 w-5" />
            </div>
            Your QR Code is Ready!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* QR Code Display */}
            <div className="text-center space-y-4">
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

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Button 
                  onClick={handleDownload} 
                  disabled={!generatedQR}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button 
                  onClick={handleCopy} 
                  variant="outline" 
                  disabled={!generatedQR}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button 
                  onClick={handleShare} 
                  variant="outline" 
                  disabled={!generatedQR}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* QR Code Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">QR Code Details</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <Badge className={`${qrType.color} text-white border-0`}>
                    {qrType.title}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <Badge variant={qrType.category === 'dynamic' ? 'default' : 'outline'}>
                    {qrType.category === 'dynamic' ? 'Dynamic' : 'Static'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Size:</span>
                  <span>{customizeData.size}x{customizeData.size}px</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Error Correction:</span>
                  <span>{customizeData.errorCorrection} Level</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Content:</span>
                  <span className="text-sm text-gray-500 max-w-48 truncate">
                    {getQRContent()}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">What's next?</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Download and save your QR code</li>
                  <li>• Test it with your phone camera</li>
                  <li>• Print it on marketing materials</li>
                  {qrType.category === 'dynamic' && (
                    <li>• Track scans in your dashboard</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Customize
            </Button>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-green-600 hover:bg-green-700"
            >
              Create Another QR Code
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
