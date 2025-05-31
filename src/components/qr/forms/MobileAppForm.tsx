import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Tablet, Globe } from 'lucide-react';

interface MobileAppFormProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

export function MobileAppForm({ formData, onInputChange }: MobileAppFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Mobile App</h3>
        <p className="text-gray-600 mb-6">
          Redirect to app download or in-app pages for Android and iOS users
        </p>
      </div>

      {/* Android Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="p-1.5 rounded bg-green-100">
              <Smartphone className="h-4 w-4 text-green-600" />
            </div>
            For Android
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="androidUrl" className="text-sm font-medium text-gray-700">
              Google Play store URL
            </Label>
            <Input
              id="androidUrl"
              type="url"
              value={formData.androidUrl || ''}
              onChange={(e) => onInputChange('androidUrl', e.target.value)}
              placeholder="https://www.example.com"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* iOS Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="p-1.5 rounded bg-blue-100">
              <Smartphone className="h-4 w-4 text-blue-600" />
            </div>
            For iOS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="iosUrl" className="text-sm font-medium text-gray-700">
              App store URL (iPhone)
            </Label>
            <Input
              id="iosUrl"
              type="url"
              value={formData.iosUrl || ''}
              onChange={(e) => onInputChange('iosUrl', e.target.value)}
              placeholder="https://www.example.com"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="ipadUrl" className="text-sm font-medium text-gray-700">
              App store URL (iPad and macOS)
            </Label>
            <Input
              id="ipadUrl"
              type="url"
              value={formData.ipadUrl || ''}
              onChange={(e) => onInputChange('ipadUrl', e.target.value)}
              placeholder="https://www.example.com"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Other OS Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="p-1.5 rounded bg-gray-100">
              <Globe className="h-4 w-4 text-gray-600" />
            </div>
            For other operating systems
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="webUrl" className="text-sm font-medium text-gray-700">
              Web URL
            </Label>
            <Input
              id="webUrl"
              type="url"
              value={formData.webUrl || ''}
              onChange={(e) => onInputChange('webUrl', e.target.value)}
              placeholder="https://www.example.com"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
