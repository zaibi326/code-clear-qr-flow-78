
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface RestaurantMenuFormProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

export function RestaurantMenuForm({ formData, onInputChange }: RestaurantMenuFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="menuUrl">Menu URL *</Label>
        <Input
          id="menuUrl"
          type="url"
          placeholder="https://yourmenu.com or PDF link"
          value={formData.menuUrl || formData.url || ''}
          onChange={(e) => onInputChange('menuUrl', e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="restaurantName">Restaurant Name (Optional)</Label>
        <Input
          id="restaurantName"
          placeholder="Your Restaurant Name"
          value={formData.restaurantName || ''}
          onChange={(e) => onInputChange('restaurantName', e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Brief description of your menu or restaurant"
          value={formData.description || ''}
          onChange={(e) => onInputChange('description', e.target.value)}
          className="mt-1"
        />
      </div>
    </div>
  );
}
