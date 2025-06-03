
import React from 'react';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LogoUploaderProps {
  logoFile: File | null;
  onFileSelect: (file: File) => void;
  logoUrl?: string;
  onRemoveLogo?: () => void;
}

export function LogoUploader({ logoFile, onFileSelect, logoUrl, onRemoveLogo }: LogoUploaderProps) {
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (PNG, JPG, JPEG, GIF)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      console.log('Logo file selected:', file.name, file.size);
      onFileSelect(file);
    }
  };

  const resetFileInput = () => {
    const fileInput = document.getElementById('logo-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    if (onRemoveLogo) {
      onRemoveLogo();
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">
        Upload Logo
      </Label>
      <div className="space-y-2">
        <div className="relative">
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/gif"
            onChange={handleLogoUpload}
            className="hidden"
            id="logo-upload"
          />
          <label
            htmlFor="logo-upload"
            className="flex items-center justify-center w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors focus-within:ring-2 focus-within:ring-blue-500"
          >
            <Upload className="w-4 h-4 mr-2" />
            {logoFile ? logoFile.name : 'Choose Logo File'}
          </label>
        </div>

        {/* Logo Preview */}
        {logoUrl && (
          <div className="relative inline-block">
            <img 
              src={logoUrl} 
              alt="Logo preview" 
              className="w-16 h-16 object-contain border border-gray-200 rounded bg-white"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={resetFileInput}
              className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )}

        <p className="text-xs text-gray-500">
          PNG, JPG, GIF up to 5MB
        </p>
      </div>
    </div>
  );
}
