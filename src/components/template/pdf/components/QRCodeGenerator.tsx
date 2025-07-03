
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { 
  QrCode, 
  X, 
  Link, 
  Globe, 
  Mail, 
  Phone, 
  Wifi,
  User,
  MessageSquare,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { generateQRCode } from '@/utils/qrCodeGenerator';

interface QRCodeGeneratorProps {
  onGenerate: (url: string, size: number) => void;
  onClose: () => void;
  selectedElement?: string | null;
  onRegenerate?: (elementId: string, newUrl: string) => void;
  currentQRUrl?: string;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  onGenerate,
  onClose,
  selectedElement,
  onRegenerate,
  currentQRUrl
}) => {
  const [qrType, setQrType] = useState<'url' | 'text' | 'email' | 'phone' | 'wifi' | 'sms'>('url');
  const [qrContent, setQrContent] = useState(currentQRUrl || 'https://');
  const [qrSize, setQrSize] = useState(150);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [wifiConfig, setWifiConfig] = useState({
    ssid: '',
    password: '',
    security: 'WPA'
  });
  const [emailConfig, setEmailConfig] = useState({
    email: '',
    subject: '',
    body: ''
  });

  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    generatePreview();
  }, [qrContent, qrSize, qrType, wifiConfig, emailConfig]);

  const generatePreview = async () => {
    if (!qrContent.trim() && qrType !== 'wifi' && qrType !== 'email') return;

    setIsGenerating(true);
    try {
      let content = qrContent;
      
      // Format content based on type
      switch (qrType) {
        case 'url':
          if (!content.startsWith('http://') && !content.startsWith('https://') && content !== 'https://') {
            content = `https://${content}`;
          }
          break;
        case 'email':
          const { email, subject, body } = emailConfig;
          if (email) {
            content = `mailto:${email}`;
            if (subject || body) {
              const params = new URLSearchParams();
              if (subject) params.append('subject', subject);
              if (body) params.append('body', body);
              content += `?${params.toString()}`;
            }
          }
          break;
        case 'phone':
          content = content.startsWith('tel:') ? content : `tel:${content}`;
          break;
        case 'sms':
          content = content.startsWith('sms:') ? content : `sms:${content}`;
          break;
        case 'wifi':
          const { ssid, password, security } = wifiConfig;
          if (ssid) {
            content = `WIFI:T:${security};S:${ssid};P:${password};H:false;;`;
          }
          break;
      }

      if (content && content.trim()) {
        const result = await generateQRCode(content, { size: qrSize });
        setPreviewImage(result.dataURL);
      }
    } catch (error) {
      console.error('Error generating QR preview:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = () => {
    let finalContent = qrContent;

    switch (qrType) {
      case 'url':
        if (!finalContent.startsWith('http://') && !finalContent.startsWith('https://') && finalContent !== 'https://') {
          finalContent = `https://${finalContent}`;
        }
        break;
      case 'email':
        const { email, subject, body } = emailConfig;
        if (email) {
          finalContent = `mailto:${email}`;
          if (subject || body) {
            const params = new URLSearchParams();
            if (subject) params.append('subject', subject);
            if (body) params.append('body', body);
            finalContent += `?${params.toString()}`;
          }
        }
        break;
      case 'phone':
        finalContent = finalContent.startsWith('tel:') ? finalContent : `tel:${finalContent}`;
        break;
      case 'sms':
        finalContent = finalContent.startsWith('sms:') ? finalContent : `sms:${finalContent}`;
        break;
      case 'wifi':
        const { ssid, password, security } = wifiConfig;
        if (ssid) {
          finalContent = `WIFI:T:${security};S:${ssid};P:${password};H:false;;`;
        }
        break;
    }

    if (selectedElement && onRegenerate) {
      onRegenerate(selectedElement, finalContent);
    } else {
      onGenerate(finalContent, qrSize);
    }
  };

  const qrTypes = [
    { id: 'url', label: 'Website URL', icon: Globe },
    { id: 'text', label: 'Plain Text', icon: MessageSquare },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'phone', label: 'Phone', icon: Phone },
    { id: 'sms', label: 'SMS', icon: MessageSquare },
    { id: 'wifi', label: 'WiFi', icon: Wifi }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            {selectedElement ? 'Edit QR Code' : 'Generate QR Code'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* QR Type Selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">QR Code Type</Label>
            <div className="grid grid-cols-3 gap-2">
              {qrTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <Button
                    key={type.id}
                    variant={qrType === type.id ? 'default' : 'outline'}
                    size="sm"
                    className="flex flex-col items-center gap-1 h-auto py-3"
                    onClick={() => setQrType(type.id as any)}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-xs">{type.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Content Input */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Content</Label>
              
              {qrType === 'url' && (
                <div>
                  <Input
                    type="url"
                    placeholder="https://example.com"
                    value={qrContent}
                    onChange={(e) => setQrContent(e.target.value)}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the website URL you want to link to
                  </p>
                </div>
              )}

              {qrType === 'text' && (
                <div>
                  <textarea
                    placeholder="Enter your text here..."
                    value={qrContent}
                    onChange={(e) => setQrContent(e.target.value)}
                    className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter any text content
                  </p>
                </div>
              )}

              {qrType === 'email' && (
                <div className="space-y-3">
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={emailConfig.email}
                    onChange={(e) => setEmailConfig(prev => ({ ...prev, email: e.target.value }))}
                  />
                  <Input
                    placeholder="Subject (optional)"
                    value={emailConfig.subject}
                    onChange={(e) => setEmailConfig(prev => ({ ...prev, subject: e.target.value }))}
                  />
                  <textarea
                    placeholder="Email body (optional)"
                    value={emailConfig.body}
                    onChange={(e) => setEmailConfig(prev => ({ ...prev, body: e.target.value }))}
                    className="w-full min-h-[60px] px-3 py-2 border border-gray-300 rounded-md resize-none"
                  />
                </div>
              )}

              {(qrType === 'phone' || qrType === 'sms') && (
                <div>
                  <Input
                    type="tel"
                    placeholder="+1234567890"
                    value={qrContent}
                    onChange={(e) => setQrContent(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter phone number with country code
                  </p>
                </div>
              )}

              {qrType === 'wifi' && (
                <div className="space-y-3">
                  <Input
                    placeholder="WiFi Network Name (SSID)"
                    value={wifiConfig.ssid}
                    onChange={(e) => setWifiConfig(prev => ({ ...prev, ssid: e.target.value }))}
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={wifiConfig.password}
                    onChange={(e) => setWifiConfig(prev => ({ ...prev, password: e.target.value }))}
                  />
                  <select
                    value={wifiConfig.security}
                    onChange={(e) => setWifiConfig(prev => ({ ...prev, security: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">No Password</option>
                  </select>
                </div>
              )}

              {/* Size Control */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  QR Code Size: {qrSize}px
                </Label>
                <Slider
                  value={[qrSize]}
                  onValueChange={(value) => setQrSize(value[0])}
                  min={100}
                  max={400}
                  step={10}
                  className="w-full"
                />
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Preview</Label>
              <div 
                ref={previewRef}
                className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[200px] bg-gray-50"
              >
                {isGenerating ? (
                  <div className="text-center">
                    <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Generating preview...</p>
                  </div>
                ) : previewImage ? (
                  <img
                    src={previewImage}
                    alt="QR Code Preview"
                    className="max-w-full max-h-full"
                    style={{ width: Math.min(200, qrSize), height: Math.min(200, qrSize) }}
                  />
                ) : (
                  <div className="text-center">
                    <QrCode className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Preview will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleGenerate}
              disabled={!previewImage || isGenerating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {selectedElement ? 'Update QR Code' : 'Add QR Code'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
