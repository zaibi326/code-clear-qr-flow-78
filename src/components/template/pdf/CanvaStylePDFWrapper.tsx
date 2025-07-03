
import React from 'react';
import { CanvaStylePDFEditor } from './CanvaStylePDFEditor';
import { Template } from '@/types/template';

interface CanvaStylePDFWrapperProps {
  template: Template;
  onSave: (template: Template) => void;
  onCancel: () => void;
}

export const CanvaStylePDFWrapper: React.FC<CanvaStylePDFWrapperProps> = ({
  template,
  onSave,
  onCancel
}) => {
  const handleSave = () => {
    // Save the template with any modifications
    onSave(template);
  };

  return (
    <div className="h-screen">
      <CanvaStylePDFEditor
        template={template}
        onSave={handleSave}
        onCancel={onCancel}
      />
    </div>
  );
};
