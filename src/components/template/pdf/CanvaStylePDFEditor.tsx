
import React, { useState } from 'react';
import { Template } from '@/types/template';
import { APIConnectionError } from './components/APIConnectionError';
import { PDFUploaderScreen } from './components/PDFUploaderScreen';
import { PDFEditorHeader } from './components/PDFEditorHeader';
import { PDFEditorLayout } from './components/PDFEditorLayout';
import { usePDFApiConnection } from '@/hooks/usePDFApiConnection';
import { useMobileDetection } from '@/hooks/useMobileDetection';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { isApiConnected, apiError, isRetrying, testApiConnection } = usePDFApiConnection();
  const { isMobile } = useMobileDetection();

  // Auto-close sidebar on mobile
  React.useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Show API connection error if needed
  if (isApiConnected === false) {
    return (
      <APIConnectionError
        apiError={apiError}
        isRetrying={isRetrying}
        onRetry={testApiConnection}
        onCancel={onCancel}
      />
    );
  }

  // Show uploader if no template is loaded
  if (!currentTemplate) {
    return (
      <PDFUploaderScreen
        isApiConnected={isApiConnected}
        onUploadComplete={handleTemplateUpload}
        onCancel={onCancel}
      />
    );
  }

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20 flex flex-col">
      <PDFEditorHeader
        currentTemplate={currentTemplate}
        isApiConnected={isApiConnected}
        isMobile={isMobile}
        isRetrying={isRetrying}
        onCancel={onCancel}
        onToggleSidebar={toggleSidebar}
        onNewPDF={() => setCurrentTemplate(null)}
        onRetryConnection={testApiConnection}
      />

      <PDFEditorLayout
        currentTemplate={currentTemplate}
        isSidebarOpen={isSidebarOpen}
        isMobile={isMobile}
        searchTerm={searchTerm}
        currentPage={currentPage}
        onTemplateUpdate={handleTemplateUpdate}
        onSearchTermChange={setSearchTerm}
        onPageChange={setCurrentPage}
        onToggleSidebar={toggleSidebar}
      />
    </div>
  );
};
