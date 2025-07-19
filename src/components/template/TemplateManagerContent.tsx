
import React from 'react';
import { Template } from '@/types/template';
import { TemplateLibrary } from './TemplateLibrary';
import { TemplateUploader } from './TemplateUploader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileText } from 'lucide-react';

interface TemplateManagerContentProps {
  templates: Template[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onTemplateSelect: (template: Template) => void;
  onTemplateUpload: (file: File) => void;
  onTemplateEdit: (template: Template) => void;
  onTemplateDelete: (templateId: string) => void;
  onTemplateDuplicate: (template: Template) => void;
  onUploadNew: () => void;
}

export const TemplateManagerContent: React.FC<TemplateManagerContentProps> = ({
  templates,
  activeTab,
  setActiveTab,
  onTemplateSelect,
  onTemplateUpload,
  onTemplateEdit,
  onTemplateDelete,
  onTemplateDuplicate,
  onUploadNew
}) => {
  return (
    <div className="h-full flex flex-col">
      <div className="border-b bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Template Manager</h1>
              <p className="text-gray-600">
                Manage your templates and edit PDFs with our Canva-style editor
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={onUploadNew}>
                <Plus className="w-4 h-4 mr-2" />
                Upload Template
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="library">
                <FileText className="w-4 h-4 mr-2" />
                Template Library
              </TabsTrigger>
              <TabsTrigger value="upload">
                <Plus className="w-4 h-4 mr-2" />
                Upload New
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="library" className="h-full m-0">
            <TemplateLibrary
              templates={templates}
              onTemplateSelect={onTemplateSelect}
              onTemplateEdit={onTemplateEdit}
              onTemplateDelete={onTemplateDelete}
              onTemplateDuplicate={onTemplateDuplicate}
            />
          </TabsContent>
          
          <TabsContent value="upload" className="h-full m-0">
            <TemplateUploader onTemplateUpload={onTemplateUpload} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
