
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Type, 
  Square, 
  Circle as CircleIcon, 
  Image as ImageIcon, 
  QrCode, 
  RotateCcw, 
  ZoomIn,
  ZoomOut,
  Trash2
} from 'lucide-react';

interface CanvasToolbarProps {
  qrUrl: string;
  setQrUrl: (url: string) => void;
  textContent: string;
  setTextContent: (text: string) => void;
  onAddQRCode: () => void;
  onAddText: () => void;
  onAddShape: (type: 'rectangle' | 'circle') => void;
  onUploadImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onZoomCanvas: (direction: 'in' | 'out') => void;
  onResetCanvas: () => void;
  onDeleteSelected: () => void;
  hasSelectedObject: boolean;
}

export const CanvasToolbar = ({
  qrUrl,
  setQrUrl,
  textContent,
  setTextContent,
  onAddQRCode,
  onAddText,
  onAddShape,
  onUploadImage,
  onZoomCanvas,
  onResetCanvas,
  onDeleteSelected,
  hasSelectedObject
}: CanvasToolbarProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Tools</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Elements */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Add Elements</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onAddQRCode}
              className="flex flex-col h-16 p-2"
            >
              <QrCode className="h-4 w-4 mb-1" />
              <span className="text-xs">QR Code</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onAddText}
              className="flex flex-col h-16 p-2"
            >
              <Type className="h-4 w-4 mb-1" />
              <span className="text-xs">Text</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddShape('rectangle')}
              className="flex flex-col h-16 p-2"
            >
              <Square className="h-4 w-4 mb-1" />
              <span className="text-xs">Rectangle</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddShape('circle')}
              className="flex flex-col h-16 p-2"
            >
              <CircleIcon className="h-4 w-4 mb-1" />
              <span className="text-xs">Circle</span>
            </Button>
          </div>
          
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={onUploadImage}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button
              variant="outline"
              size="sm"
              className="w-full flex items-center gap-2"
            >
              <ImageIcon className="h-4 w-4" />
              Upload Image
            </Button>
          </div>
        </div>

        <Separator />

        {/* Canvas Controls */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Canvas</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onZoomCanvas('in')}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onZoomCanvas('out')}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onResetCanvas}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onDeleteSelected}
              disabled={!hasSelectedObject}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* Quick Settings */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Quick Settings</Label>
          
          <div>
            <Label className="text-xs">QR URL</Label>
            <Input
              value={qrUrl}
              onChange={(e) => setQrUrl(e.target.value)}
              placeholder="https://example.com"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label className="text-xs">Text Content</Label>
            <Input
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Enter text"
              className="mt-1"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
