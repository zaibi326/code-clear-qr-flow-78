
import React from 'react';
import { Template } from '@/types/template';
import TemplateOrganizer from './TemplateOrganizer';

interface TemplateLibraryProps {
  templates: Template[];
  onTemplateEdit: (template: Template) => void;
  onTemplateDelete: (templateId: string) => void;
}

const TemplateLibrary = ({ templates, onTemplateEdit, onTemplateDelete }: TemplateLibraryProps) => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Template Library</h2>
        <p className="text-gray-600">Organize and manage your marketing templates with advanced search and filtering</p>
      </div>

      <TemplateOrganizer 
        templates={templates}
        onTemplateSelect={onTemplateEdit}
      />
    </div>
  );
};

export default TemplateLibrary;
