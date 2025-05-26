
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QRCodeConfig } from '@/hooks/useQRGenerator';

interface QRCodeDetailsProps {
  config: QRCodeConfig;
}

const qrTypes = [
  { value: 'url', label: 'Website URL', icon: '🌐' },
  { value: 'text', label: 'Plain Text', icon: '📝' },
  { value: 'email', label: 'Email Address', icon: '📧' },
  { value: 'phone', label: 'Phone Number', icon: '📞' },
  { value: 'wifi', label: 'WiFi Network', icon: '📶' },
  { value: 'vcard', label: 'Contact Card', icon: '👤' }
];

export function QRCodeDetails({ config }: QRCodeDetailsProps) {
  return (
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
  );
}
