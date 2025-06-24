
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FileSpreadsheet, FileText } from 'lucide-react';

interface ExportFormatSelectorProps {
  exportFormat: 'csv' | 'xlsx';
  onFormatChange: (format: 'csv' | 'xlsx') => void;
}

export const ExportFormatSelector: React.FC<ExportFormatSelectorProps> = ({
  exportFormat,
  onFormatChange
}) => {
  console.log('ExportFormatSelector rendering with exportFormat:', exportFormat);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Format</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={exportFormat} onValueChange={onFormatChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="csv" id="csv" />
            <Label htmlFor="csv" className="flex items-center gap-2 cursor-pointer">
              <FileText className="w-4 h-4" />
              CSV (Comma Separated Values)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="xlsx" id="xlsx" />
            <Label htmlFor="xlsx" className="flex items-center gap-2 cursor-pointer">
              <FileSpreadsheet className="w-4 h-4" />
              XLSX (Excel Spreadsheet)
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
