
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SocialMediaFormProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

export function SocialMediaForm({ formData, onInputChange }: SocialMediaFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="socialUrl">Social Media URL *</Label>
        <Input
          id="socialUrl"
          type="url"
          placeholder="https://linktr.ee/yourname or Instagram/Facebook profile"
          value={formData.socialUrl || formData.url || ''}
          onChange={(e) => onInputChange('socialUrl', e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="platform">Platform (Optional)</Label>
        <Input
          id="platform"
          placeholder="Instagram, Facebook, Twitter, etc."
          value={formData.platform || ''}
          onChange={(e) => onInputChange('platform', e.target.value)}
          className="mt-1"
        />
      </div>
    </div>
  );
}
