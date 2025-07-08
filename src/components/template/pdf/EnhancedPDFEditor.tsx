
import React, { useState } from 'react';
import { Template } from '@/types/template';
import { PDFOperationsPanel } from './PDFOperationsPanel';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';

interface EnhancedPDFEditorProps {
  template: Template;
  onSave: (template: Template) => void;
  onCancel: () => void;
}

export const EnhancedPDFEditor: React.FC<EnhancedPDFEditorProps> = ({
  template,
  onSave,
  onCancel
}) => {
  const [currentTemplate, setCurrentTemplate] = useState<Template>(template);
  const [searchTerm, setSearchTerm] = useState('');

  const handleTemplateUpdate = (updatedTemplate: Template) => {
    console.log('Template updated:', updatedTemplate);
    setCurrentTemplate(updatedTemplate);
    onSave(updatedTemplate);
  };

  const handleSearchTermChange = (term: string) => {
    setSearchTerm(term);
  };

  const getPDFUrl = () => {
    return currentTemplate.template_url || currentTemplate.preview;
  };

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
              <h1 className="text-lg font-semibold">PDF Operations - {currentTemplate.name}</h1>
            </div>
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
            searchTerm={searchTerm}
            onSearchTermChange={handleSearchTermChange}
          />
        </div>

        {/* PDF Preview */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
            {getPDFUrl() ? (
              <iframe
                src={getPDFUrl()}
                className="w-full h-full rounded-lg"
                title="PDF Preview"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No PDF loaded</p>
                  <p className="text-sm">Upload a PDF to start using operations</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
