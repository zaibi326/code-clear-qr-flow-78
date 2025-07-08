
import React, { useCallback } from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PDFUploadZoneProps {
  onUpload: (file: File) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const PDFUploadZone: React.FC<PDFUploadZoneProps> = ({
  onUpload,
  onCancel,
  isLoading
}) => {
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      onUpload(file);
    }
  }, [onUpload]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      onUpload(file);
    }
  }, [onUpload]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading PDF...</h2>
          <p className="text-gray-600">Please wait while we process your document</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ClearQR PDF Editor</h1>
          <p className="text-gray-600">Upload a PDF to start editing with Canva-style tools</p>
        </div>

        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Drop your PDF here or click to browse
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Maximum file size: 10MB
          </p>
          
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
            id="pdf-upload"
          />
          
          <label htmlFor="pdf-upload">
            <Button className="mb-4">
              Choose PDF File
            </Button>
          </label>
          
          <div className="text-xs text-gray-500">
            Supported format: PDF
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button variant="outline" onClick={onCancel}>
            Back to Templates
          </Button>
        </div>
      </div>
    </div>
  );
};
