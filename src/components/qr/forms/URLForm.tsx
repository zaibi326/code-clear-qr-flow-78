
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface URLFormProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

export function URLForm({ formData, onInputChange }: URLFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="url">Website URL *</Label>
        <Input
          id="url"
          type="url"
          placeholder="https://example.com"
          value={formData.url || ''}
          onChange={(e) => onInputChange('url', e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="title">Page Title (Optional)</Label>
        <Input
          id="title"
          placeholder="Enter page title"
          value={formData.title || ''}
          onChange={(e) => onInputChange('title', e.target.value)}
          className="mt-1"
        />
      </div>
    </div>
  );
}
