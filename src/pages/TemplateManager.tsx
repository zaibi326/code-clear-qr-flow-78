
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TemplateLibraryTab } from '@/components/template/TemplateLibraryTab';
import { TemplateUploadTab } from '@/components/template/TemplateUploadTab';
import { TemplateManageTab } from '@/components/template/TemplateManageTab';
import { Template } from '@/types/template';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, FolderOpen, Plus, TrendingUp, Download } from 'lucide-react';

const TemplateManager = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [activeTab, setActiveTab] = useState('library');

  const handleTemplateUpload = (template: Template) => {
    console.log('Template uploaded:', template);
    setTemplates(prev => [...prev, template]);
    
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

  const templateStats = [
    {
      title: 'Total Templates',
      value: templates.length.toString(),
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
      lightBg: 'bg-blue-50',
      change: '+3'
    },
    {
      title: 'Recent Uploads',
      value: '12',
      icon: Upload,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
      lightBg: 'bg-green-50',
      change: '+5'
    },
    {
      title: 'Most Used',
      value: 'Business Card',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-r from-purple-500 to-purple-600',
      lightBg: 'bg-purple-50',
      change: '89%'
    },
    {
      title: 'Downloads',
      value: '1.2k',
      icon: Download,
      color: 'text-orange-600',
      bgColor: 'bg-gradient-to-r from-orange-500 to-orange-600',
      lightBg: 'bg-orange-50',
      change: '+24%'
    }
  ];

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
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      Template Manager
                    </h1>
                    <p className="text-lg text-gray-600">Create, manage, and organize your QR code templates</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex items-center gap-2 hover:bg-gray-100">
                      <FolderOpen className="h-4 w-4" />
                      Browse Library
                    </Button>
                    <Button 
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white flex items-center gap-2"
                      onClick={() => setActiveTab('upload')}
                    >
                      <Plus className="h-4 w-4" />
                      Upload Template
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
                        <div className={`flex items-center gap-1 ${stat.change.includes('+') || stat.change.includes('%') ? 'text-green-600' : 'text-blue-600'}`}>
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm font-medium">{stat.change}</span>
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

              {/* Template Management Content */}
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-gray-200 shadow-2xl animate-fade-in">
                <div className="px-8 pt-8 pb-0">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100/50 rounded-2xl p-2">
                      <TabsTrigger 
                        value="library" 
                        className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all duration-300"
                      >
                        <FileText className="h-4 w-4" />
                        Template Library
                      </TabsTrigger>
                      <TabsTrigger 
                        value="upload" 
                        className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all duration-300"
                      >
                        <Upload className="h-4 w-4" />
                        Upload Template
                      </TabsTrigger>
                      <TabsTrigger 
                        value="manage" 
                        className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all duration-300"
                      >
                        <FolderOpen className="h-4 w-4" />
                        Manage Templates
                      </TabsTrigger>
                    </TabsList>
                    
                    <div className="pb-8">
                      <TabsContent value="library" className="mt-0">
                        <TemplateLibraryTab 
                          templates={templates} 
                          onTemplateSelect={handleTemplateSelect} 
                        />
                      </TabsContent>
                      
                      <TabsContent value="upload" className="mt-0">
                        <TemplateUploadTab onTemplateUpload={handleTemplateUpload} />
                      </TabsContent>
                      
                      <TabsContent value="manage" className="mt-0">
                        <TemplateManageTab templates={templates} />
                      </TabsContent>
                    </div>
                  </Tabs>
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
