import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, Link, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CanvaUploadAreaProps {
  onUpload: (file: File) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export const CanvaUploadArea: React.FC<CanvaUploadAreaProps> = ({
  onUpload,
  onCancel,
  isLoading
}) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      if (pdfFile.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please select a PDF file smaller than 10MB",
          variant: "destructive"
        });
        return;
      }
      
      setUploadProgress(0);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);
      
      try {
        await onUpload(pdfFile);
        setUploadProgress(100);
        clearInterval(progressInterval);
      } catch (error) {
        clearInterval(progressInterval);
        setUploadProgress(0);
      }
    } else {
      toast({
        title: "Invalid file type",
        description: "Please drop a PDF file",
        variant: "destructive"
      });
    }
  }, [onUpload]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF file",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a PDF file smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    await onUpload(file);
  }, [onUpload]);

  const handleUrlUpload = useCallback(async () => {
    if (!pdfUrl.trim()) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid PDF URL",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error('Failed to fetch PDF');
      
      const blob = await response.blob();
      const file = new File([blob], 'document.pdf', { type: 'application/pdf' });
      
      await onUpload(file);
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Could not load PDF from URL",
        variant: "destructive"
      });
    }
  }, [pdfUrl, onUpload]);

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
              <p className="text-sm text-gray-600">Professional PDF editing with Canva-style interface</p>
            </div>
          </div>
          <Button variant="ghost" onClick={onCancel} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl space-y-8">
          {/* Upload Progress */}
          {(isLoading || uploadProgress > 0) && (
            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  <span className="font-medium text-blue-900">
                    {uploadProgress < 100 ? 'Uploading PDF...' : 'Processing PDF...'}
                  </span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-blue-700 mt-2">
                  {uploadProgress < 100 ? `${uploadProgress}% uploaded` : 'Preparing editor...'}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Upload Options */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Drag & Drop Upload */}
            <Card className={`border-2 border-dashed transition-all duration-200 ${
              dragActive 
                ? 'border-blue-400 bg-blue-50/50 scale-105' 
                : 'border-gray-300 hover:border-blue-400 hover:shadow-lg'
            }`}>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Upload className="w-6 h-6" />
                  Upload PDF File
                </CardTitle>
              </CardHeader>
              <CardContent 
                className="space-y-4"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Drop your PDF here
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    or click to browse files
                  </p>
                  
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    disabled={isLoading}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label
                    htmlFor="pdf-upload"
                    className={`inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors ${
                      isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    Choose PDF File
                  </label>
                </div>
                
                <div className="text-center text-sm text-gray-500 space-y-1">
                  <p>Maximum file size: 10MB</p>
                  <p>Supported formats: PDF</p>
                </div>
              </CardContent>
            </Card>

            {/* URL Upload */}
            <Card className="border-2 border-dashed border-gray-300 hover:border-purple-400 hover:shadow-lg transition-all duration-200">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Link className="w-6 h-6" />
                  Load from URL
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Link className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="pdf-url" className="text-sm font-medium">PDF URL</Label>
                  <Input
                    id="pdf-url"
                    type="url"
                    placeholder="https://example.com/document.pdf"
                    value={pdfUrl}
                    onChange={(e) => setPdfUrl(e.target.value)}
                    disabled={isLoading}
                    className="h-12"
                  />
                  <Button
                    onClick={handleUrlUpload}
                    disabled={isLoading || !pdfUrl.trim()}
                    className="w-full h-12"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Loading PDF...
                      </>
                    ) : (
                      <>
                        <Link className="w-4 h-4 mr-2" />
                        Load PDF from URL
                      </>
                    )}
                  </Button>
                </div>
                
                <p className="text-sm text-gray-500">
                  Enter a direct link to a publicly accessible PDF file
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Features Showcase */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                ✨ What you can do with ClearQR PDF Editor:
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700">
                <div className="space-y-2">
                  <div className="font-medium text-blue-900">📝 Text Editing</div>
                  <div>• Edit text directly</div>
                  <div>• Search & replace</div>
                  <div>• Font customization</div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium text-purple-900">🎨 Annotations</div>
                  <div>• Highlight text</div>
                  <div>• Add shapes</div>
                  <div>• Freehand drawing</div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium text-green-900">🖼️ Images</div>
                  <div>• Insert images</div>
                  <div>• Resize & move</div>
                  <div>• Replace images</div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium text-orange-900">📤 Export</div>
                  <div>• Save as PDF</div>
                  <div>• Export to PNG/JPG</div>
                  <div>• Convert to DOCX</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};