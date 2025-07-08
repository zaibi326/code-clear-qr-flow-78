
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Link, Loader2 } from 'lucide-react';
import { Template } from '@/types/template';
import { toast } from '@/hooks/use-toast';
import { pdfOperationsService } from '@/services/pdfOperationsService';

interface PDFUploaderScreenProps {
  isApiConnected?: boolean;
  onUploadComplete: (template: Template) => void;
  onCancel: () => void;
}

export const PDFUploaderScreen: React.FC<PDFUploaderScreenProps> = ({
  isApiConnected,
  onUploadComplete,
  onCancel
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const createTemplateFromPDF = useCallback(async (pdfUrl: string, fileName: string) => {
    const template: Template = {
      id: `canva-pdf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: fileName,
      template_url: pdfUrl,
      preview: pdfUrl,
      thumbnail_url: pdfUrl,
      category: 'pdf',
      tags: ['pdf', 'canva-editor'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      customization: {
        canvasWidth: 800,
        canvasHeight: 1000,
        backgroundColor: '#ffffff',
        elements: [],
        version: '1.0'
      }
    };

    onUploadComplete(template);
  }, [onUploadComplete]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF file",
        variant: "destructive"
      });
      return;
    }

    setFile(selectedFile);
    setIsUploading(true);

    try {
      // Create a temporary URL for the PDF
      const fileUrl = URL.createObjectURL(selectedFile);
      
      // In a real implementation, you would upload to a storage service
      // For now, we'll use the object URL and simulate the upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await createTemplateFromPDF(fileUrl, selectedFile.name);
      
      toast({
        title: "PDF uploaded successfully",
        description: "Your PDF is ready for editing",
      });
    } catch (error) {
      console.error('File upload failed:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your PDF",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  }, [createTemplateFromPDF]);

  const handleUrlUpload = useCallback(async () => {
    if (!pdfUrl.trim()) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid PDF URL",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // Test if the URL is accessible
      const response = await fetch(pdfUrl, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error('PDF URL is not accessible');
      }

      const fileName = pdfUrl.split('/').pop() || 'PDF Document';
      await createTemplateFromPDF(pdfUrl, fileName);
      
      toast({
        title: "PDF loaded successfully",
        description: "Your PDF is ready for editing",
      });
    } catch (error) {
      console.error('URL upload failed:', error);
      toast({
        title: "Load failed",
        description: "Could not load PDF from the provided URL",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  }, [pdfUrl, createTemplateFromPDF]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">ClearQR PDF Editor</h1>
              <p className="text-sm text-gray-600">Canva-style PDF editing made simple</p>
            </div>
          </div>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl space-y-6">
          {/* API Status */}
          {isApiConnected !== undefined && (
            <div className={`text-center p-3 rounded-lg ${
              isApiConnected 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
            }`}>
              {isApiConnected ? (
                "✅ PDF.co API connected - Ready for advanced operations"
              ) : (
                "⚠️ PDF.co API not connected - Basic functionality available"
              )}
            </div>
          )}

          {/* Upload Options */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* File Upload */}
            <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload PDF File
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label
                    htmlFor="pdf-upload"
                    className={`inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors ${
                      isUploading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Choose PDF File
                      </>
                    )}
                  </label>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Maximum file size: 50MB
                </p>
                {file && (
                  <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                    Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
              </CardContent>
            </Card>

            {/* URL Upload */}
            <Card className="border-2 border-dashed border-gray-300 hover:border-purple-400 transition-colors">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Link className="w-5 h-5" />
                  Load from URL
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="pdf-url">PDF URL</Label>
                  <Input
                    id="pdf-url"
                    type="url"
                    placeholder="https://example.com/document.pdf"
                    value={pdfUrl}
                    onChange={(e) => setPdfUrl(e.target.value)}
                    disabled={isUploading}
                  />
                </div>
                <Button
                  onClick={handleUrlUpload}
                  disabled={isUploading || !pdfUrl.trim()}
                  className="w-full"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Link className="w-4 h-4 mr-2" />
                      Load PDF
                    </>
                  )}
                </Button>
                <p className="text-sm text-gray-600">
                  Enter a direct link to a PDF file
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Features Preview */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-gray-900 mb-3">✨ What you can do:</h3>
              <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
                <div>• Search & replace text</div>
                <div>• Add annotations & comments</div>
                <div>• Convert to images</div>
                <div>• Download edited PDF</div>
                <div>• Real-time preview</div>
                <div>• Mobile-friendly editing</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
