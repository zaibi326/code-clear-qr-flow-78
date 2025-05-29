
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface DefaultFormProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

export function DefaultForm({ formData, onInputChange }: DefaultFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="content">Content *</Label>
        <Textarea
          id="content"
          placeholder="Enter your content"
          value={formData.content || ''}
          onChange={(e) => onInputChange('content', e.target.value)}
          className="mt-1"
        />
      </div>
    </div>
  );
}
