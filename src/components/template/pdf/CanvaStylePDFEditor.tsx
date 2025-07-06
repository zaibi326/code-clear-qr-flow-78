
import React, { useState, useEffect } from 'react';
import { Template } from '@/types/template';
import { EnhancedPDFUploader } from './EnhancedPDFUploader';
import { PDFPreviewCanvas } from './PDFPreviewCanvas';
import { PDFOperationsPanel } from './PDFOperationsPanel';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, FileText, Eye, AlertCircle, CheckCircle } from 'lucide-react';
import { pdfOperationsService } from '@/services/pdfOperationsService';
import { toast } from '@/hooks/use-toast';

interface CanvaStylePDFEditorProps {
  template?: Template;
  onSave: (template: Template) => void;
  onCancel: () => void;
}

export const CanvaStylePDFEditor: React.FC<CanvaStylePDFEditorProps> = ({
  template: initialTemplate,
  onSave,
  onCancel
}) => {
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(initialTemplate || null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isApiConnected, setIsApiConnected] = useState<boolean | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Test PDF.co API connection on component mount
  useEffect(() => {
    testApiConnection();
  }, []);

  const testApiConnection = async () => {
    try {
      console.log('🧪 Testing PDF.co API connection...');
      const result = await pdfOperationsService.testApiConnection();
      
      if (result.success) {
        setIsApiConnected(true);
        setApiError(null);
        console.log('✅ PDF.co API connection successful');
      } else {
        setIsApiConnected(false);
        setApiError(result.error || 'API connection failed');
        console.error('❌ PDF.co API connection failed:', result.error);
      }
    } catch (error: any) {
      setIsApiConnected(false);
      setApiError(error.message || 'Failed to test API connection');
      console.error('💥 API connection test failed:', error);
    }
  };

  const handleTemplateUpload = (uploadedTemplate: Template) => {
    console.log('📄 Template uploaded for Canva-style editing:', uploadedTemplate);
    setCurrentTemplate(uploadedTemplate);
    
    // Reset state for new template
    setCurrentPage(1);
    setSearchTerm('');
    
    toast({
      title: "PDF loaded successfully",
      description: "Your PDF is ready for editing with Canva-style tools",
    });
  };

  const handleTemplateUpdate = (updatedTemplate: Template) => {
    console.log('📝 Template updated in Canva editor:', updatedTemplate);
    setCurrentTemplate(updatedTemplate);
    onSave(updatedTemplate);
    
    toast({
      title: "Changes saved",
      description: "Your PDF edits have been applied successfully",
    });
  };

  const getPDFUrl = () => {
    return currentTemplate?.template_url || currentTemplate?.preview;
  };

  // Show API connection error if needed
  if (isApiConnected === false) {
    return (
      <div className="h-screen w-full bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h1 className="text-lg font-semibold">Canva-Style PDF Editor</h1>
            </div>
          </div>
        </div>

        {/* API Error */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="mt-2">
                <div className="space-y-2">
                  <p className="font-medium">PDF.co API Connection Failed</p>
                  <p className="text-sm">{apiError}</p>
                  <p className="text-sm">
                    Please check your API configuration or contact support.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
            
            <div className="mt-4 flex gap-2">
              <Button onClick={testApiConnection} variant="outline" size="sm">
                Test Connection Again
              </Button>
              <Button onClick={onCancel} variant="outline" size="sm">
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show uploader if no template is loaded
  if (!currentTemplate) {
    return (
      <div className="h-screen w-full bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onCancel}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h1 className="text-lg font-semibold">Canva-Style PDF Editor</h1>
              </div>
            </div>
            
            {/* API Status */}
            {isApiConnected === true && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>PDF.co API Connected</span>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Uploader */}
        <div className="flex-1 flex items-center justify-center p-6">
          <EnhancedPDFUploader
            onUploadComplete={handleTemplateUpload}
            onCancel={onCancel}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h1 className="text-lg font-semibold">
                Editing: {currentTemplate.name}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* API Status */}
            {isApiConnected === true && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>PDF.co Connected</span>
              </div>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentTemplate(null)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Upload New PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Canva-style Layout */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Operations */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <PDFOperationsPanel
              template={currentTemplate}
              onTemplateUpdate={handleTemplateUpdate}
            />
          </div>
        </div>

        {/* Center Panel - PDF Preview */}
        <div className="flex-1 p-4">
          <PDFPreviewCanvas
            fileUrl={getPDFUrl()!}
            fileName={currentTemplate.name}
            searchTerm={searchTerm}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};
