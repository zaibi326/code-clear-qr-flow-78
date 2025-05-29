
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface SMSFormProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

export function SMSForm({ formData, onInputChange }: SMSFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="phone">Phone Number *</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1234567890"
          value={formData.phone || ''}
          onChange={(e) => onInputChange('phone', e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="message">Message (Optional)</Label>
        <Textarea
          id="message"
          placeholder="Enter your message"
          value={formData.message || ''}
          onChange={(e) => onInputChange('message', e.target.value)}
          className="mt-1"
        />
      </div>
    </div>
  );
}
