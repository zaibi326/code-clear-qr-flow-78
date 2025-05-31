
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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
          placeholder="https://linktr.ee/yourprofile or https://instagram.com/yourprofile"
          value={formData.socialUrl || ''}
          onChange={(e) => onInputChange('socialUrl', e.target.value)}
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          Enter your Linktree, Instagram, Twitter, or other social media profile URL
        </p>
      </div>
    </div>
  );
}
