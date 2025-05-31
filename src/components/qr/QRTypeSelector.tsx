
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dynamicQRTypes, staticQRTypes } from './qrTypeData';
import { QRCodeType } from './QRGeneratorStepper';

interface QRTypeSelectorProps {
  onTypeSelect: (type: QRCodeType) => void;
  initialType?: string;
}

export function QRTypeSelector({ onTypeSelect, initialType }: QRTypeSelectorProps) {
  console.log('QRTypeSelector: initialType received:', initialType);

  // Auto-select type if initialType is provided
  React.useEffect(() => {
    if (initialType) {
      const allTypes = [...dynamicQRTypes, ...staticQRTypes];
      const foundType = allTypes.find(type => type.id === initialType);
      if (foundType) {
        console.log('QRTypeSelector: Auto-selecting type:', foundType);
        onTypeSelect(foundType);
      }
    }
  }, [initialType, onTypeSelect]);

  const handleTypeClick = (type: QRCodeType) => {
    console.log('QRTypeSelector: Type clicked:', type);
    onTypeSelect(type);
  };

  return (
    <div className="space-y-8">
      {/* Dynamic QR Codes Section */}
      <div>
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Dynamic QR Codes</h3>
          <p className="text-gray-600">QR codes that can be edited after creation. Perfect for campaigns and changing content.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dynamicQRTypes.map((type) => (
            <Card 
              key={type.id} 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-blue-300"
              onClick={() => handleTypeClick(type)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${type.color} text-white`}>
                    <type.icon className="h-6 w-6" />
                  </div>
                  {type.badge && (
                    <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 border-orange-200">
                      {type.badge}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{type.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {type.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Static QR Codes Section */}
      <div>
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Static QR Codes</h3>
          <p className="text-gray-600">QR codes with fixed content that cannot be changed after creation. Great for permanent information.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staticQRTypes.map((type) => (
            <Card 
              key={type.id} 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-blue-300"
              onClick={() => handleTypeClick(type)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${type.color} text-white`}>
                    <type.icon className="h-6 w-6" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Static
                  </Badge>
                </div>
                <CardTitle className="text-lg">{type.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {type.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
