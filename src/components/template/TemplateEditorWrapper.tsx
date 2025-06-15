
import React from 'react';
import { Template } from '@/types/template';
import { TemplateEditor } from './TemplateEditor';
import { toast } from '@/hooks/use-toast';

interface TemplateEditorWrapperProps {
  template: Template;
  onSave: (template: Template) => void;
  onCancel: () => void;
}

export const TemplateEditorWrapper = ({ template, onSave, onCancel }: TemplateEditorWrapperProps) => {
  const handleTemplateEdit = (template: Template) => {
    console.log('Editing template:', template);
    
    // Ensure template has preview data for editing
    if (!template.preview && (!template.template_url || !template.thumbnail_url)) {
      toast({
        title: "Cannot edit template",
        description: "Template data is missing. Please re-upload the template.",
        variant: "destructive"
      });
      return;
    }
  };

  const handleTemplateCustomizationSave = (customizedTemplate: Template) => {
    onSave(customizedTemplate);
    toast({
      title: "Template customization saved",
      description: `${customizedTemplate.name} has been updated with your changes`,
    });
  };

  // Initialize edit check
  React.useEffect(() => {
    handleTemplateEdit(template);
  }, [template]);

  return (
    <TemplateEditor
      template={template}
      onSave={handleTemplateCustomizationSave}
      onCancel={onCancel}
    />
  );
};
