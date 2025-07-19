
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileText } from 'lucide-react';

interface PDFUploadZoneProps {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
}

export const PDFUploadZone: React.FC<PDFUploadZoneProps> = ({
  onFileSelect,
  isUploading = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="h-full flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
          <FileText className="w-10 h-10 text-blue-600" />
        </div>
        
        <h2 className="text-2xl font-semibold mb-3 text-gray-900">
          Upload PDF to Edit
        </h2>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          Upload a PDF file to start editing text inline with our Canva-style editor.
          Click anywhere on the text to edit it directly.
        </p>
        
        <Button 
          onClick={handleClick} 
          disabled={isUploading}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Upload className="w-5 h-5 mr-2" />
          {isUploading ? 'Uploading...' : 'Choose PDF File'}
        </Button>
        
        <p className="text-sm text-gray-500 mt-4">
          Supports PDF files up to 50MB
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};
