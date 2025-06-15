
import React, { useState } from 'react';
import { Template } from '@/types/template';
import { useTemplateStorage } from '@/hooks/template/useTemplateStorage';
import { useTemplateActions } from '@/hooks/template/useTemplateActions';
import { TemplateManagerLayout } from '@/components/template/TemplateManagerLayout';
import { TemplateManagerContent } from '@/components/template/TemplateManagerContent';
import { TemplateEditorWrapper } from '@/components/template/TemplateEditorWrapper';
import { LoadingScreen } from '@/components/template/LoadingScreen';

const TemplateManager = () => {
  const [activeTab, setActiveTab] = useState('library');
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  const { templates, setTemplates, isLoaded, fileToDataUrl } = useTemplateStorage();
  
  const {
    handleTemplateUpload,
    handleTemplateSelect,
    handleTemplateDelete,
    handleTemplateDuplicate
  } = useTemplateActions({ templates, setTemplates, fileToDataUrl });

  const handleTemplateEdit = (template: Template) => {
    console.log('Editing template:', template);
    setEditingTemplate(template);
  };

  const handleTemplateCustomizationSave = (customizedTemplate: Template) => {
    setTemplates(prev => {
      const updatedTemplates = prev.map(t => t.id === customizedTemplate.id ? customizedTemplate : t);
      return updatedTemplates;
    });
    setEditingTemplate(null);
  };

  const handleTemplateCustomizationCancel = () => {
    setEditingTemplate(null);
  };

  const handleUploadNew = () => {
    setActiveTab('upload');
  };

  // Don't render until templates are loaded
  if (!isLoaded) {
    return <LoadingScreen />;
  }

  // Show template editor if editing - Full screen editor
  if (editingTemplate) {
    return (
      <TemplateEditorWrapper
        template={editingTemplate}
        onSave={handleTemplateCustomizationSave}
        onCancel={handleTemplateCustomizationCancel}
      />
    );
  }

  return (
    <TemplateManagerLayout>
      <TemplateManagerContent
        templates={templates}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onTemplateSelect={handleTemplateSelect}
        onTemplateUpload={handleTemplateUpload}
        onTemplateEdit={handleTemplateEdit}
        onTemplateDelete={handleTemplateDelete}
        onTemplateDuplicate={handleTemplateDuplicate}
        onUploadNew={handleUploadNew}
      />
    </TemplateManagerLayout>
  );
};

export default TemplateManager;
