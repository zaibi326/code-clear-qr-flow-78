
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Upload, X } from 'lucide-react';

interface LogoProjectSectionProps {
  logoFile: File | null;
  logoUrl?: string;
  project?: string;
  onLogoFileChange: (file: File) => void;
  onLogoUrlChange: (url: string) => void;
  onProjectChange: (project: string) => void;
}

export function LogoProjectSection({ 
  logoFile, 
  logoUrl, 
  project, 
  onLogoFileChange, 
  onLogoUrlChange, 
  onProjectChange 
}: LogoProjectSectionProps) {
  const handleLogoSelect = (file: File) => {
    console.log('Logo file selected:', file.name, file.size);
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, JPEG)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const logoUrl = e.target?.result as string;
      console.log('Logo converted to base64, length:', logoUrl?.length);
      onLogoUrlChange(logoUrl);
    };
    reader.onerror = () => {
      console.error('Failed to read logo file');
      alert('Failed to read logo file. Please try again.');
    };
    reader.readAsDataURL(file);
    onLogoFileChange(file);
  };

  const removeLogo = () => {
    onLogoUrlChange('');
    // Reset file input
    const fileInput = document.getElementById('logo-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          Upload Logo
        </Label>
        <div className="space-y-2">
          <div className="relative">
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/gif"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleLogoSelect(file);
                }
              }}
              className="hidden"
              id="logo-upload"
            />
            <label
              htmlFor="logo-upload"
              className="flex items-center justify-center w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
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
                className="w-16 h-16 object-contain border border-gray-200 rounded"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={removeLogo}
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
      
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          Select Project
        </Label>
        <div className="flex items-center space-x-2">
          <Select value={project || ''} onValueChange={onProjectChange}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select your Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="project1">Project 1</SelectItem>
              <SelectItem value="project2">Project 2</SelectItem>
              <SelectItem value="project3">Project 3</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
