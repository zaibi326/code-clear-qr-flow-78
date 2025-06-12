
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface URLInputSectionProps {
  url: string;
  onChange: (url: string) => void;
}

export function URLInputSection({ url, onChange }: URLInputSectionProps) {
  const handleUrlChange = (value: string) => {
    // Ensure URL has proper protocol
    let processedUrl = value;
    if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
      processedUrl = `https://${value}`;
    }
    onChange(processedUrl);
    console.log('URL updated:', processedUrl);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="websiteUrl" className="text-sm font-medium text-gray-700">
        Website URL *
      </Label>
      <div className="relative">
        <Input
          id="websiteUrl"
          type="url"
          value={url || ''}
          onChange={(e) => handleUrlChange(e.target.value)}
          className="w-full bg-blue-50 border-blue-200 pr-10"
          placeholder="Enter website URL (e.g., example.com)"
          required
        />
        {url && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => window.open(url, '_blank')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-blue-600 hover:text-blue-800"
            title="Test URL"
          >
            ↗
          </Button>
        )}
      </div>
      {url && (
        <p className="text-xs text-gray-500">
          Preview: {url}
        </p>
      )}
    </div>
  );
}
