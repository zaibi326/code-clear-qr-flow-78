import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Template } from '@/types/template';
import { useTemplateStorage } from '@/hooks/template/useTemplateStorage';
import { useTemplateActions } from '@/hooks/template/useTemplateActions';
import { TemplateManagerLayout } from '@/components/template/TemplateManagerLayout';
import { TemplateManagerContent } from '@/components/template/TemplateManagerContent';
import { LoadingScreen } from '@/components/template/LoadingScreen';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Lazy load heavy editor components to prevent crashes on initial load
const TemplateEditorWrapper = React.lazy(() => 
  import('@/components/template/TemplateEditorWrapper').then(module => ({
    default: module.TemplateEditorWrapper
  }))
);

const CanvaStylePDFWrapper = React.lazy(() => 
  import('@/components/template/pdf/CanvaStylePDFWrapper').then(module => ({
    default: module.CanvaStylePDFWrapper
  }))
);

const EnhancedPDFEditor = React.lazy(() => 
  import('@/components/template/pdf/EnhancedPDFEditor').then(module => ({
    default: module.EnhancedPDFEditor
  }))
);

const ClearQRPDFEditor = React.lazy(() => 
  import('@/components/template/pdf/ClearQRPDFEditor').then(module => ({
    default: module.ClearQRPDFEditor
  }))
);

const CanvaPDFEditor = React.lazy(() => 
  import('@/components/template/pdf/CanvaPDFEditor').then(module => ({
    default: module.CanvaPDFEditor
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
  const [editingMode, setEditingMode] = useState<'canvas' | 'pdf' | 'enhanced-pdf' | 'clearqr-pdf' | 'canva-pdf'>('canvas');

  const { templates, setTemplates, isLoaded, fileToDataUrl } = useTemplateStorage();
  
  const {
    handleTemplateUpload,
    handleTemplateSelect,
    handleTemplateDelete,
    handleTemplateDuplicate
  } = useTemplateActions({ templates, setTemplates, fileToDataUrl });

  // Helper function to determine if a template is a PDF
  const isPDFTemplate = (template: Template): boolean => {
    // Check file type first
    if (template.file?.type === 'application/pdf') {
      return true;
    }
    
    // Check preview data URL
    if (template.preview?.startsWith('data:application/pdf')) {
      return true;
    }
    
    // Check template URL for PDF extension
    if (template.template_url?.toLowerCase().includes('.pdf')) {
      return true;
    }
    
    // Check file name for PDF extension
    if (template.file?.name?.toLowerCase().endsWith('.pdf')) {
      return true;
    }
    
    // Check category
    if (template.category === 'pdf') {
      return true;
    }
    
    return false;
  };

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
        fileType: template?.file?.type,
        fileName: template?.file?.name,
        isPDF: template ? isPDFTemplate(template) : false
      });
      
      if (template) {
        setEditingTemplate(template);
        // Improved PDF detection - Use Canva PDF Editor for best experience
        if (isPDFTemplate(template)) {
          setEditingMode('canva-pdf'); // Use new Canva PDF editor
          console.log('Using Canva PDF editor for template:', template.name);
        } else {
          setEditingMode('canvas');
          console.log('Using canvas editor for template:', template.name);
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
    const isPDF = isPDFTemplate(template);
    
    console.log('Editing template:', template.name, {
      hasPreview: !!template?.preview,
      hasTemplateUrl: !!template?.template_url,
      hasThumbnailUrl: !!template?.thumbnail_url,
      previewType: template?.preview?.substring(0, 30) + '...',
      fileType: template?.file?.type,
      fileName: template?.file?.name,
      isPDF: isPDF
    });
    
    // Ensure template has valid data for editing
    if (!template.preview && !template.template_url && !template.thumbnail_url && !template.file) {
      console.error('Template has no valid data for editing');
      return;
    }
    
    setEditingTemplate(template);
    
    // Set editing mode based on improved PDF detection
    if (isPDF) {
      setEditingMode('canva-pdf'); // Use new Canva PDF editor
      console.log('Using Canva PDF editor for template:', template.name);
    } else {
      setEditingMode('canvas');
      console.log('Using canvas editor for template:', template.name);
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

  const handleTemplateUpload = async (file: File) => {
    try {
      const fileUrl = URL.createObjectURL(file);
      const newTemplate: Template = {
        id: `template-${Date.now()}`,
        name: file.name,
        template_url: fileUrl,
        preview: fileUrl,
        thumbnail_url: '',
        category: file.type === 'application/pdf' ? 'pdf' : 'image',
        tags: [file.type === 'application/pdf' ? 'pdf' : 'image'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        file
      };
      
      setTemplates(prev => [...prev, newTemplate]);
      
      toast({
        title: "Template uploaded",
        description: `${file.name} has been uploaded successfully`
      });
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload failed",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

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

  // Don't render until templates are loaded
  if (!isLoaded) {
    return <LoadingScreen />;
  }

  // Show template editor if editing - Full screen editor with lazy loading
  if (editingTemplate) {
    if (editingMode === 'canva-pdf') {
      console.log('Rendering Canva PDF editor for:', editingTemplate.name);
      return (
        <ErrorBoundary fallback={<EditorErrorFallback onBack={handleTemplateCustomizationCancel} />}>
          <Suspense fallback={<EditorLoadingFallback />}>
            <CanvaPDFEditor
              template={editingTemplate}
              onSave={handleTemplateCustomizationSave}
              onCancel={handleTemplateCustomizationCancel}
            />
          </Suspense>
        </ErrorBoundary>
      );
    } else if (editingMode === 'clearqr-pdf') {
      console.log('Rendering ClearQR PDF editor for:', editingTemplate.name);
      return (
        <ErrorBoundary fallback={<EditorErrorFallback onBack={handleTemplateCustomizationCancel} />}>
          <Suspense fallback={<EditorLoadingFallback />}>
            <ClearQRPDFEditor
              template={editingTemplate}
              onSave={handleTemplateCustomizationSave}
              onCancel={handleTemplateCustomizationCancel}
            />
          </Suspense>
        </ErrorBoundary>
      );
    } else if (editingMode === 'enhanced-pdf') {
      console.log('Rendering enhanced PDF editor for:', editingTemplate.name);
      return (
        <ErrorBoundary fallback={<EditorErrorFallback onBack={handleTemplateCustomizationCancel} />}>
          <Suspense fallback={<EditorLoadingFallback />}>
            <EnhancedPDFEditor
              template={editingTemplate}
              onSave={handleTemplateCustomizationSave}
              onCancel={handleTemplateCustomizationCancel}
            />
          </Suspense>
        </ErrorBoundary>
      );
    } else if (editingMode === 'pdf') {
      console.log('Rendering PDF editor for:', editingTemplate.name);
      return (
        <ErrorBoundary fallback={<EditorErrorFallback onBack={handleTemplateCustomizationCancel} />}>
          <Suspense fallback={<EditorLoadingFallback />}>
            <CanvaStylePDFWrapper
              template={editingTemplate}
              onSave={handleTemplateCustomizationSave}
              onCancel={handleTemplateCustomizationCancel}
            />
          </Suspense>
        </ErrorBoundary>
      );
    } else {
      console.log('Rendering canvas editor for:', editingTemplate.name);
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
