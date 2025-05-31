
import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface ImageFormProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

export function ImageForm({ formData, onInputChange }: ImageFormProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      // Create a URL for the uploaded file
      const fileUrl = URL.createObjectURL(file);
      onInputChange('imageUrl', fileUrl);
      onInputChange('uploadedFile', file.name);
    }
  }, [onInputChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Image</h3>
        <p className="text-gray-600 mb-6">
          Upload the image that your QR code should link to
        </p>
      </div>

      {/* File Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center space-y-4">
              <div className="p-3 bg-gray-100 rounded-full">
                {uploadedFile ? (
                  <ImageIcon className="h-8 w-8 text-gray-600" />
                ) : (
                  <Upload className="h-8 w-8 text-gray-600" />
                )}
              </div>
              
              {uploadedFile ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">
                    {uploadedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    {isDragActive ? 'Drop the file here' : 'Drag file here or'}
                  </p>
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm underline"
                  >
                    Browse files
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <p className="text-xs text-gray-500 mt-2 text-center">
            1920x1080 pixels. 5MB max file size.
          </p>
        </CardContent>
      </Card>

      {/* URL Input Alternative */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or paste link below</span>
        </div>
      </div>

      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          type="url"
          placeholder="https://www.example.com"
          value={formData.imageUrl || formData.url || ''}
          onChange={(e) => {
            onInputChange('imageUrl', e.target.value);
            onInputChange('url', e.target.value);
            // Clear uploaded file if URL is being used
            if (e.target.value && uploadedFile) {
              setUploadedFile(null);
            }
          }}
          className="mt-1"
        />
      </div>
    </div>
  );
}
