
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Palette } from 'lucide-react';
import { QRCodeType } from './QRGeneratorStepper';

interface QRCustomizePanelProps {
  qrType: QRCodeType;
  setupData: any;
  onComplete: (data: any) => void;
  onBack: () => void;
}

export function QRCustomizePanel({ qrType, setupData, onComplete, onBack }: QRCustomizePanelProps) {
  const [customizeData, setCustomizeData] = useState({
    size: 256,
    errorCorrection: 'M',
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF',
    borderSize: 4,
    style: 'square'
  });

  const handleInputChange = (field: string, value: any) => {
    console.log(`Updating ${field} to:`, value);
    setCustomizeData(prev => {
      const updated = { ...prev, [field]: value };
      console.log('Updated customizeData:', updated);
      return updated;
    });
  };

  const handleContinue = () => {
    console.log('Completing customization with data:', customizeData);
    onComplete(customizeData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500 text-white">
              <Palette className="h-5 w-5" />
            </div>
            Customize Your QR Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Customization Options */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="foreground-color">Foreground Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      id="foreground-color"
                      value={customizeData.foregroundColor}
                      onChange={(e) => handleInputChange('foregroundColor', e.target.value)}
                      className="w-12 h-10 p-1 rounded border cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={customizeData.foregroundColor}
                      onChange={(e) => handleInputChange('foregroundColor', e.target.value)}
                      className="flex-1"
                      placeholder="#000000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="background-color">Background Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      id="background-color"
                      value={customizeData.backgroundColor}
                      onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                      className="w-12 h-10 p-1 rounded border cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={customizeData.backgroundColor}
                      onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                      className="flex-1"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">Size: {customizeData.size}px</Label>
                <Input
                  type="range"
                  id="size"
                  min="128"
                  max="512"
                  step="32"
                  value={customizeData.size}
                  onChange={(e) => handleInputChange('size', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Error Correction Level</Label>
                <Select 
                  value={customizeData.errorCorrection} 
                  onValueChange={(value) => handleInputChange('errorCorrection', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Low (~7%)</SelectItem>
                    <SelectItem value="M">Medium (~15%)</SelectItem>
                    <SelectItem value="Q">Quartile (~25%)</SelectItem>
                    <SelectItem value="H">High (~30%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="border-size">Border Size: {customizeData.borderSize}px</Label>
                <Input
                  type="range"
                  id="border-size"
                  min="0"
                  max="20"
                  value={customizeData.borderSize}
                  onChange={(e) => handleInputChange('borderSize', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            {/* Preview */}
            <div className="flex items-center justify-center">
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div 
                  className="mx-auto border-2 border-gray-200 rounded-lg flex items-center justify-center"
                  style={{ 
                    width: Math.min(customizeData.size, 200), 
                    height: Math.min(customizeData.size, 200),
                    backgroundColor: customizeData.backgroundColor,
                    color: customizeData.foregroundColor
                  }}
                >
                  <div className="w-16 h-16 grid grid-cols-4 gap-0.5">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div 
                        key={i}
                        className="w-full h-full"
                        style={{ 
                          backgroundColor: Math.random() > 0.5 ? customizeData.foregroundColor : customizeData.backgroundColor 
                        }}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Live preview of your QR code colors
                </p>
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
              Back
            </Button>
            <Button 
              onClick={handleContinue}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
