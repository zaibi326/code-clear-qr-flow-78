
import React from 'react';
import { Template } from '@/types/template';
import { TemplateManagerHeader } from './TemplateManagerHeader';
import { TemplateManagerTabsContent } from './TemplateManagerTabsContent';

interface TemplateManagerContentProps {
  templates: Template[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onTemplateSelect: (template: Template) => void;
  onTemplateUpload: (template: Template) => void;
  onTemplateEdit: (template: Template) => void;
  onTemplateDelete: (templateId: string) => void;
  onTemplateDuplicate: (templateId: string) => void;
  onUploadNew: () => void;
}

export const TemplateManagerContent = ({
  templates,
  activeTab,
  setActiveTab,
  onTemplateSelect,
  onTemplateUpload,
  onTemplateEdit,
  onTemplateDelete,
  onTemplateDuplicate,
  onUploadNew
}: TemplateManagerContentProps) => {
  const handleTabChange = (newTab: string) => {
    console.log('Changing tab from', activeTab, 'to', newTab);
    console.log('Current templates count:', templates.length);
    setActiveTab(newTab);
  };

  return (
    <>
      <TemplateManagerHeader onUploadClick={onUploadNew} />
      <TemplateManagerTabsContent
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        templates={templates}
        onTemplateSelect={onTemplateSelect}
        onTemplateUpload={onTemplateUpload}
        onTemplateEdit={onTemplateEdit}
        onTemplateDelete={onTemplateDelete}
        onTemplateDuplicate={onTemplateDuplicate}
        onUploadNew={onUploadNew}
      />
    </>
  );
};
