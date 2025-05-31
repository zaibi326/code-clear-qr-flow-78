
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface LandingPageFormProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

export function LandingPageForm({ formData, onInputChange }: LandingPageFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="pageUrl">Landing Page URL *</Label>
        <Input
          id="pageUrl"
          type="url"
          placeholder="https://example.com/landing"
          value={formData.pageUrl || formData.url || ''}
          onChange={(e) => onInputChange('pageUrl', e.target.value)}
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          URL of your mobile-optimized landing page
        </p>
      </div>
      
      <div>
        <Label htmlFor="pageTitle">Page Title</Label>
        <Input
          id="pageTitle"
          placeholder="Welcome to Our Landing Page"
          value={formData.pageTitle || ''}
          onChange={(e) => onInputChange('pageTitle', e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="pageDescription">Page Description</Label>
        <Textarea
          id="pageDescription"
          placeholder="Brief description of your landing page"
          value={formData.pageDescription || ''}
          onChange={(e) => onInputChange('pageDescription', e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="callToAction">Call to Action</Label>
        <Input
          id="callToAction"
          placeholder="Sign Up Now, Learn More, etc."
          value={formData.callToAction || ''}
          onChange={(e) => onInputChange('callToAction', e.target.value)}
        />
      </div>
    </div>
  );
}
