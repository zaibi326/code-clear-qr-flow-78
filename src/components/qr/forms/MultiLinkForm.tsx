
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface MultiLinkFormProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

export function MultiLinkForm({ formData, onInputChange }: MultiLinkFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="linkpage-url">Linkpage URL *</Label>
        <Input
          id="linkpage-url"
          type="url"
          placeholder="https://linktr.ee/yourname"
          value={formData.url || ''}
          onChange={(e) => onInputChange('url', e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Describe your link collection"
          value={formData.description || ''}
          onChange={(e) => onInputChange('description', e.target.value)}
          className="mt-1"
        />
      </div>
    </div>
  );
}
