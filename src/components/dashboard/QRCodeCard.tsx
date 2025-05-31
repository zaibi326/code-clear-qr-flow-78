
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QrCode, Eye } from 'lucide-react';
import { QRCodeActions } from './QRCodeActions';

interface QRCodeCardProps {
  qr: any;
  onEdit: (qr: any) => void;
  onDownload: (qr: any) => void;
  onDuplicate: (qr: any) => void;
  onDelete: (qr: any) => void;
}

export function QRCodeCard({ qr, onEdit, onDownload, onDuplicate, onDelete }: QRCodeCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer relative">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 mb-1 truncate">{qr.name}</h4>
            <p className="text-sm text-gray-500 truncate">{qr.url}</p>
          </div>
          
          <QRCodeActions
            qr={qr}
            onEdit={onEdit}
            onDownload={onDownload}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
            variant="card"
          />
        </div>

        <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
          <QrCode className="h-16 w-16 text-gray-400" />
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex space-x-2">
            <Badge 
              variant={qr.type === 'dynamic' ? 'default' : 'secondary'} 
              className="text-xs"
            >
              {qr.type}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {qr.category}
            </Badge>
          </div>
          <Badge 
            variant={qr.status === 'active' ? 'default' : 'secondary'} 
            className="text-xs"
          >
            {qr.status}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1 text-gray-600">
            <Eye className="h-4 w-4" />
            <span>{qr.scans.toLocaleString()}</span>
          </div>
          <span className="text-gray-500">{qr.created}</span>
        </div>
      </CardContent>
    </Card>
  );
}
