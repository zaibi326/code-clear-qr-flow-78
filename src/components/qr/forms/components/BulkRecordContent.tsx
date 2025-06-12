
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { CSVUploadSection } from './CSVUploadSection';

interface BulkRecordContentProps {
  csvFile: File | null;
  csvData: any[];
  onCSVDataChange: (data: any[]) => void;
  onCSVFileChange: (file: File | null) => void;
  onBulkSave: () => void;
  styling: {
    foregroundColor: string;
    backgroundColor: string;
    logoUrl: string;
  };
  onStyleChange: (field: string, value: string) => void;
  logoFile: File | null;
  onLogoFileChange: (file: File) => void;
}

export function BulkRecordContent({
  csvFile,
  csvData,
  onCSVDataChange,
  onCSVFileChange,
  onBulkSave,
  styling,
  onStyleChange,
  logoFile,
  onLogoFileChange
}: BulkRecordContentProps) {
  return (
    <TabsContent value="bulk" className="space-y-6 mt-6">
      <div className="mb-6 pb-4 border-b border-slate-100">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Bulk QR Code Generation</h3>
        <p className="text-slate-600">Upload CSV data to generate multiple QR codes with consistent styling.</p>
      </div>
      <CSVUploadSection
        csvFile={csvFile}
        csvData={csvData}
        onCSVDataChange={onCSVDataChange}
        onCSVFileChange={onCSVFileChange}
        onBulkSave={onBulkSave}
        styling={styling}
        onStyleChange={onStyleChange}
        logoFile={logoFile}
        onLogoFileChange={onLogoFileChange}
      />
    </TabsContent>
  );
}
