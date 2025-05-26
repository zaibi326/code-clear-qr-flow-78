
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileImage, X, CheckCircle } from 'lucide-react';
import { Template } from '@/types/template';

interface TemplateUploadTabProps {
  onTemplateUpload: (template: Template) => void;
}

export const TemplateUploadTab = ({ onTemplateUpload }: TemplateUploadTabProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [templateNames, setTemplateNames] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );

    setUploadedFiles(prev => [...prev, ...validFiles]);
    setTemplateNames(prev => [...prev, ...validFiles.map(file => file.name.split('.')[0])]);

    // Generate previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
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
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setTemplateNames(prev => prev.filter((_, i) => i !== index));
  };

  const updateTemplateName = (index: number, name: string) => {
    setTemplateNames(prev => prev.map((n, i) => i === index ? name : n));
  };

  const handleUpload = async (index: number) => {
    const file = uploadedFiles[index];
    const preview = previews[index];
    const name = templateNames[index];

    if (!name.trim()) {
      alert('Please enter a template name');
      return;
    }

    setIsUploading(true);

    try {
      const template: Template = {
        id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: name.trim(),
        file,
        preview,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      onTemplateUpload(template);
      removeFile(index);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadAll = async () => {
    setIsUploading(true);
    
    try {
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        const preview = previews[i];
        const name = templateNames[i] || file.name.split('.')[0];

        const template: Template = {
          id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${i}`,
          name: name.trim(),
          file,
          preview,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        onTemplateUpload(template);
      }
      
      // Clear all files after successful upload
      setUploadedFiles([]);
      setPreviews([]);
      setTemplateNames([]);
    } catch (error) {
      console.error('Batch upload failed:', error);
      alert('Some uploads failed. Please try again.');
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
            <div className="flex items-center justify-between">
              <CardTitle>Upload Queue ({uploadedFiles.length} files)</CardTitle>
              <Button 
                onClick={handleUploadAll}
                disabled={isUploading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isUploading ? 'Uploading...' : 'Upload All'}
              </Button>
            </div>
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
                      <img 
                        src={previews[index]} 
                        alt={file.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    )}
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`name-${index}`}>Template Name</Label>
                      <Input
                        id={`name-${index}`}
                        value={templateNames[index] || ''}
                        onChange={(e) => updateTemplateName(index, e.target.value)}
                        placeholder="Enter template name"
                        className="mt-1"
                      />
                    </div>
                    
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
                    </p>
                    
                    <Button 
                      onClick={() => handleUpload(index)}
                      disabled={isUploading || !templateNames[index]?.trim()}
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
