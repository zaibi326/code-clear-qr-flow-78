
import React from 'react';
import { Template } from '@/types/template';
import { PDFTextEditor } from './pdf/PDFTextEditor';

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
    <PDFTextEditor
      onSave={handleSave}
      onCancel={onCancel}
    />
  );
};
