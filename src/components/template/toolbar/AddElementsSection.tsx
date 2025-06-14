
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Type, 
  Square, 
  Circle as CircleIcon, 
  Upload,
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
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Add Elements</h4>
      </div>
      
      {/* QR Code and Text in top row */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onAddQRCode}
          className="flex flex-col items-center justify-center h-16 p-2 hover:bg-gray-50 border-gray-300 space-y-1"
        >
          <QrCode className="h-5 w-5 text-gray-600" />
          <span className="text-xs text-gray-700">QR Code</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onAddText}
          className="flex flex-col items-center justify-center h-16 p-2 hover:bg-gray-50 border-gray-300 space-y-1"
        >
          <Type className="h-5 w-5 text-gray-600" />
          <span className="text-xs text-gray-700">Text</span>
        </Button>
      </div>
      
      {/* Rectangle and Circle in second row */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddShape('rectangle')}
          className="flex flex-col items-center justify-center h-16 p-2 hover:bg-gray-50 border-gray-300 space-y-1"
        >
          <Square className="h-5 w-5 text-gray-600" />
          <span className="text-xs text-gray-700">Rectangle</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddShape('circle')}
          className="flex flex-col items-center justify-center h-16 p-2 hover:bg-gray-50 border-gray-300 space-y-1"
        >
          <CircleIcon className="h-5 w-5 text-gray-600" />
          <span className="text-xs text-gray-700">Circle</span>
        </Button>
      </div>
      
      {/* Upload Image button full width */}
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
          className="w-full flex items-center justify-center gap-2 h-12 hover:bg-gray-50 border-gray-300"
          asChild
        >
          <label htmlFor="image-upload" className="cursor-pointer">
            <Upload className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-700">Upload Image</span>
          </label>
        </Button>
      </div>
    </div>
  );
};
