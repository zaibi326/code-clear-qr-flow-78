
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Plus, Eye } from 'lucide-react';
import { Template } from '@/types/template';

interface TemplateLibraryTabProps {
  templates: Template[];
  onTemplateSelect: (template: Template) => void;
}

export const TemplateLibraryTab = ({ templates, onTemplateSelect }: TemplateLibraryTabProps) => {
  // Predefined template categories
  const predefinedTemplates = [
    {
      id: 'marketing-1',
      name: 'Marketing Flyer Template',
      description: 'Professional marketing templates for campaigns and promotions.',
      category: 'Marketing',
      preview: '/placeholder.svg',
      downloadUrl: '#'
    },
    {
      id: 'business-1',
      name: 'Business Card Template',
      description: 'Business card and corporate template designs.',
      category: 'Business',
      preview: '/placeholder.svg',
      downloadUrl: '#'
    },
    {
      id: 'event-1',
      name: 'Event Poster Template',
      description: 'Eye-catching templates for events and announcements.',
      category: 'Events',
      preview: '/placeholder.svg',
      downloadUrl: '#'
    },
    {
      id: 'social-1',
      name: 'Social Media Template',
      description: 'Templates optimized for social media platforms.',
      category: 'Social Media',
      preview: '/placeholder.svg',
      downloadUrl: '#'
    }
  ];

  const handleDownloadTemplate = (templateId: string) => {
    console.log('Downloading template:', templateId);
    // In a real implementation, this would download the template file
    alert('Template download feature will be implemented with backend integration');
  };

  const handleUseTemplate = (templateData: any) => {
    // Create a new template from the predefined template
    const newTemplate: Template = {
      id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: templateData.name,
      type: templateData.category.toLowerCase(),
      category: templateData.category,
      description: templateData.description,
      file: null,
      preview: templateData.preview,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    onTemplateSelect(newTemplate);
  };

  return (
    <div className="space-y-6">
      {/* User Templates Section */}
      {templates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>Your Templates</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.slice(0, 6).map((template) => (
                <div 
                  key={template.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  onClick={() => onTemplateSelect(template)}
                >
                  <div className="relative mb-3">
                    {template.file?.type === 'application/pdf' ? (
                      <div className="w-full h-32 bg-red-100 rounded flex items-center justify-center">
                        <FileText className="w-8 h-8 text-red-600" />
                      </div>
                    ) : (
                      <img 
                        src={template.preview} 
                        alt={template.name}
                        className="w-full h-32 object-cover rounded"
                      />
                    )}
                    {template.qrPosition && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        QR Ready
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 truncate">{template.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Updated {template.updatedAt.toLocaleDateString()}
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTemplateSelect(template);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Use Template
                  </Button>
                </div>
              ))}
            </div>
            {templates.length > 6 && (
              <div className="mt-4 text-center">
                <Button variant="outline">
                  View All Your Templates ({templates.length})
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Template Library Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span>Template Library</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {predefinedTemplates.map((template) => (
              <div 
                key={template.id}
                className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{template.description}</p>
                    <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {template.category}
                    </div>
                  </div>
                  <img 
                    src={template.preview} 
                    alt={template.name}
                    className="w-16 h-16 object-cover rounded ml-4"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleDownloadTemplate(template.id)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleUseTemplate(template)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Use Template
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Empty State for New Users */}
      {templates.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start with a Template</h3>
            <p className="text-gray-600 mb-6">
              Choose from our library of professional templates or upload your own
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Browse Library
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Upload Template
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
