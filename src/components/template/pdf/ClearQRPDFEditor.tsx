
import React, { useState } from 'react';
import { Template } from '@/types/template';
import { AdvancedPDFUploader } from './AdvancedPDFUploader';
import { CanvaFullFeaturedEditor } from './CanvaFullFeaturedEditor';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';

interface ClearQRPDFEditorProps {
  template?: Template;
  onSave: (template: Template) => void;
  onCancel: () => void;
}

export const ClearQRPDFEditor: React.FC<ClearQRPDFEditorProps> = ({
  template: initialTemplate,
  onSave,
  onCancel
}) => {
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(initialTemplate || null);

  const handleTemplateUpload = (uploadedTemplate: Template) => {
    console.log('📄 Template uploaded to ClearQR PDF Editor:', uploadedTemplate);
    setCurrentTemplate(uploadedTemplate);
  };

  const handleTemplateSave = (updatedTemplate: Template) => {
    console.log('💾 Template saved in ClearQR PDF Editor:', updatedTemplate);
    setCurrentTemplate(updatedTemplate);
    onSave(updatedTemplate);
  };

  // Show uploader if no template is loaded
  if (!currentTemplate) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h1 className="text-lg font-semibold">ClearQR PDF Editor</h1>
            </div>
          </div>
        </div>

        {/* Advanced Uploader */}
        <div className="py-12">
          <AdvancedPDFUploader
            onUploadComplete={handleTemplateUpload}
            onCancel={onCancel}
            maxFileSize={100 * 1024 * 1024} // 100MB
          />
        </div>
      </div>
    );
  }

  // Show full-featured editor
  return (
    <CanvaFullFeaturedEditor
      template={currentTemplate}
      onSave={handleTemplateSave}
      onCancel={onCancel}
    />
  );
};
