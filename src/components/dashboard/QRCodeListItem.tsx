
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { QrCode } from 'lucide-react';
import { QRCodeActions } from './QRCodeActions';

interface QRCodeListItemProps {
  qr: any;
  onEdit: (qr: any) => void;
  onDownload: (qr: any) => void;
  onDuplicate: (qr: any) => void;
  onDelete: (qr: any) => void;
}

export function QRCodeListItem({ qr, onEdit, onDownload, onDuplicate, onDelete }: QRCodeListItemProps) {
  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <QrCode className="h-6 w-6 text-gray-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 truncate">{qr.name}</h4>
            <p className="text-sm text-gray-500 truncate">{qr.url}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Badge variant={qr.type === 'dynamic' ? 'default' : 'secondary'} className="text-xs">
              {qr.type}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {qr.category}
            </Badge>
          </div>
          
          <div className="text-center">
            <p className="font-medium text-sm">{qr.scans.toLocaleString()}</p>
            <p className="text-xs text-gray-500">scans</p>
          </div>
          
          <Badge 
            variant={qr.status === 'active' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {qr.status}
          </Badge>
          
          <span className="text-sm text-gray-500 w-20 text-right">{qr.created}</span>
          
          <QRCodeActions
            qr={qr}
            onEdit={onEdit}
            onDownload={onDownload}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
            variant="list"
          />
        </div>
      </div>
    </div>
  );
}
