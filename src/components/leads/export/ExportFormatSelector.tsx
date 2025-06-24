
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ExportFormatSelectorProps {
  exportFormat: 'csv' | 'xlsx';
  onFormatChange: (format: 'csv' | 'xlsx') => void;
}

export const ExportFormatSelector: React.FC<ExportFormatSelectorProps> = ({
  exportFormat,
  onFormatChange
}) => {
  // Ensure all format options have valid non-empty values
  const formatOptions = [
    { value: 'csv', label: 'CSV (.csv)' },
    { value: 'xlsx', label: 'Excel (.xlsx)' }
  ].filter(option => {
    const isValid = option.value && 
                   typeof option.value === 'string' && 
                   option.value.trim() !== '' && 
                   option.label && 
                   typeof option.label === 'string' && 
                   option.label.trim() !== '';
    if (!isValid) {
      console.error('ExportFormatSelector: Invalid format option detected:', option);
    }
    return isValid;
  });

  console.log('ExportFormatSelector rendering with options:', formatOptions);
  console.log('Current exportFormat:', exportFormat);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Format</CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={exportFormat} onValueChange={onFormatChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {formatOptions.map(option => {
              console.log('Rendering format SelectItem with value:', option.value, 'label:', option.label);
              return (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};
