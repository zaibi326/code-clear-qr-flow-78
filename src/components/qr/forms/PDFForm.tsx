
import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Upload, FileText, Globe } from 'lucide-react';

interface PDFFormProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

export function PDFForm({ formData, onInputChange }: PDFFormProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

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
      if (file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
        setUploadedFile(file);
        // In a real app, you'd upload the file and get a URL
        onInputChange('url', `https://example.com/uploads/${file.name}`);
      }
    }
  }, [onInputChange]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
        setUploadedFile(file);
        onInputChange('url', `https://example.com/uploads/${file.name}`);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload PDFs
          </CardTitle>
          <p className="text-sm text-gray-600">
            Generate QR Code for your PDFs in few clicks
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>PDF File Upload</Label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-3">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-lg font-medium">Drag file here or</p>
                  <Button variant="outline" className="mt-2">
                    Choose File
                  </Button>
                </div>
                <p className="text-sm text-gray-500">File size: max 5MB</p>
              </div>
              {uploadedFile && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    ✓ {uploadedFile.name} uploaded successfully
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="pdf-url">Or enter PDF URL</Label>
            <Input
              id="pdf-url"
              type="url"
              placeholder="https://example.com/document.pdf"
              value={formData.url || ''}
              onChange={(e) => onInputChange('url', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="pdf-title">Document Title (Optional)</Label>
            <Input
              id="pdf-title"
              placeholder="Enter document title"
              value={formData.title || ''}
              onChange={(e) => onInputChange('title', e.target.value)}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Multi-language support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="multiLanguage">Enable Multi-language Support</Label>
              <p className="text-sm text-gray-500">Allow users to view PDF in different languages</p>
            </div>
            <Switch
              id="multiLanguage"
              checked={formData.multiLanguage === 'true'}
              onCheckedChange={(checked) => onInputChange('multiLanguage', checked.toString())}
            />
          </div>

          {formData.multiLanguage === 'true' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="defaultLanguage">Default Language</Label>
                <Input
                  id="defaultLanguage"
                  placeholder="English"
                  value={formData.defaultLanguage || ''}
                  onChange={(e) => onInputChange('defaultLanguage', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="supportedLanguages">Supported Languages</Label>
                <Input
                  id="supportedLanguages"
                  placeholder="English, Spanish, French, German"
                  value={formData.supportedLanguages || ''}
                  onChange={(e) => onInputChange('supportedLanguages', e.target.value)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
