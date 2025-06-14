
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface QuickSettingsSectionProps {
  qrUrl: string;
  setQrUrl: (url: string) => void;
  textContent: string;
  setTextContent: (text: string) => void;
}

export const QuickSettingsSection = ({
  qrUrl,
  setQrUrl,
  textContent,
  setTextContent
}: QuickSettingsSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="pb-1">
        <h4 className="text-sm font-medium text-gray-700">Quick Settings</h4>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label className="text-xs text-gray-600 mb-2 block">QR URL</Label>
          <Input
            value={qrUrl}
            onChange={(e) => setQrUrl(e.target.value)}
            placeholder="https://example.com"
            className="text-sm h-10 border-gray-200"
          />
        </div>
        
        <div>
          <Label className="text-xs text-gray-600 mb-2 block">Text Content</Label>
          <Input
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="Sample Text"
            className="text-sm h-10 border-gray-200"
          />
        </div>
      </div>
    </div>
  );
};
