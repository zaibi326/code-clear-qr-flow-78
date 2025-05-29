
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EmailFormProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

export function EmailForm({ formData, onInputChange }: EmailFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          placeholder="contact@example.com"
          value={formData.email || ''}
          onChange={(e) => onInputChange('email', e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="subject">Subject (Optional)</Label>
        <Input
          id="subject"
          placeholder="Enter email subject"
          value={formData.subject || ''}
          onChange={(e) => onInputChange('subject', e.target.value)}
          className="mt-1"
        />
      </div>
    </div>
  );
}
