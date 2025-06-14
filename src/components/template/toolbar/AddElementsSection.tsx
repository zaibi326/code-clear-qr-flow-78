
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Type, 
  Square, 
  Circle as CircleIcon, 
  Image as ImageIcon, 
  QrCode
} from 'lucide-react';

interface AddElementsSectionProps {
  onAddQRCode: () => void;
  onAddText: () => void;
  onAddShape: (type: 'rectangle' | 'circle') => void;
  onUploadImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AddElementsSection = ({
  onAddQRCode,
  onAddText,
  onAddShape,
  onUploadImage
}: AddElementsSectionProps) => {
  return (
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
  );
};
