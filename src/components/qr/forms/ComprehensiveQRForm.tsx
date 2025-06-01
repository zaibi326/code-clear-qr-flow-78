
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQRGenerator } from '@/hooks/useQRGenerator';
import { Upload, Plus } from 'lucide-react';

interface ComprehensiveQRFormProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

export function ComprehensiveQRForm({ formData, onInputChange }: ComprehensiveQRFormProps) {
  const { config, setConfig, generatedQR, canvasRef } = useQRGenerator();
  const [activeTab, setActiveTab] = useState('single');
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleColorChange = (field: string, color: string) => {
    onInputChange(field, color);
    if (field === 'foregroundColor') {
      setConfig(prev => ({ ...prev, foregroundColor: color }));
    } else if (field === 'backgroundColor') {
      setConfig(prev => ({ ...prev, backgroundColor: color }));
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoUrl = e.target?.result as string;
        onInputChange('logoUrl', logoUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (value: string) => {
    onInputChange('url', value);
    setConfig(prev => ({ ...prev, content: value }));
  };

  const states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut'];
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'];
  const zipCodes = ['10001', '90210', '60601', '77001', '85001', '19101'];

  return (
    <div className="space-y-6">
      {/* Tab Selection */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single" className="text-sm font-medium">Single Record</TabsTrigger>
          <TabsTrigger value="bulk" className="text-sm font-medium text-blue-600">Bulk Records</TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form Fields */}
            <div className="space-y-6">
              {/* Website URL */}
              <div className="space-y-2">
                <Label htmlFor="websiteUrl" className="text-sm font-medium text-gray-700">
                  Website Url
                </Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  value={formData.url || 'https://www.simplestreethomes.com'}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="w-full bg-blue-50 border-blue-200"
                  placeholder="Enter website URL"
                />
              </div>

              {/* Color Selection Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Select Foreground Color
                  </Label>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-full h-8 rounded border border-gray-300"
                      style={{ backgroundColor: formData.foregroundColor || '#000000' }}
                    />
                    <input
                      type="color"
                      value={formData.foregroundColor || '#000000'}
                      onChange={(e) => handleColorChange('foregroundColor', e.target.value)}
                      className="w-8 h-8 rounded border border-gray-300"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Select Background Color
                  </Label>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-full h-8 rounded border border-gray-300"
                      style={{ backgroundColor: formData.backgroundColor || '#FFFFFF' }}
                    />
                    <input
                      type="color"
                      value={formData.backgroundColor || '#FFFFFF'}
                      onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                      className="w-8 h-8 rounded border border-gray-300"
                    />
                  </div>
                </div>
              </div>

              {/* Logo Upload and Project Selection */}
              <div className="grid grid-cols-2 gap-4">
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
                  QRCode Name
                </Label>
                <Input
                  id="qrName"
                  value={formData.qrName || ''}
                  onChange={(e) => onInputChange('qrName', e.target.value)}
                  placeholder="QRCode Name"
                  className="w-full"
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
                      <SelectValue placeholder="Select your Project" />
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
                <Button className="bg-green-600 hover:bg-green-700 text-white px-8">
                  Save
                </Button>
              </div>
            </div>

            {/* Right Column - QR Code Preview */}
            <div className="flex flex-col items-center justify-start space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-200">
                {generatedQR ? (
                  <img 
                    src={generatedQR} 
                    alt="Generated QR Code" 
                    className="w-64 h-64 object-contain"
                  />
                ) : (
                  <canvas 
                    ref={canvasRef} 
                    className="w-64 h-64 border border-gray-300 rounded"
                  />
                )}
              </div>
              <p className="text-sm text-gray-600 text-center max-w-xs">
                Your QR code will appear here as you fill in the form fields
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-6 mt-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Bulk Records</h3>
            <p className="text-gray-600">
              Upload a CSV file or connect to a data source to create multiple QR codes at once.
            </p>
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
              Upload CSV File
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
