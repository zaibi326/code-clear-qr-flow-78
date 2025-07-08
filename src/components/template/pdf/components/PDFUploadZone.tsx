
import React, { useCallback, useRef } from 'react';
import { Upload, FileText, Loader2, Sparkles, Zap, Palette, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log('File selected:', file?.name, file?.type, file?.size);
    
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please select a PDF file');
        return;
      }
      
      if (file.size > 50 * 1024 * 1024) {
        alert('File size must be less than 50MB');
        return;
      }
      
      console.log('Valid PDF file selected, calling onUpload');
      onUpload(file);
    }
    
    // Reset the input value so the same file can be selected again if needed
    if (event.target) {
      event.target.value = '';
    }
  }, [onUpload]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    const file = event.dataTransfer.files[0];
    console.log('File dropped:', file?.name, file?.type, file?.size);
    
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please drop a PDF file');
        return;
      }
      
      if (file.size > 50 * 1024 * 1024) {
        alert('File size must be less than 50MB');
        return;
      }
      
      console.log('Valid PDF file dropped, calling onUpload');
      onUpload(file);
    }
  }, [onUpload]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleChooseFileClick = useCallback(() => {
    console.log('Choose file button clicked');
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="w-96 shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing PDF</h3>
            <p className="text-gray-600 mb-4">We're preparing your document for editing...</p>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span>Extracting text elements</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Zap className="w-4 h-4 text-purple-500" />
                <span>Optimizing for editing</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Palette className="w-4 h-4 text-green-500" />
                <span>Preparing canvas</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <FileText className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Enhanced PDF Editor
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Edit PDFs like never before with our Canva-style editor
          </p>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Type className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Click & Edit Text</h3>
              <p className="text-sm text-gray-600">Click directly on any text to edit content, styling, and formatting</p>
            </Card>

            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Add Elements</h3>
              <p className="text-sm text-gray-600">Insert new text boxes, shapes, and images anywhere on your PDF</p>
            </Card>

            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-green-50 to-green-100">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Export Ready</h3>
              <p className="text-sm text-gray-600">Download your edited PDF with all changes preserved and searchable</p>
            </Card>
          </div>
        </div>

        {/* Upload Area */}
        <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors shadow-lg">
          <CardContent
            className="p-12 text-center cursor-pointer hover:bg-gray-50/50 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Upload className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Drop your PDF here
            </h3>
            <p className="text-gray-600 mb-6">
              Or click to browse and select a file from your computer
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileSelect}
              className="hidden"
              id="enhanced-pdf-upload"
            />
            
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-3 text-lg shadow-lg"
              onClick={handleChooseFileClick}
            >
              Choose PDF File
            </Button>
            
            <div className="mt-6 text-sm text-gray-500 space-y-1">
              <p>Maximum file size: 50MB</p>
              <p>Supported format: PDF</p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm mb-4">
            Your PDF will be processed locally for privacy and security
          </p>
          <Button variant="outline" onClick={onCancel} size="lg">
            Back to Templates
          </Button>
        </div>
      </div>
    </div>
  );
};
