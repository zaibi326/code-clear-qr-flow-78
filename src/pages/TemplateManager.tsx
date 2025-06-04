import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { TemplateManagerTabs } from '@/components/template/TemplateManagerTabs';
import { TemplateLibraryTab } from '@/components/template/TemplateLibraryTab';
import { TemplateManageTab } from '@/components/template/TemplateManageTab';
import { TemplateUploadTab } from '@/components/template/TemplateUploadTab';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layout, FileText, Upload, Palette, Plus, Download, Eye } from 'lucide-react';
import { Template } from '@/types/template';

const TemplateManager = () => {
  const [activeTab, setActiveTab] = useState('library');
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: '1',
      name: 'Modern Business Card',
      type: 'business',
      category: 'Professional',
      description: 'Clean and modern business card template',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      isPublic: true,
      tags: ['business', 'modern', 'professional'],
      preview: '/placeholder.svg'
    },
    {
      id: '2',
      name: 'Restaurant Menu',
      type: 'menu',
      category: 'Food & Beverage',
      description: 'Elegant restaurant menu template',
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-12'),
      isPublic: true,
      tags: ['restaurant', 'menu', 'food'],
      preview: '/placeholder.svg'
    },
    {
      id: '3',
      name: 'Event Registration',
      type: 'event',
      category: 'Events',
      description: 'Professional event registration template',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10'),
      isPublic: false,
      tags: ['event', 'registration', 'form'],
      preview: '/placeholder.svg'
    }
  ]);

  const templateStats = [
    {
      title: 'Total Templates',
      value: '45',
      icon: Layout,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
      lightBg: 'bg-blue-50',
      change: '+12%'
    },
    {
      title: 'Custom Templates',
      value: '12',
      icon: Palette,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-r from-purple-500 to-purple-600',
      lightBg: 'bg-purple-50',
      change: '+8%'
    },
    {
      title: 'Shared Templates',
      value: '33',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
      lightBg: 'bg-green-50',
      change: '+24%'
    },
    {
      title: 'Recent Uploads',
      value: '8',
      icon: Upload,
      color: 'text-orange-600',
      bgColor: 'bg-gradient-to-r from-orange-500 to-orange-600',
      lightBg: 'bg-orange-50',
      change: '+5%'
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
      <div className="min-h-screen flex w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0 ml-[240px]">
          <DashboardTopbar />
          
          <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
              {/* Header Section */}
              <div className="mb-8 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                      Template Manager
                    </h1>
                    <p className="text-lg text-gray-600">Create, manage, and organize your QR code templates</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex items-center gap-2 hover:bg-gray-100">
                      <Download className="h-4 w-4" />
                      Export All
                    </Button>
                    <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Create Template
                    </Button>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
                {templateStats.map((stat, index) => (
                  <Card key={index} className="group border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl hover:scale-105 transition-all duration-500">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-4 rounded-2xl ${stat.bgColor} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                          <stat.icon className="h-6 w-6" />
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium text-green-600">{stat.change}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Template Management */}
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-gray-200 shadow-2xl animate-fade-in">
                <div className="px-8 pt-8 pb-0">
                  <TemplateManagerTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
                <div className="p-8">
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
