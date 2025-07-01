
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Template } from '@/types/template';
import { useTemplateStorage } from '@/hooks/template/useTemplateStorage';
import { useTemplateActions } from '@/hooks/template/useTemplateActions';
import { TemplateManagerLayout } from '@/components/template/TemplateManagerLayout';
import { TemplateManagerContent } from '@/components/template/TemplateManagerContent';
import { TemplateEditorWrapper } from '@/components/template/TemplateEditorWrapper';
import { PDFEditorWrapper } from '@/components/template/PDFEditorWrapper';
import { LoadingScreen } from '@/components/template/LoadingScreen';

const TemplateManager = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [activeTab, setActiveTab] = useState('library');
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [editingMode, setEditingMode] = useState<'canvas' | 'pdf'>('canvas');

  const { templates, setTemplates, isLoaded, fileToDataUrl } = useTemplateStorage();
  
  const {
    handleTemplateUpload,
    handleTemplateSelect,
    handleTemplateDelete,
    handleTemplateDuplicate
  } = useTemplateActions({ templates, setTemplates, fileToDataUrl });

  // Handle URL parameters for editing state with proper browser history
  useEffect(() => {
    const editingId = searchParams.get('editing');
    console.log('URL editing parameter:', editingId);
    
    if (editingId && templates.length > 0) {
      const template = templates.find(t => t.id === editingId);
      console.log('Found template for editing:', template?.name, {
        hasPreview: !!template?.preview,
        hasTemplateUrl: !!template?.template_url,
        previewLength: template?.preview?.length || 0,
        fileType: template?.file?.type
      });
      
      if (template) {
        setEditingTemplate(template);
        // Set editing mode based on file type
        if (template.file?.type === 'application/pdf') {
          setEditingMode('pdf');
        } else {
          setEditingMode('canvas');
        }
      } else {
        console.warn('Template not found for ID:', editingId);
        // Clear invalid editing state
        setSearchParams({});
        setEditingTemplate(null);
      }
    } else if (!editingId && editingTemplate) {
      // URL was changed to remove editing parameter
      console.log('Clearing editing state due to URL change');
      setEditingTemplate(null);
    }
  }, [searchParams, templates, editingTemplate, setSearchParams]);

  // Handle browser navigation events
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      console.log('Browser back/forward navigation detected');
      const currentUrl = new URL(window.location.href);
      const editingId = currentUrl.searchParams.get('editing');
      
      if (!editingId && editingTemplate) {
        console.log('Back navigation detected, clearing editing state');
        setEditingTemplate(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [editingTemplate]);

  const handleTemplateEdit = (template: Template) => {
    console.log('Editing template:', template.name, {
      hasPreview: !!template?.preview,
      hasTemplateUrl: !!template?.template_url,
      hasThumbnailUrl: !!template?.thumbnail_url,
      previewType: template?.preview?.substring(0, 30) + '...',
      fileType: template?.file?.type
    });
    
    // Ensure template has valid image data for editing
    if (!template.preview && !template.template_url && !template.thumbnail_url && !template.file) {
      console.error('Template has no valid image data for editing');
      return;
    }
    
    setEditingTemplate(template);
    
    // Set editing mode based on file type
    if (template.file?.type === 'application/pdf') {
      setEditingMode('pdf');
    } else {
      setEditingMode('canvas');
    }
    
    // Update URL with proper history entry
    const newSearchParams = new URLSearchParams();
    newSearchParams.set('editing', template.id);
    
    // Use navigate with replace: false to create a proper history entry
    navigate(`/template-manager?${newSearchParams.toString()}`, { replace: false });
  };

  const handleTemplateCustomizationSave = (customizedTemplate: Template) => {
    console.log('Saving customized template');
    setTemplates(prev => {
      const updatedTemplates = prev.map(t => t.id === customizedTemplate.id ? customizedTemplate : t);
      return updatedTemplates;
    });
    
    // Clear editing state and navigate back
    handleTemplateCustomizationCancel();
  };

  const handleTemplateCustomizationCancel = () => {
    console.log('Canceling template customization');
    setEditingTemplate(null);
    setEditingMode('canvas');
    
    // Navigate back to template manager without editing parameter
    navigate('/template-manager', { replace: false });
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
    if (editingMode === 'pdf') {
      return (
        <PDFEditorWrapper
          template={editingTemplate}
          onSave={handleTemplateCustomizationSave}
          onCancel={handleTemplateCustomizationCancel}
        />
      );
    } else {
      return (
        <TemplateEditorWrapper
          template={editingTemplate}
          onSave={handleTemplateCustomizationSave}
          onCancel={handleTemplateCustomizationCancel}
        />
      );
    }
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
