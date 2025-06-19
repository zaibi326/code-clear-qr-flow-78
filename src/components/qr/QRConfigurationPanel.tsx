
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings } from 'lucide-react';
import { QRCodeConfig } from '@/hooks/useQRGenerator';

interface QRConfigurationPanelProps {
  config: QRCodeConfig;
  onConfigChange: (config: QRCodeConfig) => void;
  onContentChange: (value: string) => void;
}

export function QRConfigurationPanel({ config, onConfigChange, onContentChange }: QRConfigurationPanelProps) {
  // Ensure all QR type options have non-empty values
  const qrTypes = [
    { value: 'url', label: 'Website URL', icon: '🌐' },
    { value: 'text', label: 'Plain Text', icon: '📝' },
    { value: 'email', label: 'Email Address', icon: '📧' },
    { value: 'phone', label: 'Phone Number', icon: '📞' },
    { value: 'wifi', label: 'WiFi Network', icon: '📶' },
    { value: 'vcard', label: 'Contact Card', icon: '👤' }
  ].filter(type => type.value.trim() !== '');

  // Ensure all error level options have non-empty values
  const errorLevels = [
    { value: 'L', label: 'Low (~7%)', description: 'Suitable for clean environments' },
    { value: 'M', label: 'Medium (~15%)', description: 'Recommended for most use cases' },
    { value: 'Q', label: 'Quartile (~25%)', description: 'Good for outdoor use' },
    { value: 'H', label: 'High (~30%)', description: 'Maximum durability' }
  ].filter(level => level.value.trim() !== '');

  console.log('QRConfigurationPanel qrTypes:', qrTypes);
  console.log('QRConfigurationPanel errorLevels:', errorLevels);

  const setConfig = (updater: (prev: QRCodeConfig) => QRCodeConfig) => {
    onConfigChange(updater(config));
  };

  return (
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
                onChange={(e) => onContentChange(e.target.value)}
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
  );
}
