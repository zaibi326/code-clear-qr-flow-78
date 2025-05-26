
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, FileImage, Calendar } from 'lucide-react';
import { Template } from '@/types/template';

interface TemplateLibraryProps {
  templates: Template[];
  onTemplateEdit: (template: Template) => void;
  onTemplateDelete: (templateId: string) => void;
}

const TemplateLibrary = ({ templates, onTemplateEdit, onTemplateDelete }: TemplateLibraryProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  if (templates.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="text-gray-400 text-6xl mb-4">📚</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Templates Yet</h3>
        <p className="text-gray-600">Upload your first marketing template to get started</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Template Library</h2>
        <p className="text-gray-600">Manage your marketing templates and QR code positions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              {template.file?.type === 'application/pdf' ? (
                <div className="w-full h-48 bg-red-100 flex items-center justify-center">
                  <FileImage className="w-12 h-12 text-red-600" />
                  <span className="ml-2 text-red-600 font-medium">PDF</span>
                </div>
              ) : (
                <img 
                  src={template.preview} 
                  alt={template.name}
                  className="w-full h-48 object-cover"
                />
              )}
              
              {template.qrPosition && (
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  QR Positioned
                </div>
              )}
            </div>
            
            <CardHeader className="pb-2">
              <CardTitle className="text-lg truncate">{template.name}</CardTitle>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(template.updatedAt)}
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => onTemplateEdit(template)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onTemplateDelete(template.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TemplateLibrary;
