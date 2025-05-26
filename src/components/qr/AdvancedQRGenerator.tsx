
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { QrCode, Download, Copy, Share2, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QRCodeLib from 'qrcode';

interface QRCodeConfig {
  content: string;
  type: 'url' | 'text' | 'email' | 'phone' | 'wifi' | 'vcard';
  size: number;
  errorCorrection: 'L' | 'M' | 'Q' | 'H';
  foregroundColor: string;
  backgroundColor: string;
  borderSize: number;
  logoUrl?: string;
}

export function AdvancedQRGenerator() {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [config, setConfig] = useState<QRCodeConfig>({
    content: 'https://clearqr.io',
    type: 'url',
    size: 256,
    errorCorrection: 'M',
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF',
    borderSize: 4
  });

  const [generatedQR, setGeneratedQR] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const qrTypes = [
    { value: 'url', label: 'Website URL', icon: '🌐' },
    { value: 'text', label: 'Plain Text', icon: '📝' },
    { value: 'email', label: 'Email Address', icon: '📧' },
    { value: 'phone', label: 'Phone Number', icon: '📞' },
    { value: 'wifi', label: 'WiFi Network', icon: '📶' },
    { value: 'vcard', label: 'Contact Card', icon: '👤' }
  ];

  const errorLevels = [
    { value: 'L', label: 'Low (~7%)', description: 'Suitable for clean environments' },
    { value: 'M', label: 'Medium (~15%)', description: 'Recommended for most use cases' },
    { value: 'Q', label: 'Quartile (~25%)', description: 'Good for outdoor use' },
    { value: 'H', label: 'High (~30%)', description: 'Maximum durability' }
  ];

  const generateQRCode = async () => {
    if (!config.content.trim()) {
      toast({
        title: "Error",
        description: "Please enter content for the QR code",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error('Canvas not found');

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
      
      toast({
        title: "Success",
        description: "QR code generated successfully!"
      });
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
      generateQRCode();
    }
  }, [config]);

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Hidden canvas for QR generation */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      {/* Configuration Panel */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              QR Code Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="space-y-4">
                <div>
                  <Label htmlFor="qr-type">QR Code Type</Label>
                  <Select value={config.type} onValueChange={(value: any) => setConfig(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {qrTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <span>{type.icon}</span>
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                  <Input
                    id="content"
                    value={config.content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder="Enter your content here..."
                  />
                </div>
              </TabsContent>

              <TabsContent value="design" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="foreground-color">Foreground Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        value={config.foregroundColor}
                        onChange={(e) => setConfig(prev => ({ ...prev, foregroundColor: e.target.value }))}
                        className="w-12 h-10 p-1 rounded"
                      />
                      <Input
                        value={config.foregroundColor}
                        onChange={(e) => setConfig(prev => ({ ...prev, foregroundColor: e.target.value }))}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="background-color">Background Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        value={config.backgroundColor}
                        onChange={(e) => setConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                        className="w-12 h-10 p-1 rounded"
                      />
                      <Input
                        value={config.backgroundColor}
                        onChange={(e) => setConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="size">Size: {config.size}px</Label>
                  <Input
                    type="range"
                    min="128"
                    max="512"
                    step="32"
                    value={config.size}
                    onChange={(e) => setConfig(prev => ({ ...prev, size: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4">
                <div>
                  <Label>Error Correction Level</Label>
                  <Select value={config.errorCorrection} onValueChange={(value: any) => setConfig(prev => ({ ...prev, errorCorrection: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {errorLevels.map(level => (
                        <SelectItem key={level.value} value={level.value}>
                          <div>
                            <div className="font-medium">{level.label}</div>
                            <div className="text-xs text-gray-500">{level.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="border-size">Border Size: {config.borderSize}px</Label>
                  <Input
                    type="range"
                    min="0"
                    max="20"
                    value={config.borderSize}
                    onChange={(e) => setConfig(prev => ({ ...prev, borderSize: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Preview Panel */}
      <div className="space-y-6">
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

        <Card>
          <CardHeader>
            <CardTitle>QR Code Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <Badge variant="outline">
                  {qrTypes.find(t => t.value === config.type)?.label}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Size:</span>
                <span>{config.size}x{config.size}px</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Error Correction:</span>
                <span>{config.errorCorrection} Level</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Content Length:</span>
                <span>{config.content.length} chars</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
