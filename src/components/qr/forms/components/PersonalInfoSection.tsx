
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PersonalInfoSectionProps {
  listType?: string;
  firstName?: string;
  lastName?: string;
  onListTypeChange: (value: string) => void;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
}

export function PersonalInfoSection({ 
  listType, 
  firstName, 
  lastName, 
  onListTypeChange, 
  onFirstNameChange, 
  onLastNameChange 
}: PersonalInfoSectionProps) {
  // Ensure all list type options have non-empty values
  const listTypeOptions = [
    { value: 'type1', label: 'Type 1' },
    { value: 'type2', label: 'Type 2' },
    { value: 'type3', label: 'Type 3' }
  ].filter(option => option.value.trim() !== '');

  console.log('PersonalInfoSection rendering with listType:', listType);
  console.log('List type options:', listTypeOptions);

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          Select List Type
        </Label>
        <Select value={listType || ''} onValueChange={onListTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select List Type" />
          </SelectTrigger>
          <SelectContent>
            {listTypeOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
          First Name
        </Label>
        <Input
          id="firstName"
          value={firstName || ''}
          onChange={(e) => onFirstNameChange(e.target.value)}
          placeholder="Enter First Name"
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
          Last Name
        </Label>
        <Input
          id="lastName"
          value={lastName || ''}
          onChange={(e) => onLastNameChange(e.target.value)}
          placeholder="Enter Last Name"
          className="w-full"
        />
      </div>
    </div>
  );
}
