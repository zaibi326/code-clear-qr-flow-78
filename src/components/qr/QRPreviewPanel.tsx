
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          QR Code Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            {isGenerating ? (
              <div 
                className="bg-gray-100 border rounded-lg flex items-center justify-center animate-pulse"
                style={{ width: config.size, height: config.size }}
              >
                <QrCode className="h-16 w-16 text-gray-400" />
              </div>
            ) : generatedQR ? (
              <img 
                src={generatedQR} 
                alt="Generated QR Code"
                className="border rounded-lg"
                style={{ width: config.size, height: config.size }}
              />
            ) : (
              <div 
                className="bg-gray-100 border rounded-lg flex items-center justify-center"
                style={{ width: config.size, height: config.size }}
              >
                <QrCode className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-2">
            <Button onClick={handleDownload} size="sm" disabled={!generatedQR}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button onClick={handleCopy} variant="outline" size="sm" disabled={!generatedQR}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button onClick={handleShare} variant="outline" size="sm" disabled={!generatedQR}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
