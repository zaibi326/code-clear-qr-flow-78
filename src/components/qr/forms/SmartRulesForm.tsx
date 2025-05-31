
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface SmartRulesFormProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

export function SmartRulesForm({ formData, onInputChange }: SmartRulesFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="primaryUrl">Primary URL *</Label>
        <Input
          id="primaryUrl"
          type="url"
          placeholder="https://example.com/primary"
          value={formData.primaryUrl || formData.url || ''}
          onChange={(e) => onInputChange('primaryUrl', e.target.value)}
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          Default destination URL when no rules match
        </p>
      </div>
      
      <div>
        <Label htmlFor="mobileUrl">Mobile URL</Label>
        <Input
          id="mobileUrl"
          type="url"
          placeholder="https://example.com/mobile"
          value={formData.mobileUrl || ''}
          onChange={(e) => onInputChange('mobileUrl', e.target.value)}
        />
        <p className="text-sm text-gray-500 mt-1">
          URL for mobile devices
        </p>
      </div>
      
      <div>
        <Label htmlFor="tabletUrl">Tablet URL</Label>
        <Input
          id="tabletUrl"
          type="url"
          placeholder="https://example.com/tablet"
          value={formData.tabletUrl || ''}
          onChange={(e) => onInputChange('tabletUrl', e.target.value)}
        />
        <p className="text-sm text-gray-500 mt-1">
          URL for tablet devices
        </p>
      </div>
      
      <div>
        <Label htmlFor="ruleDescription">Rule Description</Label>
        <Textarea
          id="ruleDescription"
          placeholder="Describe your smart rules logic"
          value={formData.ruleDescription || ''}
          onChange={(e) => onInputChange('ruleDescription', e.target.value)}
        />
      </div>
    </div>
  );
}
