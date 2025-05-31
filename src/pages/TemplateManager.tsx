
import React, { useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { TemplateManagerTabs } from '@/components/template/TemplateManagerTabs';
import { TemplateUploadTab } from '@/components/template/TemplateUploadTab';
import { TemplateManageTab } from '@/components/template/TemplateManageTab';
import { TemplateLibraryTab } from '@/components/template/TemplateLibraryTab';
import { Template } from '@/types/template';
import { useToast } from '@/hooks/use-toast';

const TemplateManager = () => {
  const [activeTab, setActiveTab] = useState('manage');
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: 'template-1',
      name: 'Marketing Flyer Template',
      file: null,
      preview: '/placeholder.svg',
      qrPosition: { x: 100, y: 200, width: 80, height: 80 },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: 'template-2',
      name: 'Business Card Template',
      file: null,
      preview: '/placeholder.svg',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10')
    },
    {
      id: 'template-3',
      name: 'Event Poster Template',
      file: null,
      preview: '/placeholder.svg',
      qrPosition: { x: 150, y: 300, width: 100, height: 100 },
      createdAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-08')
    }
  ]);
  const { toast } = useToast();

  const handleTemplateUpload = (newTemplate: Template) => {
    setTemplates(prev => [newTemplate, ...prev]);
    setActiveTab('manage');
    toast({
      title: "Template uploaded",
      description: `${newTemplate.name} has been successfully uploaded.`,
    });
  };

  const handleTemplateEdit = (template: Template) => {
    console.log('Editing template:', template.name);
    toast({
      title: "Template selected",
      description: `Selected ${template.name} for editing.`,
    });
  };

  const handleTemplateDelete = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    toast({
      title: "Template deleted",
      description: `${template?.name || 'Template'} has been deleted.`,
      variant: "destructive",
    });
  };

  const handleTemplateDuplicate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      const duplicatedTemplate: Template = {
        ...template,
        id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: `${template.name} (Copy)`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setTemplates(prev => [duplicatedTemplate, ...prev]);
      toast({
        title: "Template duplicated",
        description: `${duplicatedTemplate.name} has been created.`,
      });
    }
  };

  const handleTemplateUse = (template: Template) => {
    console.log('Using template:', template.name);
    toast({
      title: "Template ready",
      description: `${template.name} is ready to use in campaigns.`,
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col min-w-0 ml-0">
          <DashboardTopbar />
          
          {/* Header Section */}
          <div className="bg-white border-b border-gray-200 px-6 lg:px-8 py-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Template Manager</h1>
                  <p className="text-sm text-gray-600 mt-2">Upload, manage, and organize your marketing templates</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="px-6 pt-6 pb-0">
                  <TemplateManagerTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>

                <div className="p-6">
                  {activeTab === 'upload' && (
                    <TemplateUploadTab onTemplateUpload={handleTemplateUpload} />
                  )}
                  {activeTab === 'manage' && (
                    <TemplateManageTab 
                      templates={templates}
                      onTemplateEdit={handleTemplateEdit}
                      onTemplateDelete={handleTemplateDelete}
                      onTemplateDuplicate={handleTemplateDuplicate}
                    />
                  )}
                  {activeTab === 'library' && (
                    <TemplateLibraryTab 
                      templates={templates}
                      onTemplateSelect={handleTemplateUse}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default TemplateManager;
