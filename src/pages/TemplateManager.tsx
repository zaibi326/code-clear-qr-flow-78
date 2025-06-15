
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Template } from '@/types/template';
import { useTemplateStorage } from '@/hooks/template/useTemplateStorage';
import { useTemplateActions } from '@/hooks/template/useTemplateActions';
import { TemplateManagerLayout } from '@/components/template/TemplateManagerLayout';
import { TemplateManagerContent } from '@/components/template/TemplateManagerContent';
import { TemplateEditorWrapper } from '@/components/template/TemplateEditorWrapper';
import { LoadingScreen } from '@/components/template/LoadingScreen';

const TemplateManager = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [activeTab, setActiveTab] = useState('library');
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  const { templates, setTemplates, isLoaded, fileToDataUrl } = useTemplateStorage();
  
  const {
    handleTemplateUpload,
    handleTemplateSelect,
    handleTemplateDelete,
    handleTemplateDuplicate
  } = useTemplateActions({ templates, setTemplates, fileToDataUrl });

  // Handle URL parameters for editing state
  useEffect(() => {
    const editingId = searchParams.get('editing');
    if (editingId && templates.length > 0) {
      const template = templates.find(t => t.id === editingId);
      if (template) {
        setEditingTemplate(template);
      }
    } else if (!editingId) {
      setEditingTemplate(null);
    }
  }, [searchParams, templates]);

  const handleTemplateEdit = (template: Template) => {
    console.log('Editing template:', template);
    setEditingTemplate(template);
    // Update URL to include editing state
    setSearchParams({ editing: template.id });
  };

  const handleTemplateCustomizationSave = (customizedTemplate: Template) => {
    setTemplates(prev => {
      const updatedTemplates = prev.map(t => t.id === customizedTemplate.id ? customizedTemplate : t);
      return updatedTemplates;
    });
    // Clear editing state and URL params
    setEditingTemplate(null);
    setSearchParams({});
  };

  const handleTemplateCustomizationCancel = () => {
    setEditingTemplate(null);
    // Clear URL params to enable back button
    setSearchParams({});
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
