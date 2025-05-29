
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { QRCodeType } from '../QRGeneratorStepper';

interface QRInfoPanelProps {
  qrType: QRCodeType;
  customizeData: any;
  content: string;
}

export function QRInfoPanel({ qrType, customizeData, content }: QRInfoPanelProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">QR Code Details</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Type:</span>
          <Badge className={`${qrType.color} text-white border-0`}>
            {qrType.title}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Category:</span>
          <Badge variant={qrType.category === 'dynamic' ? 'default' : 'outline'}>
            {qrType.category === 'dynamic' ? 'Dynamic' : 'Static'}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Size:</span>
          <span>{customizeData.size}x{customizeData.size}px</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Error Correction:</span>
          <span>{customizeData.errorCorrection} Level</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Content:</span>
          <span className="text-sm text-gray-500 max-w-48 truncate">
            {content}
          </span>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">What's next?</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Download and save your QR code</li>
          <li>• Test it with your phone camera</li>
          <li>• Print it on marketing materials</li>
          {qrType.category === 'dynamic' && (
            <li>• Track scans in your dashboard</li>
          )}
        </ul>
      </div>
    </div>
  );
}
