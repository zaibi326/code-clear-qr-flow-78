
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { parseCSV, validateCSVData } from '@/utils/csvParser';

export const DataUploadTab = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const { toast } = useToast();

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setUploadedFile(file);
        handleFileUpload(file);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please select a CSV file",
          variant: "destructive"
        });
      }
    }
  }, [toast]);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadResult(null);

    try {
      const text = await file.text();
      const parseResult = parseCSV(text);
      
      if (parseResult.errors.length > 0) {
        toast({
          title: "CSV Parse Errors",
          description: `Found ${parseResult.errors.length} errors in the CSV file`,
          variant: "destructive"
        });
      }

      const validationErrors = validateCSVData(parseResult.data, ['name', 'email', 'url']);
      
      setUploadResult({
        ...parseResult,
        validationErrors,
        fileName: file.name,
        fileSize: file.size
      });

      if (parseResult.data.length > 0 && validationErrors.length === 0) {
        toast({
          title: "Upload Successful",
          description: `Successfully processed ${parseResult.data.length} rows`,
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to process the CSV file",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setUploadedFile(file);
        handleFileUpload(file);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please drop a CSV file",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5 text-blue-600" />
            <span>Upload CSV Data</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-colors duration-200 cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Drag and drop your CSV file here
            </h3>
            <p className="text-gray-600 mb-4">
              or click to browse files from your computer
            </p>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isUploading}
            >
              {isUploading ? 'Processing...' : 'Choose File'}
            </Button>
            <input
              id="file-input"
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            <p className="text-sm text-gray-500 mt-4">
              Supports CSV files up to 50MB with unlimited rows
            </p>
          </div>

          {uploadResult && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                {uploadResult.validationErrors.length === 0 ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <h4 className="font-medium">Upload Results</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">File:</span>
                  <span className="ml-2 font-medium">{uploadResult.fileName}</span>
                </div>
                <div>
                  <span className="text-gray-600">Size:</span>
                  <span className="ml-2 font-medium">{(uploadResult.fileSize / 1024).toFixed(1)} KB</span>
                </div>
                <div>
                  <span className="text-gray-600">Total Rows:</span>
                  <span className="ml-2 font-medium">{uploadResult.summary.totalRows}</span>
                </div>
                <div>
                  <span className="text-gray-600">Valid Rows:</span>
                  <span className="ml-2 font-medium">{uploadResult.summary.validRows}</span>
                </div>
              </div>
              
              {uploadResult.validationErrors.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-medium text-red-600 mb-2">Validation Errors:</h5>
                  <ul className="text-sm text-red-600 space-y-1">
                    {uploadResult.validationErrors.slice(0, 5).map((error: string, index: number) => (
                      <li key={index}>• {error}</li>
                    ))}
                    {uploadResult.validationErrors.length > 5 && (
                      <li>• ... and {uploadResult.validationErrors.length - 5} more errors</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>CSV Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Required Columns:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>name - Recipient name</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>email - Email address</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>url - Target URL for QR code</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Optional Columns:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>company - Company name</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>phone - Phone number</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>custom_field - Any custom data</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
