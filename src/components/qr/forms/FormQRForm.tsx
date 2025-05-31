
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface FormQRFormProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

export function FormQRForm({ formData, onInputChange }: FormQRFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="formUrl">Form URL *</Label>
        <Input
          id="formUrl"
          type="url"
          placeholder="https://forms.google.com/d/your-form-id"
          value={formData.formUrl || formData.url || ''}
          onChange={(e) => onInputChange('formUrl', e.target.value)}
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          Enter your Google Forms, Typeform, or other form URL
        </p>
      </div>
      
      <div>
        <Label htmlFor="formTitle">Form Title</Label>
        <Input
          id="formTitle"
          placeholder="Customer Feedback Form"
          value={formData.formTitle || ''}
          onChange={(e) => onInputChange('formTitle', e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="formDescription">Description (Optional)</Label>
        <Textarea
          id="formDescription"
          placeholder="Brief description of what this form is for"
          value={formData.formDescription || ''}
          onChange={(e) => onInputChange('formDescription', e.target.value)}
        />
      </div>
    </div>
  );
}
