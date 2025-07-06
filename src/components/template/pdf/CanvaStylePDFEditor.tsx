
import React, { useState, useEffect } from 'react';
import { Template } from '@/types/template';
import { EnhancedPDFUploader } from './EnhancedPDFUploader';
import { PDFPreviewCanvas } from './PDFPreviewCanvas';
import { PDFOperationsPanel } from './PDFOperationsPanel';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, FileText, Eye, AlertCircle, CheckCircle, Menu } from 'lucide-react';
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
  const [isRetrying, setIsRetrying] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Test PDF.co API connection on component mount
  useEffect(() => {
    testApiConnection();
  }, []);

  const testApiConnection = async () => {
    try {
      console.log('🧪 Testing PDF.co API connection...');
      setIsRetrying(true);
      
      const result = await pdfOperationsService.testApiConnection();
      
      if (result.success) {
        setIsApiConnected(true);
        setApiError(null);
        console.log('✅ PDF.co API connection successful');
        
        toast({
          title: "API Connected",
          description: "PDF.co service is ready for PDF operations",
        });
      } else {
        setIsApiConnected(false);
        setApiError(result.error || 'API connection failed');
        console.error('❌ PDF.co API connection failed:', result.error);
        
        toast({
          title: "API Connection Failed",
          description: result.error || 'Unable to connect to PDF.co service',
          variant: "destructive"
        });
      }
    } catch (error: any) {
      setIsApiConnected(false);
      setApiError(error.message || 'Failed to test API connection');
      console.error('💥 API connection test failed:', error);
      
      toast({
        title: "Connection Error",
        description: "Network error while connecting to PDF.co",
        variant: "destructive"
      });
    } finally {
      setIsRetrying(false);
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Show API connection error if needed
  if (isApiConnected === false) {
    return (
      <div className="h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Modern Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 px-6 py-4 shadow-sm">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onCancel} className="hover:bg-gray-100/80">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Canva-Style PDF Editor
              </h1>
            </div>
          </div>
        </div>

        {/* API Error with modern design */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md">
            <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Connection Failed</h3>
                  <p className="text-sm text-gray-600">PDF.co API is not accessible</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-700">{apiError}</p>
                <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-xl border border-red-100">
                  <p className="text-sm font-medium mb-2 text-red-800">Possible causes:</p>
                  <ul className="text-xs space-y-1 text-red-700">
                    <li>• Invalid or expired API key</li>
                    <li>• Network connectivity issues</li>
                    <li>• API service temporarily unavailable</li>
                    <li>• File URL not accessible by PDF.co</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 flex gap-3">
                <Button 
                  onClick={testApiConnection} 
                  variant="outline" 
                  size="sm"
                  disabled={isRetrying}
                  className="flex-1"
                >
                  {isRetrying ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                      Testing...
                    </>
                  ) : (
                    'Retry Connection'
                  )}
                </Button>
                <Button onClick={onCancel} variant="ghost" size="sm" className="flex-1">
                  Go Back
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show uploader if no template is loaded
  if (!currentTemplate) {
    return (
      <div className="h-screen w-full bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        {/* Modern Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onCancel} className="hover:bg-gray-100/80">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Canva-Style PDF Editor
                </h1>
              </div>
            </div>
            
            {/* API Status */}
            {isApiConnected && (
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                <CheckCircle className="w-4 h-4" />
                <span>API Connected</span>
              </div>
            )}
            {isApiConnected === null && (
              <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                <span>Connecting...</span>
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
    <div className="h-screen w-full bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20 flex flex-col">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 px-4 md:px-6 py-4 shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            <Button variant="ghost" size="sm" onClick={onCancel} className="hover:bg-gray-100/80">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            
            {/* Mobile menu toggle */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleSidebar}
              className="md:hidden hover:bg-gray-100/80"
            >
              <Menu className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-base md:text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent truncate max-w-[150px] md:max-w-none">
                {currentTemplate.name}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-3">
            {/* API Status */}
            {isApiConnected && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                <CheckCircle className="w-4 h-4" />
                <span>Connected</span>
              </div>
            )}
            {isApiConnected === false && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={testApiConnection}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Reconnect</span>
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentTemplate(null)}
              className="hover:bg-gray-100/80"
            >
              <Eye className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">New PDF</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Responsive Canva-style Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Operations (Responsive) */}
        <div className={`
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          ${isMobile ? 'absolute inset-y-0 left-0 z-50' : 'relative'}
          w-80 bg-white/90 backdrop-blur-sm border-r border-gray-200/60 
          transition-transform duration-300 ease-in-out shadow-xl md:shadow-none
          flex flex-col
        `}>
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <PDFOperationsPanel
                template={currentTemplate}
                onTemplateUpdate={handleTemplateUpdate}
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
              />
            </div>
          </div>
        </div>

        {/* Mobile overlay */}
        {isMobile && isSidebarOpen && (
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={toggleSidebar}
          />
        )}

        {/* Center Panel - PDF Preview (Responsive) */}
        <div className="flex-1 p-2 md:p-4 overflow-hidden">
          <div className="h-full bg-white/70 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-xl border border-gray-200/60 overflow-hidden">
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
    </div>
  );
};
