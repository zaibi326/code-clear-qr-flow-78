
import React, { useState } from 'react';
import { Template } from '@/types/template';
import { CanvaStylePDFEditor } from './CanvaStylePDFEditor';

interface CanvaFullFeaturedEditorProps {
  template: Template;
  onSave: (template: Template) => void;
  onCancel: () => void;
}

export const CanvaFullFeaturedEditor: React.FC<CanvaFullFeaturedEditorProps> = ({
  template,
  onSave,
  onCancel
}) => {
  return (
    <CanvaStylePDFEditor
      template={template}
      onSave={onSave}
      onCancel={onCancel}
    />
  );
};
