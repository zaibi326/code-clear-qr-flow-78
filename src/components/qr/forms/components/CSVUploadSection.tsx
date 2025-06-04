
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { parseCSV } from '@/utils/csvParser';

interface CSVUploadSectionProps {
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

export function CSVUploadSection({ 
  csvFile, 
  csvData, 
  onCSVDataChange, 
  onCSVFileChange,
  onBulkSave,
  styling,
  onStyleChange,
  logoFile,
  onLogoFileChange
}: CSVUploadSectionProps) {
  const { toast } = useToast();

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      onCSVFileChange(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const parseResult = parseCSV(text);
        
        if (parseResult.errors.length > 0) {
          toast({
            title: "CSV Parse Errors",
            description: `Found ${parseResult.errors.length} errors in the CSV file`,
            variant: "destructive"
          });
        } else {
          onCSVDataChange(parseResult.data);
          toast({
            title: "CSV Uploaded Successfully",
            description: `Loaded ${parseResult.data.length} records from CSV`,
          });
        }
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "Invalid File Type",
        description: "Please select a CSV file",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* CSV Upload Section */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5 text-blue-600" />
              <span>Upload CSV Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  className="hidden"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
                >
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {csvFile ? csvFile.name : 'Click to upload CSV file'}
                    </p>
                  </div>
                </label>
              </div>

              {csvData.length > 0 && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">
                      {csvData.length} records loaded successfully
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* CSV Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>CSV Format Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <strong>Required columns:</strong>
                <ul className="mt-1 ml-4 list-disc text-gray-600">
                  <li>url - Target URL for QR code</li>
                  <li>name - Recipient name</li>
                </ul>
              </div>
              <div>
                <strong>Optional columns:</strong>
                <ul className="mt-1 ml-4 list-disc text-gray-600">
                  <li>email - Email address</li>
                  <li>company - Company name</li>
                  <li>phone - Phone number</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Section */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Data Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {csvData.length > 0 ? (
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  Showing first 5 records:
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {csvData.slice(0, 5).map((row, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded mb-2 text-sm">
                      <div><strong>Name:</strong> {row.name || 'N/A'}</div>
                      <div><strong>URL:</strong> {row.url || 'N/A'}</div>
                      {row.email && <div><strong>Email:</strong> {row.email}</div>}
                      {row.company && <div><strong>Company:</strong> {row.company}</div>}
                    </div>
                  ))}
                </div>
                <Button 
                  onClick={onBulkSave}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Generate QR Codes for All Records
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Upload a CSV file to see data preview
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
