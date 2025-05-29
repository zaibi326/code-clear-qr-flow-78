
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Lock } from 'lucide-react';
import { dynamicQRTypes, staticQRTypes } from './qrTypeData';
import { QRCodeType } from './QRGeneratorStepper';

interface QRTypeSelectorProps {
  onTypeSelect: (type: QRCodeType) => void;
  initialType?: string;
}

export function QRTypeSelector({ onTypeSelect, initialType }: QRTypeSelectorProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">
          Select QR Code Type
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose the type of QR code you want to create. Dynamic QR codes can be modified after creation, while static QR codes are permanent.
        </p>
      </div>

      {/* Dynamic QR Codes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Zap className="h-5 w-5 text-blue-600" />
            </div>
            Dynamic QR Codes
            <Badge className="bg-green-100 text-green-700 border-green-200">
              Trackable
            </Badge>
          </CardTitle>
          <p className="text-gray-600">
            Modify content anytime, even after printing
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {dynamicQRTypes.map((qrType) => (
              <div
                key={qrType.id}
                onClick={() => onTypeSelect(qrType)}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${qrType.color} text-white group-hover:scale-110 transition-transform duration-200`}>
                    <qrType.icon className="h-5 w-5" />
                  </div>
                  {qrType.badge && (
                    <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 border-orange-200">
                      {qrType.badge}
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {qrType.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {qrType.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Static QR Codes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Lock className="h-5 w-5 text-gray-600" />
            </div>
            Static QR Codes
            <Badge variant="outline" className="text-gray-600 border-gray-300">
              Non-Trackable
            </Badge>
          </CardTitle>
          <p className="text-gray-600">
            Create permanent QR Codes that cannot be modified
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {staticQRTypes.map((qrType) => (
              <div
                key={qrType.id}
                onClick={() => onTypeSelect(qrType)}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${qrType.color} text-white group-hover:scale-110 transition-transform duration-200`}>
                    <qrType.icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {qrType.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {qrType.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
