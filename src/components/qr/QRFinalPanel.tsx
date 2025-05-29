
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Download, Share2, Copy, Check } from 'lucide-react';
import { QRCodeType } from './QRGeneratorStepper';
import { generateQRContent } from './utils/qrContentGenerator';
import QRCode from 'qrcode';

interface QRFinalPanelProps {
  qrType: QRCodeType;
  setupData: any;
  customizeData: any;
  onBack: () => void;
}

export function QRFinalPanel({ qrType, setupData, customizeData, onBack }: QRFinalPanelProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    generateQRCode();
  }, [qrType, setupData, customizeData]);

  const generateQRCode = async () => {
    try {
      const content = generateQRContent(qrType.id, setupData);
      console.log('Generating QR code for content:', content);
      
      const dataUrl = await QRCode.toDataURL(content, {
        width: customizeData.size || 256,
        margin: (customizeData.borderSize || 4) / 8,
        color: {
          dark: customizeData.foregroundColor || '#000000',
          light: customizeData.backgroundColor || '#FFFFFF'
        },
        errorCorrectionLevel: customizeData.errorCorrection || 'M'
      });
      
      setQrCodeDataUrl(dataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handleDownload = () => {
    if (qrCodeDataUrl) {
      const link = document.createElement('a');
      link.href = qrCodeDataUrl;
      link.download = `qr-code-${qrType.id}-${Date.now()}.png`;
      link.click();
    }
  };

  const handleCopy = async () => {
    if (qrCodeDataUrl) {
      try {
        const response = await fetch(qrCodeDataUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy QR code:', error);
      }
    }
  };

  const getQRContent = () => {
    return generateQRContent(qrType.id, setupData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${qrType.color} text-white`}>
              <qrType.icon className="h-5 w-5" />
            </div>
            Your QR Code is Ready!
            <Badge className="bg-green-100 text-green-700 border-green-200">
              {qrType.category === 'dynamic' ? 'Dynamic' : 'Static'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* QR Code Display */}
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white p-6 rounded-lg border-2 border-gray-200 shadow-sm">
                {qrCodeDataUrl ? (
                  <img 
                    src={qrCodeDataUrl} 
                    alt="Generated QR Code"
                    className="max-w-full h-auto"
                    style={{ width: Math.min(customizeData.size || 256, 300) }}
                  />
                ) : (
                  <div 
                    className="bg-gray-100 rounded-lg flex items-center justify-center"
                    style={{ width: 256, height: 256 }}
                  >
                    <span className="text-gray-500">Generating QR Code...</span>
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button onClick={handleDownload} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download PNG
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCopy}
                  className="flex items-center gap-2"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>

            {/* QR Code Details */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">QR Code Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{qrType.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <Badge variant={qrType.category === 'dynamic' ? 'default' : 'secondary'}>
                      {qrType.category === 'dynamic' ? 'Dynamic' : 'Static'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Size:</span>
                    <span className="font-medium">{customizeData.size || 256}px</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Error Correction:</span>
                    <span className="font-medium">{customizeData.errorCorrection || 'M'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Content Preview:</h4>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <code className="text-sm break-all">{getQRContent()}</code>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Function:</h4>
                <p className="text-sm text-gray-600">{qrType.description}</p>
              </div>

              {qrType.category === 'dynamic' && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Dynamic QR Benefits:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Modify content without reprinting</li>
                    <li>• Track scans and analytics</li>
                    <li>• Update destination URLs anytime</li>
                  </ul>
                </div>
              )}
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
              className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
            >
              Create Another QR Code
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
