
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PhoneFormProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

export function PhoneForm({ formData, onInputChange }: PhoneFormProps) {
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
    </div>
  );
}
