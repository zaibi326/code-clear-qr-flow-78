
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
    <div className="space-y-6">
      {/* Tools Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Elements Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Add Elements</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onAddQRCode}
                className="flex flex-col h-20 p-3 hover:bg-blue-50 hover:border-blue-300"
              >
                <QrCode className="h-5 w-5 mb-2 text-blue-600" />
                <span className="text-xs font-medium">QR Code</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onAddText}
                className="flex flex-col h-20 p-3 hover:bg-green-50 hover:border-green-300"
              >
                <Type className="h-5 w-5 mb-2 text-green-600" />
                <span className="text-xs font-medium">Text</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddShape('rectangle')}
                className="flex flex-col h-20 p-3 hover:bg-purple-50 hover:border-purple-300"
              >
                <Square className="h-5 w-5 mb-2 text-purple-600" />
                <span className="text-xs font-medium">Rectangle</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddShape('circle')}
                className="flex flex-col h-20 p-3 hover:bg-orange-50 hover:border-orange-300"
              >
                <CircleIcon className="h-5 w-5 mb-2 text-orange-600" />
                <span className="text-xs font-medium">Circle</span>
              </Button>
            </div>
            
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={onUploadImage}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                id="image-upload"
              />
              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center gap-2 h-12 hover:bg-gray-50"
                asChild
              >
                <label htmlFor="image-upload" className="cursor-pointer">
                  <ImageIcon className="h-4 w-4" />
                  Upload Image
                </label>
              </Button>
            </div>
          </div>

          <Separator />

          {/* Canvas Controls Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Canvas</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onZoomCanvas('in')}
                className="flex items-center gap-1"
              >
                <ZoomIn className="h-4 w-4" />
                <span className="text-xs">Zoom In</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onZoomCanvas('out')}
                className="flex items-center gap-1"
              >
                <ZoomOut className="h-4 w-4" />
                <span className="text-xs">Zoom Out</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onResetCanvas}
                className="flex items-center gap-1"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="text-xs">Reset</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onDeleteSelected}
                disabled={!hasSelectedObject}
                className="flex items-center gap-1 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                <span className="text-xs">Delete</span>
              </Button>
            </div>
          </div>

          <Separator />

          {/* Quick Settings Section */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-700">Quick Settings</Label>
            
            <div className="space-y-2">
              <Label className="text-xs text-gray-600">QR URL</Label>
              <Input
                value={qrUrl}
                onChange={(e) => setQrUrl(e.target.value)}
                placeholder="https://example.com"
                className="text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs text-gray-600">Text Content</Label>
              <Input
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Sample Text"
                className="text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
