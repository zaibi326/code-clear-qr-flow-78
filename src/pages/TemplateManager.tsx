
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import TemplateUpload from '@/components/template/TemplateUpload';
import TemplateLibrary from '@/components/template/TemplateLibrary';
import TemplateEditor from '@/components/template/TemplateEditor';
import { Template } from '@/types/template';

const TemplateManager = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'library' | 'editor'>('upload');

  const handleTemplateUpload = (template: Template) => {
    setTemplates(prev => [...prev, template]);
    setEditingTemplate(template);
    setActiveTab('editor');
  };

  const handleTemplateEdit = (template: Template) => {
    setEditingTemplate(template);
    setActiveTab('editor');
  };

  const handleTemplateSave = (updatedTemplate: Template) => {
    setTemplates(prev => 
      prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t)
    );
    setEditingTemplate(null);
    setActiveTab('library');
  };

  const handleTemplateDelete = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Template Manager</h1>
          <p className="text-gray-600">Upload marketing templates and position QR codes with precision</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            {[
              { id: 'upload', label: 'Upload Template', icon: '📤' },
              { id: 'library', label: 'Template Library', icon: '📚' },
              { id: 'editor', label: 'QR Editor', icon: '🎨' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm">
          {activeTab === 'upload' && (
            <TemplateUpload onTemplateUpload={handleTemplateUpload} />
          )}
          
          {activeTab === 'library' && (
            <TemplateLibrary 
              templates={templates}
              onTemplateEdit={handleTemplateEdit}
              onTemplateDelete={handleTemplateDelete}
            />
          )}
          
          {activeTab === 'editor' && editingTemplate && (
            <TemplateEditor 
              template={editingTemplate}
              onSave={handleTemplateSave}
              onCancel={() => {
                setEditingTemplate(null);
                setActiveTab('library');
              }}
            />
          )}
          
          {activeTab === 'editor' && !editingTemplate && (
            <div className="p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">🎨</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Template Selected</h3>
              <p className="text-gray-600">Select a template from the library or upload a new one to start editing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateManager;
