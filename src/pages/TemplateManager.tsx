
import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { TemplateCustomizer } from '@/components/template/TemplateCustomizer';
import { TemplateManagerHeader } from '@/components/template/TemplateManagerHeader';
import { TemplateManagerStats } from '@/components/template/TemplateManagerStats';
import { TemplateManagerTabsContent } from '@/components/template/TemplateManagerTabsContent';
import { Template } from '@/types/template';
import { toast } from '@/hooks/use-toast';

const TEMPLATES_STORAGE_KEY = 'qr-templates';

const TemplateManager = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [activeTab, setActiveTab] = useState('library');
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  // Load templates from localStorage on component mount
  useEffect(() => {
    console.log('Loading templates from localStorage...');
    const savedTemplates = localStorage.getItem(TEMPLATES_STORAGE_KEY);
    if (savedTemplates) {
      try {
        const parsedTemplates = JSON.parse(savedTemplates);
        console.log('Loaded templates:', parsedTemplates);
        setTemplates(parsedTemplates);
      } catch (error) {
        console.error('Error loading templates from localStorage:', error);
        setTemplates([]);
      }
    } else {
      console.log('No saved templates found');
    }
  }, []);

  // Save templates to localStorage whenever templates state changes
  useEffect(() => {
    console.log('Saving templates to localStorage:', templates);
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
  }, [templates]);

  const handleTemplateUpload = (template: Template) => {
    console.log('Template uploaded:', template);
    setTemplates(prev => {
      const newTemplates = [...prev, template];
      console.log('New templates array:', newTemplates);
      return newTemplates;
    });
    
    toast({
      title: "Template uploaded successfully!",
      description: `${template.name} has been added to your library.`,
    });
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
    setEditingTemplate(template);
  };

  const handleTemplateCustomizationSave = (customizedTemplate: Template) => {
    setTemplates(prev => prev.map(t => t.id === customizedTemplate.id ? customizedTemplate : t));
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

  // If editing a template, show the customizer
  if (editingTemplate) {
    return (
      <TemplateCustomizer
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
              <TemplateManagerHeader onUploadClick={() => setActiveTab('upload')} />
              
              <TemplateManagerStats templateCount={templates.length} />

              <TemplateManagerTabsContent
                activeTab={activeTab}
                setActiveTab={setActiveTab}
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
