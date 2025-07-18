
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

  const handleTypeClick = (type: QRCodeType) => {
    console.log('QRTypeSelector: Type clicked:', type);
    onTypeSelect(type);
  };

  return (
    <div className="space-y-12">
      {/* Dynamic QR Codes Section */}
      <div>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-2xl font-bold text-gray-900">Dynamic QR Codes</h2>
            <Badge className="bg-green-100 text-green-700 border-green-200">Trackable</Badge>
          </div>
          <p className="text-gray-600 text-lg">
            Modify content anytime, even after printing
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dynamicQRTypes.map((type) => (
            <Card 
              key={type.id} 
              className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:border-blue-300 hover:scale-105 group bg-white border border-gray-200"
              onClick={() => handleTypeClick(type)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-lg ${type.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                    <type.icon className="h-6 w-6" />
                  </div>
                  {type.badge && (
                    <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 border-orange-200">
                      {type.badge}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {type.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
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
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-2xl font-bold text-gray-900">Static QR Codes</h2>
            <Badge variant="outline" className="text-gray-600 border-gray-300">Non-Trackable</Badge>
          </div>
          <p className="text-gray-600 text-lg">
            Create permanent QR Codes that cannot be modified
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {staticQRTypes.map((type) => (
            <Card 
              key={type.id} 
              className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:border-blue-300 hover:scale-105 group bg-white border border-gray-200"
              onClick={() => handleTypeClick(type)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-lg ${type.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                    <type.icon className="h-6 w-6" />
                  </div>
                  <Badge variant="outline" className="text-xs text-gray-600 border-gray-300">
                    Static
                  </Badge>
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {type.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {type.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Preview Note */}
      <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-blue-700 font-medium">
          💡 Preview: Hover over a QR code type to see preview functionality
        </p>
      </div>
    </div>
  );
}
