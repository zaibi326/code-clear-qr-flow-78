import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileImage, Plus, Check } from 'lucide-react';
import { Template } from '@/types/template';

interface TemplateSelectionProps {
  selectedTemplate: Template | null;
  onTemplateSelect: (template: Template) => void;
}

const TemplateSelection = ({ selectedTemplate, onTemplateSelect }: TemplateSelectionProps) => {
  // Mock templates for demo - in real app, this would come from props or API
  const [templates] = useState<Template[]>([
    {
      id: 'template-1',
      name: 'Marketing Flyer',
      file: null,
      preview: '/placeholder.svg',
      qrPosition: { x: 100, y: 200, width: 80, height: 80 },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'template-2',
      name: 'Product Catalog',
      file: null,
      preview: '/placeholder.svg',
      qrPosition: { x: 150, y: 300, width: 100, height: 100 },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Template</h2>
        <p className="text-gray-600">Select a marketing template for your QR campaign</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create New Template Card */}
        <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 cursor-pointer transition-colors">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <Plus className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Create New Template</h3>
            <p className="text-sm text-gray-500 mb-4">Upload a new marketing template</p>
            <Button variant="outline" size="sm">
              Upload Template
            </Button>
          </CardContent>
        </Card>

        {/* Existing Templates */}
        {templates.map((template) => (
          <Card 
            key={template.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedTemplate?.id === template.id 
                ? 'ring-2 ring-blue-500 border-blue-500' 
                : 'border-gray-200'
            }`}
            onClick={() => onTemplateSelect(template)}
          >
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
              
              {selectedTemplate?.id === template.id && (
                <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                  <Check className="w-4 h-4" />
                </div>
              )}
              
              {template.qrPosition && (
                <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  QR Ready
                </div>
              )}
            </div>
            
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{template.name}</CardTitle>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-sm text-gray-500">
                Updated {template.updatedAt.toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTemplate && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <Check className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-blue-800 font-medium">
              Selected: {selectedTemplate.name}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSelection;
