
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
          placeholder="e.g., Coffee Shop, Office, Event Venue"
          value={formData.locationName || ''}
          onChange={(e) => onInputChange('locationName', e.target.value)}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="address">Address *</Label>
        <Input
          id="address"
          placeholder="123 Main St, City, State, Country"
          value={formData.address || ''}
          onChange={(e) => onInputChange('address', e.target.value)}
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          Enter the full address or use coordinates below
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            placeholder="40.7128"
            value={formData.latitude || ''}
            onChange={(e) => onInputChange('latitude', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            placeholder="-74.0060"
            value={formData.longitude || ''}
            onChange={(e) => onInputChange('longitude', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
