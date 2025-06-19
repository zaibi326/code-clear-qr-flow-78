
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
            <SelectItem value="csv">CSV (.csv)</SelectItem>
            <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};
