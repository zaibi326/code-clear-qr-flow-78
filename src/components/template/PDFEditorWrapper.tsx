
import React from 'react';
import { Template } from '@/types/template';
import { CanvasPDFEditor } from './CanvasPDFEditor';

interface PDFEditorWrapperProps {
  template: Template;
  onSave: (template: Template) => void;
  onCancel: () => void;
}

export const PDFEditorWrapper: React.FC<PDFEditorWrapperProps> = ({
  template,
  onSave,
  onCancel
}) => {
  return (
    <div className="h-screen w-full">
      <CanvasPDFEditor
        template={template}
        onSave={onSave}
        onCancel={onCancel}
      />
    </div>
  );
};
