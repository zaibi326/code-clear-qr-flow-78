import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { TemplateManagerHeader } from "@/components/template/TemplateManagerHeader";
import { TemplateManagerTabsContent } from "@/components/template/TemplateManagerTabsContent";
import { TemplateEditor } from "@/components/template/TemplateEditor";
import { Template } from '@/types/template';
import { toast } from '@/hooks/use-toast';

const TEMPLATES_STORAGE_KEY = 'qr-templates';

const TemplateManager = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [activeTab, setActiveTab] = useState('library');
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Convert File to data URL for storage
  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Load templates from localStorage on component mount
  useEffect(() => {
    console.log('Loading templates from localStorage...');
    const savedTemplates = localStorage.getItem(TEMPLATES_STORAGE_KEY);
    if (savedTemplates) {
      try {
        const parsedTemplates = JSON.parse(savedTemplates);
        // Convert date strings back to Date objects and ensure proper data structure
        const templatesWithDates = parsedTemplates.map((template: any) => ({
          ...template,
          createdAt: new Date(template.createdAt),
          updatedAt: new Date(template.updatedAt),
          // Ensure preview exists for editing
          preview: template.preview || template.template_url || template.thumbnail_url
        }));
        console.log('Loaded templates:', templatesWithDates);
        setTemplates(templatesWithDates);
      } catch (error) {
        console.error('Error loading templates from localStorage:', error);
        setTemplates([]);
      }
    } else {
      console.log('No saved templates found');
    }
    setIsLoaded(true);
  }, []);

  // Save templates to localStorage whenever templates state changes (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      console.log('Saving templates to localStorage:', templates);
      // Convert templates for storage (remove File objects)
      const templatesForStorage = templates.map(template => {
        const { file, ...templateWithoutFile } = template;
        return templateWithoutFile;
      });
      localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templatesForStorage));
    }
  }, [templates, isLoaded]);

  const handleTemplateUpload = async (template: Template) => {
    console.log('Template uploaded:', template);
    
    try {
      let processedTemplate = { ...template };
      
      // If template has a file, convert it to data URL for preview and storage
      if (template.file) {
        console.log('Converting file to data URL for template:', template.name);
        const dataUrl = await fileToDataUrl(template.file);
        
        // Set preview to data URL for editing capability
        processedTemplate.preview = dataUrl;
        processedTemplate.template_url = dataUrl;
        
        // Store file metadata but remove actual File object for localStorage
        processedTemplate.fileSize = template.file.size;
        processedTemplate.type = template.file.type;
        
        console.log('Template processed with data URL');
      }
      
      setTemplates(prev => {
        const newTemplates = [...prev, processedTemplate];
        console.log('New templates array:', newTemplates);
        return newTemplates;
      });
      
      toast({
        title: "Template uploaded successfully!",
        description: `${template.name} has been added to your library and is ready for editing.`,
      });
    } catch (error) {
      console.error('Error processing template upload:', error);
      toast({
        title: "Upload error",
        description: "There was an error processing your template file.",
        variant: "destructive"
      });
    }
  };

  const handleTemplateSelect = (template: Template) => {
    console.log('Template selected:', template);
    
    toast({
      title: "Template selected!",
      description: `You can now use ${template.name} for your QR campaigns.`,
    });
  };

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
    
    setEditingTemplate(template);
  };

  const handleTemplateCustomizationSave = (customizedTemplate: Template) => {
    setTemplates(prev => {
      const updatedTemplates = prev.map(t => t.id === customizedTemplate.id ? customizedTemplate : t);
      return updatedTemplates;
    });
    setEditingTemplate(null);
    toast({
      title: "Template customization saved",
      description: `${customizedTemplate.name} has been updated with your changes`,
    });
  };

  const handleTemplateCustomizationCancel = () => {
    setEditingTemplate(null);
  };

  const handleTemplateDelete = (templateId: string) => {
    setTemplates(prev => prev.filter(template => template.id !== templateId));
    toast({
      title: "Template deleted",
      description: "Template has been removed from your library",
    });
  };

  const handleTemplateDuplicate = (templateId: string) => {
    const templateToDuplicate = templates.find(t => t.id === templateId);
    if (templateToDuplicate) {
      const duplicatedTemplate: Template = {
        ...templateToDuplicate,
        id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: `${templateToDuplicate.name} (Copy)`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setTemplates(prev => [...prev, duplicatedTemplate]);
      toast({
        title: "Template duplicated",
        description: `Created a copy of ${templateToDuplicate.name}`,
      });
    }
  };

  const handleUploadNew = () => {
    setActiveTab('upload');
  };

  const handleTabChange = (newTab: string) => {
    console.log('Changing tab from', activeTab, 'to', newTab);
    console.log('Current templates count:', templates.length);
    setActiveTab(newTab);
  };

  // Don't render until templates are loaded
  if (!isLoaded) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0 ml-[240px]">
            <DashboardTopbar />
            <main className="flex-1 overflow-auto flex items-center justify-center">
              <div className="text-lg">Loading templates...</div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  // Show template editor if editing - Full screen editor
  if (editingTemplate) {
    return (
      <TemplateEditor
        template={editingTemplate}
        onSave={handleTemplateCustomizationSave}
        onCancel={handleTemplateCustomizationCancel}
      />
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0 ml-[240px]">
          <DashboardTopbar />
          <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <TemplateManagerHeader onUploadClick={handleUploadNew} />
              <TemplateManagerTabsContent
                activeTab={activeTab}
                setActiveTab={handleTabChange}
                templates={templates}
                onTemplateSelect={handleTemplateSelect}
                onTemplateUpload={handleTemplateUpload}
                onTemplateEdit={handleTemplateEdit}
                onTemplateDelete={handleTemplateDelete}
                onTemplateDuplicate={handleTemplateDuplicate}
                onUploadNew={handleUploadNew}
              />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TemplateManager;
