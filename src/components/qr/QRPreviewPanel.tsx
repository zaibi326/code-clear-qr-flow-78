
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QrCode, Download, Copy, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { QRCodeConfig } from '@/hooks/useQRGenerator';

interface QRPreviewPanelProps {
  config: QRCodeConfig;
  generatedQR: string | null;
  isGenerating: boolean;
}

export function QRPreviewPanel({ config, generatedQR, isGenerating }: QRPreviewPanelProps) {
  const { toast } = useToast();

  const handleDownload = () => {
    if (!generatedQR) {
      toast({
        title: "Error",
        description: "No QR code to download",
        variant: "destructive"
      });
      return;
    }

    const link = document.createElement('a');
    link.download = `qr-code-${Date.now()}.png`;
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
    if (!generatedQR) {
      toast({
        title: "Error",
        description: "No QR code to copy",
        variant: "destructive"
      });
      return;
    }

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
      console.error('Copy error:', error);
      toast({
        title: "Error",
        description: "Failed to copy QR code to clipboard",
        variant: "destructive"
      });
    }
  };

  const handleShare = async () => {
    if (!generatedQR) {
      toast({
        title: "Error",
        description: "No QR code to share",
        variant: "destructive"
      });
      return;
    }

    if (navigator.share) {
      try {
        const response = await fetch(generatedQR);
        const blob = await response.blob();
        const file = new File([blob], `qr-code-${Date.now()}.png`, { type: 'image/png' });
        
        await navigator.share({
          title: 'QR Code',
          text: 'Check out this QR code from ClearQR.io',
          files: [file]
        });
        
        toast({
          title: "Success",
          description: "QR code shared successfully!"
        });
      } catch (error) {
        console.error('Share error:', error);
        toast({
          title: "Error",
          description: "Failed to share QR code",
          variant: "destructive"
        });
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(generatedQR);
        toast({
          title: "Copied",
          description: "QR code URL copied to clipboard!"
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Sharing not supported in this browser",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* QR Code Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-6">
            <div className="relative inline-block">
              {isGenerating ? (
                <div 
                  className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center animate-pulse"
                  style={{ width: config.size, height: config.size }}
                >
                  <QrCode className="h-16 w-16 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Generating...</p>
                </div>
              ) : generatedQR ? (
                <div className="relative group">
                  <img 
                    src={generatedQR} 
                    alt="Generated QR Code"
                    className="border-2 border-gray-200 rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                    style={{ width: config.size, height: config.size }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Badge className="bg-white text-gray-800 shadow-lg">
                        Ready to Download
                      </Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <div 
                  className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center"
                  style={{ width: config.size, height: config.size }}
                >
                  <QrCode className="h-16 w-16 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-500 text-center px-4">
                    Enter content to generate your QR code
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Button 
                onClick={handleDownload} 
                size="sm" 
                disabled={!generatedQR}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button 
                onClick={handleCopy} 
                variant="outline" 
                size="sm" 
                disabled={!generatedQR}
                className="border-gray-300 hover:bg-gray-50"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button 
                onClick={handleShare} 
                variant="outline" 
                size="sm" 
                disabled={!generatedQR}
                className="border-gray-300 hover:bg-gray-50"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            {/* QR Code Stats */}
            {generatedQR && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-gray-900">QR Code Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <span className="ml-2 font-medium capitalize">{config.type}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Size:</span>
                    <span className="ml-2 font-medium">{config.size}x{config.size}px</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Format:</span>
                    <span className="ml-2 font-medium">PNG</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Quality:</span>
                    <span className="ml-2 font-medium">{config.errorCorrection} Level</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
