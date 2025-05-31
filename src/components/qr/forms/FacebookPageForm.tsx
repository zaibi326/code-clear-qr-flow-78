
import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Facebook, Image } from 'lucide-react';

interface FacebookPageFormProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

export function FacebookPageForm({ formData, onInputChange }: FacebookPageFormProps) {
  const [dragActiveHeader, setDragActiveHeader] = useState(false);
  const [dragActiveLogo, setDragActiveLogo] = useState(false);
  const [headerImage, setHeaderImage] = useState<File | null>(null);
  const [logoImage, setLogoImage] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent, type: 'header' | 'logo') => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      if (type === 'header') setDragActiveHeader(true);
      else setDragActiveLogo(true);
    } else if (e.type === "dragleave") {
      if (type === 'header') setDragActiveHeader(false);
      else setDragActiveLogo(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, type: 'header' | 'logo') => {
    e.preventDefault();
    e.stopPropagation();
    
    if (type === 'header') setDragActiveHeader(false);
    else setDragActiveLogo(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
        if (type === 'header') {
          setHeaderImage(file);
          onInputChange('headerImage', `https://example.com/uploads/${file.name}`);
        } else {
          setLogoImage(file);
          onInputChange('logoImage', `https://example.com/uploads/${file.name}`);
        }
      }
    }
  }, [onInputChange]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, type: 'header' | 'logo') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
        if (type === 'header') {
          setHeaderImage(file);
          onInputChange('headerImage', `https://example.com/uploads/${file.name}`);
        } else {
          setLogoImage(file);
          onInputChange('logoImage', `https://example.com/uploads/${file.name}`);
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Facebook className="h-5 w-5" />
            Enter your details
          </CardTitle>
          <p className="text-sm text-gray-600">
            Share the details that will be displayed in the landing page
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="facebook-username">Facebook page username *</Label>
            <div className="flex items-center mt-1">
              <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">
                https://www.facebook.com/
              </span>
              <Input
                id="facebook-username"
                placeholder="yourpage"
                value={formData.facebookUsername || ''}
                onChange={(e) => onInputChange('facebookUsername', e.target.value)}
                className="rounded-l-none"
                required
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Enter your Facebook page username or ID
            </p>
          </div>

          <div>
            <Label htmlFor="like-button-type">Facebook like button type</Label>
            <Select onValueChange={(value) => onInputChange('likeButtonType', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select button type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="box_count">Box Count</SelectItem>
                <SelectItem value="button_count">Button Count</SelectItem>
                <SelectItem value="button">Button</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="page-title">Page Title</Label>
            <Input
              id="page-title"
              placeholder="Your Facebook Page Name"
              value={formData.pageTitle || ''}
              onChange={(e) => onInputChange('pageTitle', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="page-description">Page Description</Label>
            <Input
              id="page-description"
              placeholder="Brief description of your Facebook page"
              value={formData.pageDescription || ''}
              onChange={(e) => onInputChange('pageDescription', e.target.value)}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Header</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label>Base Image</Label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors mt-1 ${
                dragActiveHeader 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={(e) => handleDrag(e, 'header')}
              onDragLeave={(e) => handleDrag(e, 'header')}
              onDragOver={(e) => handleDrag(e, 'header')}
              onDrop={(e) => handleDrop(e, 'header')}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileInput(e, 'header')}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-3">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Image className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-lg font-medium">Drag file here or</p>
                  <Button variant="outline" className="mt-2">
                    Choose File
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  1920x1080 pixels. 5MB max file size.
                </p>
              </div>
              {headerImage && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    ✓ {headerImage.name} uploaded successfully
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Logo</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActiveLogo 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={(e) => handleDrag(e, 'logo')}
              onDragLeave={(e) => handleDrag(e, 'logo')}
              onDragOver={(e) => handleDrag(e, 'logo')}
              onDrop={(e) => handleDrop(e, 'logo')}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileInput(e, 'logo')}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-3">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Image className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-lg font-medium">Drag file here or</p>
                  <Button variant="outline" className="mt-2">
                    Choose File
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  192x192 pixels. 5MB max file size.
                </p>
              </div>
              {logoImage && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    ✓ {logoImage.name} uploaded successfully
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
