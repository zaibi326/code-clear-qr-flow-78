
import React, { useState } from 'react';
import { Template } from '@/types/template';
import { EnhancedPDFUploader } from './EnhancedPDFUploader';
import { PDFPreviewCanvas } from './PDFPreviewCanvas';
import { PDFOperationsPanel } from './PDFOperationsPanel';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Eye } from 'lucide-react';

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

  const handleTemplateUpload = (uploadedTemplate: Template) => {
    console.log('Template uploaded for editing:', uploadedTemplate);
    setCurrentTemplate(uploadedTemplate);
  };

  const handleTemplateUpdate = (updatedTemplate: Template) => {
    console.log('Template updated:', updatedTemplate);
    setCurrentTemplate(updatedTemplate);
    onSave(updatedTemplate);
  };

  const getPDFUrl = () => {
    return currentTemplate?.template_url || currentTemplate?.preview;
  };

  // Show uploader if no template is loaded
  if (!currentTemplate) {
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

        {/* Uploader */}
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
          
          <div className="flex items-center gap-2">
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

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Operations Panel */}
        <div className="w-96 bg-white border-r border-gray-200 overflow-y-auto">
          <PDFOperationsPanel
            template={currentTemplate}
            onTemplateUpdate={handleTemplateUpdate}
          />
        </div>

        {/* PDF Preview */}
        <div className="flex-1 p-6">
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
