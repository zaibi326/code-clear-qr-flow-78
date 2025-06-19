
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddressSectionProps {
  propertyAddress?: string;
  propertyState?: string;
  propertyCity?: string;
  propertyZip?: string;
  mailingAddress?: string;
  mailingState?: string;
  mailingCity?: string;
  mailingZip?: string;
  onPropertyAddressChange: (value: string) => void;
  onPropertyStateChange: (value: string) => void;
  onPropertyCityChange: (value: string) => void;
  onPropertyZipChange: (value: string) => void;
  onMailingAddressChange: (value: string) => void;
  onMailingStateChange: (value: string) => void;
  onMailingCityChange: (value: string) => void;
  onMailingZipChange: (value: string) => void;
}

export function AddressSection({ 
  propertyAddress,
  propertyState,
  propertyCity,
  propertyZip,
  mailingAddress,
  mailingState,
  mailingCity,
  mailingZip,
  onPropertyAddressChange,
  onPropertyStateChange,
  onPropertyCityChange,
  onPropertyZipChange,
  onMailingAddressChange,
  onMailingStateChange,
  onMailingCityChange,
  onMailingZipChange
}: AddressSectionProps) {
  const states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut'].filter(state => state.trim() !== '');
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'].filter(city => city.trim() !== '');
  const zipCodes = ['10001', '90210', '60601', '77001', '85001', '19101'].filter(zip => zip.trim() !== '');

  return (
    <>
      {/* Property Address */}
      <div className="space-y-2">
        <Label htmlFor="propertyAddress" className="text-sm font-medium text-gray-700">
          Property Address
        </Label>
        <Input
          id="propertyAddress"
          value={propertyAddress || ''}
          onChange={(e) => onPropertyAddressChange(e.target.value)}
          placeholder="Enter Property Address"
          className="w-full"
        />
      </div>

      {/* Property Location Fields */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Property State
          </Label>
          <Select value={propertyState || ''} onValueChange={onPropertyStateChange}>
            <SelectTrigger>
              <SelectValue placeholder="Property State" />
            </SelectTrigger>
            <SelectContent>
              {states.map(state => (
                <SelectItem key={state} value={state.toLowerCase()}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Property City
          </Label>
          <Select value={propertyCity || ''} onValueChange={onPropertyCityChange}>
            <SelectTrigger>
              <SelectValue placeholder="Property City" />
            </SelectTrigger>
            <SelectContent>
              {cities.map(city => (
                <SelectItem key={city} value={city.toLowerCase().replace(/\s+/g, '-')}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Property Zip
          </Label>
          <Select value={propertyZip || ''} onValueChange={onPropertyZipChange}>
            <SelectTrigger>
              <SelectValue placeholder="Property Zip" />
            </SelectTrigger>
            <SelectContent>
              {zipCodes.map(zip => (
                <SelectItem key={zip} value={zip}>{zip}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mailing Address */}
      <div className="space-y-2">
        <Label htmlFor="mailingAddress" className="text-sm font-medium text-gray-700">
          Mailing Address
        </Label>
        <Input
          id="mailingAddress"
          value={mailingAddress || ''}
          onChange={(e) => onMailingAddressChange(e.target.value)}
          placeholder="Enter Mailing Address"
          className="w-full"
        />
      </div>

      {/* Mailing Location Fields */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Mailing State
          </Label>
          <Select value={mailingState || ''} onValueChange={onMailingStateChange}>
            <SelectTrigger>
              <SelectValue placeholder="Mailing State" />
            </SelectTrigger>
            <SelectContent>
              {states.map(state => (
                <SelectItem key={state} value={state.toLowerCase()}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Mailing City
          </Label>
          <Select value={mailingCity || ''} onValueChange={onMailingCityChange}>
            <SelectTrigger>
              <SelectValue placeholder="Mailing City" />
            </SelectTrigger>
            <SelectContent>
              {cities.map(city => (
                <SelectItem key={city} value={city.toLowerCase().replace(/\s+/g, '-')}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Mailing Zip
          </Label>
          <Select value={mailingZip || ''} onValueChange={onMailingZipChange}>
            <SelectTrigger>
              <SelectValue placeholder="Mailing Zip" />
            </SelectTrigger>
            <SelectContent>
              {zipCodes.map(zip => (
                <SelectItem key={zip} value={zip}>{zip}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}
