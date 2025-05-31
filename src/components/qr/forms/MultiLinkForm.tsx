
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MultiLinkFormProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

export function MultiLinkForm({ formData, onInputChange }: MultiLinkFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="linkPageUrl">Link Page URL *</Label>
        <Input
          id="linkPageUrl"
          type="url"
          placeholder="https://linktr.ee/yourprofile or your custom link page"
          value={formData.linkPageUrl || formData.url || ''}
          onChange={(e) => onInputChange('linkPageUrl', e.target.value)}
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          Enter your Linktree, bio.link, or custom multi-link page URL
        </p>
      </div>
      
      <div>
        <Label htmlFor="pageTitle">Page Title</Label>
        <Input
          id="pageTitle"
          placeholder="Your Name or Brand"
          value={formData.pageTitle || ''}
          onChange={(e) => onInputChange('pageTitle', e.target.value)}
        />
      </div>
    </div>
  );
}
