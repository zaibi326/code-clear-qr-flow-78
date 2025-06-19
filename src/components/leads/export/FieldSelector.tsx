
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface IncludeFields {
  name: boolean;
  phone: boolean;
  email: boolean;
  qr_id: boolean;
  notes: boolean;
  company: boolean;
  tags: boolean;
  created_at: boolean;
}

interface FieldSelectorProps {
  includeFields: IncludeFields;
  onFieldToggle: (field: keyof IncludeFields) => void;
}

export const FieldSelector: React.FC<FieldSelectorProps> = ({
  includeFields,
  onFieldToggle
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fields to Include</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(includeFields).map(([field, checked]) => (
            <div key={field} className="flex items-center space-x-2">
              <Checkbox
                id={field}
                checked={checked}
                onCheckedChange={() => onFieldToggle(field as keyof IncludeFields)}
              />
              <Label htmlFor={field} className="capitalize">
                {field.replace('_', ' ')}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
