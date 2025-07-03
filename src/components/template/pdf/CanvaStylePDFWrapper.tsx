
import React from 'react';
import { Template } from '@/types/template';
import { FullFeaturedPDFEditor } from './FullFeaturedPDFEditor';

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
  const handleSave = async (editedPDF?: Blob) => {
    // Create updated template with edited PDF
    const updatedTemplate = {
      ...template,
      updatedAt: new Date(), // Fix: Use Date object instead of string
      // Add any additional metadata for the edited PDF
      isEdited: true,
      editedPDF: editedPDF
    };
    
    onSave(updatedTemplate);
  };

  return (
    <div className="h-screen w-full">
      <FullFeaturedPDFEditor
        template={template}
        onSave={handleSave}
        onCancel={onCancel}
      />
    </div>
  );
};
