
import React, { useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
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

  const mockTemplates = templates.map(template => ({
    id: parseInt(template.id.split('-')[1]) || 1,
    name: template.name,
    type: template.file?.type === 'application/pdf' ? 'pdf' : 'image',
    uploadDate: template.createdAt.toLocaleDateString(),
    status: 'active',
    usageCount: Math.floor(Math.random() * 50)
  }));

  return (
    <div className="min-h-screen bg-gray-50/50">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset>
            <DashboardTopbar />
            <main className="flex-1 p-6 space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Template Manager</h1>
                <p className="text-gray-600">Upload, manage, and organize your marketing templates</p>
              </div>

              <TemplateManagerTabs activeTab={activeTab} setActiveTab={setActiveTab} />

              {activeTab === 'upload' && (
                <TemplateUploadTab onTemplateUpload={handleTemplateUpload} />
              )}
              {activeTab === 'manage' && (
                <TemplateManageTab 
                  mockTemplates={mockTemplates}
                  templates={templates}
                  onTemplateEdit={handleTemplateEdit}
                  onTemplateDelete={handleTemplateDelete}
                  onTemplateDuplicate={handleTemplateDuplicate}
                />
              )}
              {activeTab === 'library' && (
                <TemplateLibraryTab 
                  templates={templates}
                  onTemplateSelect={handleTemplateEdit}
                />
              )}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default TemplateManager;
