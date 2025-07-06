import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';
import { fileUploadService, UploadProgress } from '@/services/fileUploadService';
import { Template } from '@/types/template';
import { toast } from '@/hooks/use-toast';

interface EnhancedPDFUploaderProps {
  onUploadComplete: (template: Template) => void;
  onCancel?: () => void;
}

export const EnhancedPDFUploader: React.FC<EnhancedPDFUploaderProps> = ({
  onUploadComplete,
  onCancel
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProgress = useCallback((progress: UploadProgress) => {
    setUploadProgress(progress);
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setError(null);
    setIsUploading(true);
    setUploadedFile(file);

    try {
      console.log('📤 Starting enhanced PDF upload:', file.name);
      
      const result = await fileUploadService.uploadFile(file, 'documents', handleProgress);

      if (result.success && result.publicUrl) {
        // Create template object with correct property names
        const template: Template = {
          id: crypto.randomUUID(),
          name: file.name.replace('.pdf', ''),
          preview: result.publicUrl,
          template_url: result.publicUrl,
          thumbnail_url: result.publicUrl,
          category: 'PDF Document',
          createdAt: new Date(),
          updatedAt: new Date(),
          file: file,
          fileSize: result.fileSize || file.size, // Fixed: use fileSize instead of file_size
          file_type: 'application/pdf'
        };

        toast({
          title: "PDF Upload Successful",
          description: `${file.name} is ready for editing`,
          duration: 3000
        });

        onUploadComplete(template);
      } else {
        setError(result.error || 'Upload failed');
        toast({
          title: "Upload Failed",
          description: result.error || 'Please try again',
          variant: "destructive"
        });
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Upload failed unexpectedly';
      setError(errorMessage);
      toast({
        title: "Upload Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        handleFileUpload(file);
      } else {
        setError('Please upload a PDF file only');
      }
    }
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-xl">
            <Upload className="w-6 h-6 text-blue-600" />
            Upload PDF for Editing
          </CardTitle>
          <p className="text-gray-600">
            Upload your PDF file to start editing with our Canva-style editor
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isUploading ? (
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="space-y-4">
                <div className="flex justify-center">
                  <FileText className="w-16 h-16 text-gray-400" />
                </div>
                
                <div>
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Drop your PDF here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Maximum file size: 10MB • Only PDF files are supported
                  </p>
                </div>

                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileInputChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isUploading}
                />

                <Button
                  variant="outline"
                  className="pointer-events-none"
                  disabled={isUploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose PDF File
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <FileText className="w-8 h-8 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {uploadedFile?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {uploadedFile && (uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                {uploadProgress?.percentage === 100 && (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                )}
              </div>

              {uploadProgress && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress.percentage}%</span>
                  </div>
                  <Progress value={uploadProgress.percentage} className="h-2" />
                </div>
              )}
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">What you can do:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Search and replace text across all pages</li>
              <li>• Add annotations and highlights</li>
              <li>• Insert QR codes and images</li>
              <li>• Preview changes in real-time</li>
              <li>• Download edited PDF instantly</li>
            </ul>
          </div>

          {onCancel && (
            <div className="flex justify-center">
              <Button variant="outline" onClick={onCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
