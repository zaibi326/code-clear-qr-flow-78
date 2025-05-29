
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PDFFormProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

export function PDFForm({ formData, onInputChange }: PDFFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="pdf-url">PDF URL *</Label>
        <Input
          id="pdf-url"
          type="url"
          placeholder="https://example.com/document.pdf"
          value={formData.url || ''}
          onChange={(e) => onInputChange('url', e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="pdf-title">Document Title (Optional)</Label>
        <Input
          id="pdf-title"
          placeholder="Enter document title"
          value={formData.title || ''}
          onChange={(e) => onInputChange('title', e.target.value)}
          className="mt-1"
        />
      </div>
    </div>
  );
}
