
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface FieldSelectorProps {
  includeFields: {
    name: boolean;
    email: boolean;
    phone: boolean;
    company: boolean;
    url: boolean;
    notes: boolean;
    tags: boolean;
    createdAt: boolean;
    updatedAt: boolean;
  };
  onFieldToggle: (field: string) => void;
}

export const FieldSelector: React.FC<FieldSelectorProps> = ({
  includeFields,
  onFieldToggle
}) => {
  const fields = [
    { key: 'name', label: 'Name', description: 'Contact name' },
    { key: 'email', label: 'Email', description: 'Email address' },
    { key: 'phone', label: 'Phone', description: 'Phone number' },
    { key: 'company', label: 'Company', description: 'Company name' },
    { key: 'url', label: 'URL', description: 'Website or profile URL' },
    { key: 'notes', label: 'Notes', description: 'Additional notes' },
    { key: 'tags', label: 'Tags', description: 'Associated tags' },
    { key: 'createdAt', label: 'Created Date', description: 'Record creation date' },
    { key: 'updatedAt', label: 'Updated Date', description: 'Last modification date' }
  ];

  const selectAll = () => {
    fields.forEach(field => {
      if (!includeFields[field.key as keyof typeof includeFields]) {
        onFieldToggle(field.key);
      }
    });
  };

  const selectNone = () => {
    fields.forEach(field => {
      if (includeFields[field.key as keyof typeof includeFields]) {
        onFieldToggle(field.key);
      }
    });
  };

  const selectedCount = Object.values(includeFields).filter(Boolean).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Fields to Export ({selectedCount}/{fields.length})</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={selectAll}>
              Select All
            </Button>
            <Button variant="outline" size="sm" onClick={selectNone}>
              Select None
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field.key} className="flex items-start space-x-2">
              <Checkbox
                id={field.key}
                checked={includeFields[field.key as keyof typeof includeFields]}
                onCheckedChange={() => onFieldToggle(field.key)}
              />
              <div className="space-y-1">
                <Label
                  htmlFor={field.key}
                  className="text-sm font-medium cursor-pointer"
                >
                  {field.label}
                </Label>
                <p className="text-xs text-gray-500">{field.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
