
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
    <div className="space-y-6">
      <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">QR Code Details</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center py-3 border-b border-indigo-100">
          <span className="text-slate-600 font-medium">Type:</span>
          <Badge className={`${qrType.color} text-white border-0 shadow-md`}>
            {qrType.title}
          </Badge>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-indigo-100">
          <span className="text-slate-600 font-medium">Category:</span>
          <Badge variant={qrType.category === 'dynamic' ? 'default' : 'outline'} className="shadow-sm">
            {qrType.category === 'dynamic' ? 'Dynamic' : 'Static'}
          </Badge>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-indigo-100">
          <span className="text-slate-600 font-medium">Size:</span>
          <span className="font-semibold text-slate-700">{customizeData.size}x{customizeData.size}px</span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-indigo-100">
          <span className="text-slate-600 font-medium">Error Correction:</span>
          <span className="font-semibold text-slate-700">{customizeData.errorCorrection} Level</span>
        </div>
        <div className="flex justify-between items-center py-3">
          <span className="text-slate-600 font-medium">Content:</span>
          <span className="text-sm text-slate-500 max-w-48 truncate font-medium">
            {content}
          </span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100/50 shadow-sm">
        <h4 className="font-bold text-indigo-900 mb-3 text-lg">What's next?</h4>
        <ul className="text-sm text-indigo-700 space-y-2 font-medium">
          <li className="flex items-center">
            <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span>
            Download and save your QR code
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span>
            Test it with your phone camera
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span>
            Print it on marketing materials
          </li>
          {qrType.category === 'dynamic' && (
            <li className="flex items-center">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
              Track scans in your dashboard
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
