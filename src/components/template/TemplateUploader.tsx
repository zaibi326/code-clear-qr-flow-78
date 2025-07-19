
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileImage, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TemplateUploaderProps {
  onTemplateUpload: (file: File) => void;
}

export const TemplateUploader: React.FC<TemplateUploaderProps> = ({
  onTemplateUpload
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );

    if (validFiles.length === 0) {
      toast({
        title: "Invalid files",
        description: "Please select PDF or image files only",
        variant: "destructive"
      });
      return;
    }

    setUploadedFiles(prev => [...prev, ...validFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf']
    },
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      onTemplateUpload(file);
      setUploadedFiles(prev => prev.filter(f => f !== file));
      toast({
        title: "Upload successful",
        description: `${file.name} has been uploaded successfully`
      });
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5 text-blue-600" />
            <span>Upload Template</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors duration-200 ${
              isDragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isDragActive ? 'Drop files here' : 'Drag and drop your template here'}
            </h3>
            <p className="text-gray-600 mb-4">
              or click to browse files from your computer
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700" disabled={isUploading}>
              Choose File
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              Supports PDF, PNG, JPG files up to 10MB
            </p>
          </div>
        </CardContent>
      </Card>

      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Queue ({uploadedFiles.length} files)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="relative mb-4">
                    {file.type === 'application/pdf' ? (
                      <div className="w-full h-32 bg-red-100 rounded-lg flex items-center justify-center">
                        <FileImage className="w-8 h-8 text-red-600" />
                        <span className="ml-2 text-red-600 font-medium">PDF</span>
                      </div>
                    ) : (
                      <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FileImage className="w-8 h-8 text-gray-600" />
                      </div>
                    )}
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
                    </p>
                    
                    <Button 
                      onClick={() => handleUpload(file)}
                      disabled={isUploading}
                      className="w-full"
                      size="sm"
                    >
                      {isUploading ? 'Uploading...' : 'Upload Template'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
