
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
    <div className="h-full overflow-y-auto bg-white">
      <div className="p-4 space-y-6">
        {/* Main Tools Section */}
        <div className="space-y-4">
          <div className="pb-2">
            <h3 className="text-lg font-semibold text-gray-900">Tools</h3>
          </div>
          
          {/* Add Elements */}
          <div className="space-y-3">
            <div className="pb-1">
              <h4 className="text-sm font-medium text-gray-700">Add Elements</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onAddQRCode}
                className="flex flex-col items-center justify-center h-20 p-3 hover:bg-blue-50 hover:border-blue-300 border-gray-200 space-y-2"
              >
                <QrCode className="h-5 w-5 text-blue-600" />
                <span className="text-xs font-medium text-gray-700">QR Code</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onAddText}
                className="flex flex-col items-center justify-center h-20 p-3 hover:bg-green-50 hover:border-green-300 border-gray-200 space-y-2"
              >
                <Type className="h-5 w-5 text-green-600" />
                <span className="text-xs font-medium text-gray-700">Text</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddShape('rectangle')}
                className="flex flex-col items-center justify-center h-20 p-3 hover:bg-purple-50 hover:border-purple-300 border-gray-200 space-y-2"
              >
                <Square className="h-5 w-5 text-purple-600" />
                <span className="text-xs font-medium text-gray-700">Rectangle</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddShape('circle')}
                className="flex flex-col items-center justify-center h-20 p-3 hover:bg-orange-50 hover:border-orange-300 border-gray-200 space-y-2"
              >
                <CircleIcon className="h-5 w-5 text-orange-600" />
                <span className="text-xs font-medium text-gray-700">Circle</span>
              </Button>
            </div>
            
            {/* Image Upload */}
            <div className="relative mt-3">
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
                className="w-full flex items-center justify-center gap-2 h-12 hover:bg-gray-50 border-gray-200"
                asChild
              >
                <label htmlFor="image-upload" className="cursor-pointer">
                  <ImageIcon className="h-4 w-4" />
                  <span className="text-sm">Upload Image</span>
                </label>
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Canvas Controls */}
          <div className="space-y-3">
            <div className="pb-1">
              <h4 className="text-sm font-medium text-gray-700">Canvas</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onZoomCanvas('in')}
                className="flex items-center justify-center gap-2 text-xs border-gray-200 h-9"
              >
                <ZoomIn className="h-3 w-3" />
                <span>Zoom In</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onZoomCanvas('out')}
                className="flex items-center justify-center gap-2 text-xs border-gray-200 h-9"
              >
                <ZoomOut className="h-3 w-3" />
                <span>Zoom Out</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onResetCanvas}
                className="flex items-center justify-center gap-2 text-xs border-gray-200 h-9"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onDeleteSelected}
                disabled={!hasSelectedObject}
                className="flex items-center justify-center gap-2 text-xs border-gray-200 h-9 disabled:opacity-50"
              >
                <Trash2 className="h-3 w-3" />
                <span>Delete</span>
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Quick Settings */}
          <div className="space-y-4">
            <div className="pb-1">
              <h4 className="text-sm font-medium text-gray-700">Quick Settings</h4>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-gray-600 mb-2 block">QR URL</Label>
                <Input
                  value={qrUrl}
                  onChange={(e) => setQrUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="text-sm h-10 border-gray-200"
                />
              </div>
              
              <div>
                <Label className="text-xs text-gray-600 mb-2 block">Text Content</Label>
                <Input
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Sample Text"
                  className="text-sm h-10 border-gray-200"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
