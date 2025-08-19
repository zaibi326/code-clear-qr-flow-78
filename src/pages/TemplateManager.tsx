import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Template } from '@/types/template';
import { useTemplateStorage } from '@/hooks/template/useTemplateStorage';
import { useTemplateActions } from '@/hooks/template/useTemplateActions';
import { TemplateManagerLayout } from '@/components/template/TemplateManagerLayout';
import { TemplateManagerContent } from '@/components/template/TemplateManagerContent';
import { LoadingScreen } from '@/components/template/LoadingScreen';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { toast } from '@/hooks/use-toast';

// Lazy load editor components
const TemplateEditorWrapper = React.lazy(() => 
  import('@/components/template/TemplateEditorWrapper').then(module => ({
    default: module.TemplateEditorWrapper
  }))
);

const CanvaStylePDFEditor = React.lazy(() => 
  import('@/components/template/pdf/CanvaStylePDFEditor').then(module => ({
    default: module.CanvaStylePDFEditor
  }))
);

// Loading fallback for editor components
const EditorLoadingFallback = () => (
  <div className="h-screen w-full flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading editor...</p>
    </div>
  </div>
);

// Error fallback for editor components
const EditorErrorFallback = ({ onBack }: { onBack: () => void }) => (
  <div className="h-screen w-full flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Editor Failed to Load</h2>
      <p className="text-gray-600 mb-6">There was an error loading the template editor.</p>
      <button
        onClick={onBack}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Back to Template Manager
      </button>
    </div>
  </div>
);

const TemplateManager = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [activeTab, setActiveTab] = useState('library');
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [editingMode, setEditingMode] = useState<'canvas' | 'pdf'>('canvas');

  const { templates, setTemplates, isLoaded, fileToDataUrl } = useTemplateStorage();
  
  const {
    handleTemplateSelect,
    handleTemplateDelete
  } = useTemplateActions({ templates, setTemplates, fileToDataUrl });

  // Helper function to determine if a template is a PDF
  const isPDFTemplate = (template: Template): boolean => {
    if (template.file?.type === 'application/pdf') return true;
    if (template.type === 'application/pdf') return true;
    if (template.file_type === 'application/pdf') return true;
    if (template.preview?.startsWith('data:application/pdf')) return true;
    if (template.template_url?.startsWith('data:application/pdf')) return true;
    if (template.template_url?.toLowerCase().includes('.pdf')) return true;
    if (template.file?.name?.toLowerCase().endsWith('.pdf')) return true;
    if (template.category === 'pdf') return true;
    if (template.isPdf) return true;
    return false;
  };

  // Helper function to check if template has valid data for editing
  const canEditTemplate = (template: Template): boolean => {
    if (!isPDFTemplate(template)) return true; // Non-PDF templates can always be edited
    
    // For PDF templates, check if they have valid data
    return !!(
      (template.file && template.file instanceof File) ||
      (template.preview && (
        template.preview.startsWith('data:application/pdf') ||
        template.preview.startsWith('blob:')
      )) ||
      (template.template_url && (
        template.template_url.startsWith('data:application/pdf') ||
        template.template_url.startsWith('blob:') ||
        template.template_url.toLowerCase().includes('.pdf')
      ))
    );
  };

  // Handle URL parameters for editing state
  useEffect(() => {
    const editingId = searchParams.get('editing');
    
    if (editingId && templates.length > 0) {
      const template = templates.find(t => t.id === editingId);
      
      if (template) {
        setEditingTemplate(template);
        setEditingMode(isPDFTemplate(template) ? 'pdf' : 'canvas');
      } else {
        setSearchParams({});
        setEditingTemplate(null);
      }
    } else if (!editingId && editingTemplate) {
      setEditingTemplate(null);
    }
  }, [searchParams, templates, editingTemplate, setSearchParams]);

  // Handle browser navigation events
  useEffect(() => {
    const handlePopState = () => {
      const currentUrl = new URL(window.location.href);
      const editingId = currentUrl.searchParams.get('editing');
      
      if (!editingId && editingTemplate) {
        setEditingTemplate(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [editingTemplate]);

  const handleTemplateEdit = (template: Template) => {
    console.log('Attempting to edit template:', {
      name: template.name,
      isPDF: isPDFTemplate(template),
      canEdit: canEditTemplate(template),
      hasFile: !!template.file,
      hasPreview: !!template.preview,
      hasTemplateUrl: !!template.template_url,
      previewType: template.preview?.substring(0, 30),
      templateUrlType: template.template_url?.substring(0, 30)
    });
    
    // Check if template can be edited
    if (!canEditTemplate(template)) {
      toast({
        title: "Cannot Edit Template",
        description: "This template is missing required data. Please re-upload the file.",
        variant: "destructive"
      });
      return;
    }
    
    const isPDF = isPDFTemplate(template);
    
    setEditingTemplate(template);
    setEditingMode(isPDF ? 'pdf' : 'canvas');
    
    const newSearchParams = new URLSearchParams();
    newSearchParams.set('editing', template.id);
    navigate(`/template-manager?${newSearchParams.toString()}`, { replace: false });

    if (isPDF) {
      toast({
        title: "Opening PDF Editor",
        description: "Loading Canva-style PDF editor with inline text editing...",
      });
    }
  };

  const handleTemplateCustomizationSave = (customizedTemplate: Template) => {
    console.log('Saving customized template:', customizedTemplate.name);
    
    setTemplates(prev => {
      const updatedTemplates = prev.map(t => 
        t.id === customizedTemplate.id ? {
          ...customizedTemplate,
          updated_at: new Date().toISOString()
        } : t
      );
      return updatedTemplates;
    });
    
    toast({
      title: "Template saved successfully",
      description: `${customizedTemplate.name} has been updated with your changes.`,
    });
    
    handleTemplateCustomizationCancel();
  };

  const handleTemplateCustomizationCancel = () => {
    setEditingTemplate(null);
    setEditingMode('canvas');
    navigate('/template-manager', { replace: false });
  };

  const handleUploadNew = () => {
    setActiveTab('upload');
  };

  // Template upload handler with better PDF validation
  const handleTemplateUpload = async (file: File) => {
    try {
      console.log('Processing template upload:', {
        name: file.name,
        type: file.type,
        size: file.size,
        isPDF: file.type === 'application/pdf'
      });

      // Validate file size (limit to 50MB for better performance)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 50MB",
          variant: "destructive"
        });
        return;
      }

      // Validate file type for PDFs
      if (file.type === 'application/pdf') {
        // Quick validation to ensure it's a valid PDF
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const header = String.fromCharCode(...uint8Array.slice(0, 5));
        
        if (!header.startsWith('%PDF-')) {
          toast({
            title: "Invalid PDF file",
            description: "The selected file is not a valid PDF",
            variant: "destructive"
          });
          return;
        }
      }
      
      // Convert file to data URL for persistent storage
      const dataUrl = await fileToDataUrl(file);
      
      const newTemplate: Template = {
        id: `template-${Date.now()}`,
        name: file.name,
        template_url: dataUrl,
        preview: dataUrl,
        thumbnail_url: dataUrl,
        category: file.type === 'application/pdf' ? 'pdf' : 'image',
        type: file.type,
        file_type: file.type,
        tags: [file.type === 'application/pdf' ? 'pdf' : 'image'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        fileSize: file.size,
        isPdf: file.type === 'application/pdf',
        file // Keep the original file object for immediate editing
      };
      
      setTemplates(prev => [...prev, newTemplate]);
      
      toast({
        title: "Template uploaded successfully",
        description: `${file.name} is ready for ${file.type === 'application/pdf' ? 'Canva-style PDF' : ''} editing`
      });
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload failed",
        description: "Please check the file and try again",
        variant: "destructive"
      });
    }
  };

  // Template duplicate handler
  const handleTemplateDuplicate = (template: Template) => {
    const duplicatedTemplate: Template = {
      ...template,
      id: `template-${Date.now()}-copy`,
      name: `${template.name} (Copy)`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setTemplates(prev => [...prev, duplicatedTemplate]);
    
    toast({
      title: "Template duplicated",
      description: `${template.name} has been duplicated successfully`
    });
  };

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  // Show template editor if editing
  if (editingTemplate) {
    if (editingMode === 'pdf') {
      return (
        <ErrorBoundary fallback={<EditorErrorFallback onBack={handleTemplateCustomizationCancel} />}>
          <Suspense fallback={<EditorLoadingFallback />}>
            <CanvaStylePDFEditor
              template={editingTemplate}
              onSave={handleTemplateCustomizationSave}
              onCancel={handleTemplateCustomizationCancel}
            />
          </Suspense>
        </ErrorBoundary>
      );
    } else {
      return (
        <ErrorBoundary fallback={<EditorErrorFallback onBack={handleTemplateCustomizationCancel} />}>
          <Suspense fallback={<EditorLoadingFallback />}>
            <TemplateEditorWrapper
              template={editingTemplate}
              onSave={handleTemplateCustomizationSave}
              onCancel={handleTemplateCustomizationCancel}
            />
          </Suspense>
        </ErrorBoundary>
      );
    }
  }

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
};

export default TemplateManager;
