
import React from 'react';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';

interface LogoUploaderProps {
  logoFile: File | null;
  onFileSelect: (file: File) => void;
}

export function LogoUploader({ logoFile, onFileSelect }: LogoUploaderProps) {
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">
        Upload Logo
      </Label>
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          className="hidden"
          id="logo-upload"
        />
        <label
          htmlFor="logo-upload"
          className="flex items-center justify-center w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
        >
          <Upload className="w-4 h-4 mr-2" />
          {logoFile ? logoFile.name : 'Choose File'}
        </label>
        {!logoFile && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
            No file chosen
          </span>
        )}
      </div>
    </div>
  );
}
