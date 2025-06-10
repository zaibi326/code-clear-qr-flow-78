
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TemplateLibraryTab } from './TemplateLibraryTab';
import { TemplateUploadTab } from './TemplateUploadTab';
import { TemplateManageTab } from './TemplateManageTab';
import { Template } from '@/types/template';
import { FileText, Upload, Edit } from 'lucide-react';

interface TemplateManagerTabsContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  templates: Template[];
  onTemplateSelect: (template: Template) => void;
  onTemplateUpload: (template: Template) => void;
  onTemplateEdit: (template: Template) => void;
  onTemplateDelete: (templateId: string) => void;
  onTemplateDuplicate: (templateId: string) => void;
  onUploadNew: () => void;
}

export const TemplateManagerTabsContent = ({
  activeTab,
  setActiveTab,
  templates,
  onTemplateSelect,
  onTemplateUpload,
  onTemplateEdit,
  onTemplateDelete,
  onTemplateDuplicate,
  onUploadNew
}: TemplateManagerTabsContentProps) => {
  return (
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
              <Edit className="h-4 w-4" />
              Customize & Manage
            </TabsTrigger>
          </TabsList>
          
          <div className="pb-8">
            <TabsContent value="library" className="mt-0">
              <TemplateLibraryTab 
                templates={templates} 
                onTemplateSelect={onTemplateSelect} 
              />
            </TabsContent>
            
            <TabsContent value="upload" className="mt-0">
              <TemplateUploadTab onTemplateUpload={onTemplateUpload} />
            </TabsContent>
            
            <TabsContent value="manage" className="mt-0">
              <TemplateManageTab 
                templates={templates}
                onTemplateEdit={onTemplateEdit}
                onTemplateDelete={onTemplateDelete}
                onTemplateDuplicate={onTemplateDuplicate}
                onUploadNew={onUploadNew}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
