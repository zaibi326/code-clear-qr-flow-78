
import React, { useEffect } from 'react';
import { Template } from '@/types/template';
import { PDFTextEditor } from './pdf/PDFTextEditor';
import { usePDFTextEditor } from '@/hooks/canvas/usePDFTextEditor';

interface CanvasPDFEditorProps {
  template?: Template;
  onSave: (template: Template) => void;
  onCancel: () => void;
}

export const CanvasPDFEditor: React.FC<CanvasPDFEditorProps> = ({
  template,
  onSave,
  onCancel
}) => {
  const { loadPDF } = usePDFTextEditor();

  // Auto-load the PDF when template is provided
  useEffect(() => {
    if (template?.file && template.file.type === 'application/pdf') {
      console.log('Auto-loading PDF from template:', template.name);
      loadPDF(template.file);
    }
  }, [template, loadPDF]);

  const handleSave = () => {
    // For now, we'll create a basic template structure
    // In a real implementation, you'd want to save the PDF edits
    const updatedTemplate: Template = {
      ...template,
      id: template?.id || Date.now().toString(),
      name: template?.name || 'Edited PDF',
      type: 'pdf',
      updatedAt: new Date()
    };
    
    onSave(updatedTemplate);
  };

  return (
    <div className="h-screen w-full">
      <PDFTextEditor
        onSave={handleSave}
        onCancel={onCancel}
      />
    </div>
  );
};
