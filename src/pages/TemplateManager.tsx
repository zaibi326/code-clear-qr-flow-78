
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { TemplateManagerTabs } from '@/components/template/TemplateManagerTabs';
import { TemplateLibraryTab } from '@/components/template/TemplateLibraryTab';
import { TemplateManageTab } from '@/components/template/TemplateManageTab';
import { TemplateUploadTab } from '@/components/template/TemplateUploadTab';
import { Card, CardContent } from '@/components/ui/card';
import { Layout, FileText, Upload, Palette } from 'lucide-react';
import { Template } from '@/types/template';

const TemplateManager = () => {
  const [activeTab, setActiveTab] = useState('library');
  const [templates, setTemplates] = useState<Template[]>([]);

  const templateStats = [
    {
      title: 'Total Templates',
      value: '45',
      icon: Layout,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Custom Templates',
      value: '12',
      icon: Palette,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Shared Templates',
      value: '33',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Recent Uploads',
      value: '8',
      icon: Upload,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const handleTemplateSelect = (template: Template) => {
    console.log('Template selected:', template);
  };

  const handleTemplateUpload = (template: Template) => {
    setTemplates(prev => [template, ...prev]);
  };

  const handleTemplateEdit = (template: Template) => {
    console.log('Edit template:', template);
  };

  const handleTemplateDelete = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  const handleTemplateDuplicate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      const duplicated: Template = {
        ...template,
        id: `${template.id}-copy-${Date.now()}`,
        name: `${template.name} (Copy)`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setTemplates(prev => [duplicated, ...prev]);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0 ml-[240px]">
          <DashboardTopbar />
          
          <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
              {/* Header Section */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  Template Manager
                </h1>
                <p className="text-gray-600">Create, manage, and organize your QR code templates</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {templateStats.map((stat, index) => (
                  <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                          <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Template Management */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg">
                <div className="px-6 pt-6 pb-0">
                  <TemplateManagerTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
                <div className="p-6">
                  {activeTab === 'library' && (
                    <TemplateLibraryTab 
                      templates={templates}
                      onTemplateSelect={handleTemplateSelect}
                    />
                  )}
                  {activeTab === 'manage' && (
                    <TemplateManageTab 
                      templates={templates}
                      onTemplateEdit={handleTemplateEdit}
                      onTemplateDelete={handleTemplateDelete}
                      onTemplateDuplicate={handleTemplateDuplicate}
                    />
                  )}
                  {activeTab === 'upload' && (
                    <TemplateUploadTab onTemplateUpload={handleTemplateUpload} />
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TemplateManager;
