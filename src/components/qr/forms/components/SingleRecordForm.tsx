
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Save, Upload, X } from 'lucide-react';
import { ColorSelector } from './ColorSelector';
import { LogoUploader } from './LogoUploader';

interface SingleRecordFormProps {
  formData: any;
  logoFile: File | null;
  onInputChange: (field: string, value: string) => void;
  onLogoFileChange: (file: File) => void;
  onSave: () => void;
}

export function SingleRecordForm({ 
  formData, 
  logoFile, 
  onInputChange, 
  onLogoFileChange, 
  onSave 
}: SingleRecordFormProps) {
  const states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut'];
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'];
  const zipCodes = ['10001', '90210', '60601', '77001', '85001', '19101'];

  const handleUrlChange = (value: string) => {
    // Ensure URL has proper protocol
    let processedUrl = value;
    if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
      processedUrl = `https://${value}`;
    }
    onInputChange('url', processedUrl);
    console.log('URL updated:', processedUrl);
  };

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
      onInputChange('logoUrl', logoUrl);
    };
    reader.onerror = () => {
      console.error('Failed to read logo file');
      alert('Failed to read logo file. Please try again.');
    };
    reader.readAsDataURL(file);
    onLogoFileChange(file);
  };

  const removeLogo = () => {
    onInputChange('logoUrl', '');
    // Reset file input
    const fileInput = document.getElementById('logo-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Website URL with validation */}
      <div className="space-y-2">
        <Label htmlFor="websiteUrl" className="text-sm font-medium text-gray-700">
          Website URL *
        </Label>
        <div className="relative">
          <Input
            id="websiteUrl"
            type="url"
            value={formData.url || ''}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="w-full bg-blue-50 border-blue-200 pr-10"
            placeholder="Enter website URL (e.g., example.com)"
            required
          />
          {formData.url && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => window.open(formData.url, '_blank')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-blue-600 hover:text-blue-800"
              title="Test URL"
            >
              ↗
            </Button>
          )}
        </div>
        {formData.url && (
          <p className="text-xs text-gray-500">
            Preview: {formData.url}
          </p>
        )}
      </div>

      {/* Color Selection Row */}
      <div className="grid grid-cols-2 gap-4">
        <ColorSelector
          label="Select Foreground Color"
          color={formData.foregroundColor || '#000000'}
          onChange={(color) => onInputChange('foregroundColor', color)}
          id="foreground-color-input"
        />
        <ColorSelector
          label="Select Background Color"
          color={formData.backgroundColor || '#FFFFFF'}
          onChange={(color) => onInputChange('backgroundColor', color)}
          id="background-color-input"
        />
      </div>

      {/* Enhanced Logo Upload and Project Selection */}
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
            {formData.logoUrl && (
              <div className="relative inline-block">
                <img 
                  src={formData.logoUrl} 
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
            <Select value={formData.project || ''} onValueChange={(value) => onInputChange('project', value)}>
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

      {/* QR Code Name */}
      <div className="space-y-2">
        <Label htmlFor="qrName" className="text-sm font-medium text-gray-700">
          QRCode Name *
        </Label>
        <Input
          id="qrName"
          value={formData.qrName || ''}
          onChange={(e) => onInputChange('qrName', e.target.value)}
          placeholder="Enter QRCode Name"
          className="w-full"
          required
        />
      </div>

      {/* List Type and Name Fields */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Select List Type
          </Label>
          <Select value={formData.listType || ''} onValueChange={(value) => onInputChange('listType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select List Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="type1">Type 1</SelectItem>
              <SelectItem value="type2">Type 2</SelectItem>
              <SelectItem value="type3">Type 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
            First Name
          </Label>
          <Input
            id="firstName"
            value={formData.firstName || ''}
            onChange={(e) => onInputChange('firstName', e.target.value)}
            placeholder="Enter First Name"
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
            Last Name
          </Label>
          <Input
            id="lastName"
            value={formData.lastName || ''}
            onChange={(e) => onInputChange('lastName', e.target.value)}
            placeholder="Enter Last Name"
            className="w-full"
          />
        </div>
      </div>

      {/* Property Address */}
      <div className="space-y-2">
        <Label htmlFor="propertyAddress" className="text-sm font-medium text-gray-700">
          Property Address
        </Label>
        <Input
          id="propertyAddress"
          value={formData.propertyAddress || ''}
          onChange={(e) => onInputChange('propertyAddress', e.target.value)}
          placeholder="Enter Property Address"
          className="w-full"
        />
      </div>

      {/* Property Location Fields */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Property State
          </Label>
          <Select value={formData.propertyState || ''} onValueChange={(value) => onInputChange('propertyState', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Property State" />
            </SelectTrigger>
            <SelectContent>
              {states.map(state => (
                <SelectItem key={state} value={state.toLowerCase()}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Property City
          </Label>
          <Select value={formData.propertyCity || ''} onValueChange={(value) => onInputChange('propertyCity', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Property City" />
            </SelectTrigger>
            <SelectContent>
              {cities.map(city => (
                <SelectItem key={city} value={city.toLowerCase()}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Property Zip
          </Label>
          <Select value={formData.propertyZip || ''} onValueChange={(value) => onInputChange('propertyZip', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Property Zip" />
            </SelectTrigger>
            <SelectContent>
              {zipCodes.map(zip => (
                <SelectItem key={zip} value={zip}>{zip}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mailing Address */}
      <div className="space-y-2">
        <Label htmlFor="mailingAddress" className="text-sm font-medium text-gray-700">
          Mailing Address
        </Label>
        <Input
          id="mailingAddress"
          value={formData.mailingAddress || ''}
          onChange={(e) => onInputChange('mailingAddress', e.target.value)}
          placeholder="Enter Mailing Address"
          className="w-full"
        />
      </div>

      {/* Mailing Location Fields */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Mailing State
          </Label>
          <Select value={formData.mailingState || ''} onValueChange={(value) => onInputChange('mailingState', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Mailing State" />
            </SelectTrigger>
            <SelectContent>
              {states.map(state => (
                <SelectItem key={state} value={state.toLowerCase()}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Mailing City
          </Label>
          <Select value={formData.mailingCity || ''} onValueChange={(value) => onInputChange('mailingCity', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Mailing City" />
            </SelectTrigger>
            <SelectContent>
              {cities.map(city => (
                <SelectItem key={city} value={city.toLowerCase()}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Mailing Zip
          </Label>
          <Select value={formData.mailingZip || ''} onValueChange={(value) => onInputChange('mailingZip', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Mailing Zip" />
            </SelectTrigger>
            <SelectContent>
              {zipCodes.map(zip => (
                <SelectItem key={zip} value={zip}>{zip}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <Button 
          onClick={onSave}
          className="bg-green-600 hover:bg-green-700 text-white px-8 flex items-center gap-2"
          disabled={!formData.url || !formData.qrName}
        >
          <Save className="w-4 h-4" />
          Save QR Code
        </Button>
      </div>
    </div>
  );
}
