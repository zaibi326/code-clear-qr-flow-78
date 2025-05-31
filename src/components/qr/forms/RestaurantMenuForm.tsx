
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
          value={formData.menuUrl || ''}
          onChange={(e) => onInputChange('menuUrl', e.target.value)}
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          Enter the URL to your digital menu, menu PDF, or menu page
        </p>
      </div>
      
      <div>
        <Label htmlFor="restaurantName">Restaurant Name</Label>
        <Input
          id="restaurantName"
          placeholder="Your Restaurant Name"
          value={formData.restaurantName || ''}
          onChange={(e) => onInputChange('restaurantName', e.target.value)}
        />
      </div>
    </div>
  );
}
