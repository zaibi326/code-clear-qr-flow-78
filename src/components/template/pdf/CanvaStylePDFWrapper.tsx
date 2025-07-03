
import React from 'react';
import { Template } from '@/types/template';
import { CanvaLikePDFEditor } from './CanvaLikePDFEditor';

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
      <CanvaLikePDFEditor
        template={template}
        onSave={handleSave}
        onCancel={onCancel}
        hideFileUpload={true}
      />
    </div>
  );
};
