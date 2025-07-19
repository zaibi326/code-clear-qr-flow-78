import React, { useState } from 'react';
import { Template } from '@/types/template';
import { TemplateLibrary } from './TemplateLibrary';
import { TemplateUploader } from './TemplateUploader';
import { CanvaPDFEditor } from './pdf/CanvaPDFEditor';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileText, Edit3 } from 'lucide-react';

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
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [showPDFEditor, setShowPDFEditor] = useState(false);

  const handlePDFEdit = (template: Template) => {
    setEditingTemplate(template);
    setShowPDFEditor(true);
  };

  const handlePDFEditorSave = (updatedTemplate: Template) => {
    // Call the parent's edit handler
    onTemplateEdit(updatedTemplate);
    
    // Close the PDF editor
    setShowPDFEditor(false);
    setEditingTemplate(null);
  };

  const handlePDFEditorCancel = () => {
    setShowPDFEditor(false);
    setEditingTemplate(null);
  };

  const isPDFTemplate = (template: Template): boolean => {
    return template.template_url?.toLowerCase().includes('.pdf') ||
           template.preview?.includes('application/pdf') ||
           template.category === 'pdf';
  };

  // Show PDF editor if editing a PDF template
  if (showPDFEditor && editingTemplate) {
    return (
      <CanvaPDFEditor
        template={editingTemplate}
        onSave={handlePDFEditorSave}
        onCancel={handlePDFEditorCancel}
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Template Manager</h1>
              <p className="text-gray-600">
                Manage your templates and create stunning designs with our PDF editor
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowPDFEditor(true)}>
                <Edit3 className="w-4 h-4 mr-2" />
                New PDF Editor
              </Button>
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
              onTemplateEdit={(template) => {
                if (isPDFTemplate(template)) {
                  handlePDFEdit(template);
                } else {
                  onTemplateEdit(template);
                }
              }}
              onTemplateDelete={onTemplateDelete}
              onTemplateDuplicate={onTemplateDuplicate}
              isPDFTemplate={isPDFTemplate}
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
