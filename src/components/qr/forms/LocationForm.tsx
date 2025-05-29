
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LocationFormProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

export function LocationForm({ formData, onInputChange }: LocationFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="locationName">Location Name *</Label>
        <Input
          id="locationName"
          placeholder="Restaurant Name, Business, etc."
          value={formData.locationName || ''}
          onChange={(e) => onInputChange('locationName', e.target.value)}
          className="mt-1"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="latitude">Latitude *</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            placeholder="40.7128"
            value={formData.latitude || ''}
            onChange={(e) => onInputChange('latitude', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="longitude">Longitude *</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            placeholder="-74.0060"
            value={formData.longitude || ''}
            onChange={(e) => onInputChange('longitude', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="address">Address (Optional)</Label>
        <Input
          id="address"
          placeholder="123 Main St, New York, NY"
          value={formData.address || ''}
          onChange={(e) => onInputChange('address', e.target.value)}
          className="mt-1"
        />
      </div>
    </div>
  );
}
