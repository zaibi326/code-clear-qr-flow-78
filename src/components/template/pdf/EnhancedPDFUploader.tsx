
import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, FileText, X, CheckCircle, AlertCircle,
  File, Loader2 
} from 'lucide-react';
import { Template } from '@/types/template';
import { toast } from '@/hooks/use-toast';

interface EnhancedPDFUploaderProps {
  onUploadComplete: (template: Template) => void;
  onCancel?: () => void;
  maxFileSize?: number; // in bytes, default 100MB
}

interface UploadState {
  file: File | null;
  progress: number;
  status: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}

export const EnhancedPDFUploader: React.FC<EnhancedPDFUploaderProps> = ({
  onUploadComplete,
  onCancel,
  maxFileSize = 100 * 1024 * 1024 // 100MB default
}) => {
  const [uploadState, setUploadState] = useState<UploadState>({
    file: null,
    progress: 0,
    status: 'idle'
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (file.type !== 'application/pdf') {
      return 'Please select a PDF file.';
    }
    
    if (file.size > maxFileSize) {
      const maxSizeMB = Math.round(maxFileSize / (1024 * 1024));
      return `File size must be less than ${maxSizeMB}MB.`;
    }
    
    return null;
  };

  const processFile = async (file: File): Promise<Template> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          
          const template: Template = {
            id: `pdf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: file.name.replace('.pdf', ''),
            preview: url,
            template_url: url,
            thumbnail_url: url,
            file_type: 'application/pdf',
            file_size: file.size,
            dimensions: { width: 595, height: 842 }, // Standard A4 size
            category: 'PDF',
            description: `Uploaded PDF: ${file.name}`,
            tags: ['pdf', 'uploaded'],
            is_public: false,
            is_builtin: false,
            usage_count: 0,
            user_id: 'current-user', // This would come from auth
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            file: file,
            editable_json: null,
            qrPosition: null
          };
          
          resolve(template);
        } catch (error) {
          reject(new Error('Failed to process PDF file'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileUpload = useCallback(async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setUploadState({
        file: null,
        progress: 0,
        status: 'error',
        error: validationError
      });
      return;
    }

    setUploadState({
      file,
      progress: 0,
      status: 'uploading'
    });

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadState(prev => {
          if (prev.progress >= 80) {
            clearInterval(progressInterval);
            return { ...prev, status: 'processing', progress: 90 };
          }
          return { ...prev, progress: prev.progress + 10 };
        });
      }, 200);

      // Process the file
      const template = await processFile(file);
      
      // Complete the progress
      setUploadState({
        file,
        progress: 100,
        status: 'complete'
      });

      // Notify parent component
      setTimeout(() => {
        onUploadComplete(template);
        toast({
          title: 'PDF Uploaded Successfully',
          description: `${file.name} is ready for editing.`,
        });
      }, 500);

    } catch (error) {
      setUploadState({
        file,
        progress: 0,
        status: 'error',
        error: error instanceof Error ? error.message : 'Upload failed'
      });
      
      toast({
        title: 'Upload Failed',
        description: 'Please try uploading your PDF again.',
        variant: 'destructive'
      });
    }
  }, [maxFileSize, onUploadComplete]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(event.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      handleFileUpload(pdfFile);
    } else {
      toast({
        title: 'Invalid File Type',
        description: 'Please drop a PDF file.',
        variant: 'destructive'
      });
    }
  };

  const handleReset = () => {
    setUploadState({
      file: null,
      progress: 0,
      status: 'idle'
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const getStatusIcon = () => {
    switch (uploadState.status) {
      case 'uploading':
      case 'processing':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-600" />;
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (uploadState.status) {
      case 'uploading':
        return 'Uploading...';
      case 'processing':
        return 'Processing PDF...';
      case 'complete':
        return 'Upload Complete!';
      case 'error':
        return 'Upload Failed';
      default:
        return 'Ready to upload';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        className="hidden"
      />

      <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="mb-6">
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Upload Your PDF
              </h3>
              <p className="text-gray-600 mb-4">
                Drag and drop your PDF file here, or click to browse
              </p>
              <p className="text-sm text-gray-500">
                Maximum file size: {Math.round(maxFileSize / (1024 * 1024))}MB
              </p>
            </div>

            {/* Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
                isDragOver 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {uploadState.status === 'idle' ? (
                <div>
                  <File className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Drop your PDF file here
                  </p>
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* File Info */}
                  {uploadState.file && (
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      {getStatusIcon()}
                      <div className="text-left">
                        <p className="font-medium text-gray-900">
                          {uploadState.file.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(uploadState.file.size)} • {getStatusText()}
                        </p>
                      </div>
                      {uploadState.status !== 'uploading' && uploadState.status !== 'processing' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleReset}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Progress Bar */}
                  {(uploadState.status === 'uploading' || uploadState.status === 'processing') && (
                    <div className="space-y-2">
                      <Progress value={uploadState.progress} className="w-full" />
                      <p className="text-sm text-gray-600">
                        {uploadState.progress}% complete
                      </p>
                    </div>
                  )}

                  {/* Error Message */}
                  {uploadState.status === 'error' && uploadState.error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {uploadState.error}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Success Message */}
                  {uploadState.status === 'complete' && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        PDF uploaded successfully! Loading editor...
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Action Buttons */}
                  {uploadState.status === 'error' && (
                    <div className="flex gap-2">
                      <Button onClick={handleReset} variant="outline">
                        Try Again
                      </Button>
                      {onCancel && (
                        <Button onClick={onCancel} variant="ghost">
                          Cancel
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
