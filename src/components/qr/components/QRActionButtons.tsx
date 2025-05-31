
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Copy, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QRActionButtonsProps {
  generatedQR: string | null;
  qrTypeId: string;
}

export function QRActionButtons({ generatedQR, qrTypeId }: QRActionButtonsProps) {
  const { toast } = useToast();

  const handleDownload = () => {
    if (!generatedQR) return;

    const link = document.createElement('a');
    link.download = `qr-code-${qrTypeId}-${Date.now()}.png`;
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
        const file = new File([blob], `qr-code-${qrTypeId}-${Date.now()}.png`, { type: 'image/png' });
        
        await navigator.share({
          title: 'QR Code',
          text: `Check out this QR code`,
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
    <div className="flex items-center justify-center gap-4 flex-wrap">
      <Button 
        onClick={handleDownload} 
        disabled={!generatedQR}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 rounded-xl px-6 py-3"
      >
        <Download className="h-4 w-4 mr-2" />
        Download
      </Button>
      <Button 
        onClick={handleCopy} 
        variant="outline" 
        disabled={!generatedQR}
        className="border-indigo-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl px-6 py-3"
      >
        <Copy className="h-4 w-4 mr-2" />
        Copy
      </Button>
      <Button 
        onClick={handleShare} 
        variant="outline" 
        disabled={!generatedQR}
        className="border-indigo-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl px-6 py-3"
      >
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>
    </div>
  );
}
