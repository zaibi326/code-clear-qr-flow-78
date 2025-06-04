
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Copy, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const handleDownload = (format: 'png' | 'jpg' | 'svg' = 'png') => {
    if (!generatedQR) {
      toast({
        title: "Error",
        description: "No QR code to download",
        variant: "destructive"
      });
      return;
    }

    const link = document.createElement('a');
    link.download = `qr-code-${Date.now()}.${format}`;
    link.href = generatedQR;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Success",
      description: `QR code downloaded as ${format.toUpperCase()}!`
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
          text: 'Check out this QR code!',
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
    <div className="flex flex-col items-center justify-start space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-gray-200 relative">
        {generatedQR ? (
          <div className="relative">
            <img 
              src={generatedQR} 
              alt="Generated QR Code" 
              className="w-64 h-64 object-contain rounded-lg"
            />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none"></div>
          </div>
        ) : (
          <div className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 font-medium">Live Preview</p>
              <p className="text-xs text-gray-500 max-w-xs">
                Your QR code will appear here as you fill in the form fields
              </p>
            </div>
          </div>
        )}
        
        {/* Hidden canvas for QR generation */}
        <canvas 
          ref={canvasRef} 
          className="hidden"
          width={256}
          height={256}
        />
      </div>

      {/* Color Preview */}
      {foregroundColor && backgroundColor && (
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded border border-gray-300" 
              style={{ backgroundColor: foregroundColor }}
              title="Foreground Color"
            ></div>
            <span>Foreground</span>
          </div>
          <div className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded border border-gray-300" 
              style={{ backgroundColor: backgroundColor }}
              title="Background Color"
            ></div>
            <span>Background</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {generatedQR && (
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <Button 
              onClick={() => handleDownload('png')} 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              PNG
            </Button>
            <Button 
              onClick={() => handleDownload('jpg')} 
              size="sm" 
              variant="outline"
              className="border-blue-200 hover:bg-blue-50"
            >
              <Download className="h-4 w-4 mr-2" />
              JPG
            </Button>
            <Button 
              onClick={handleCopy} 
              variant="outline" 
              size="sm" 
              className="border-gray-300 hover:bg-gray-50"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button 
              onClick={handleShare} 
              variant="outline" 
              size="sm" 
              className="border-gray-300 hover:bg-gray-50"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Available formats: PNG, JPG • Ready to download, copy, or share
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
