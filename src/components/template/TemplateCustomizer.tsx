import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Download, X, FileText } from 'lucide-react';
import { Template } from '@/types/template';

interface TemplateCustomizerProps {
  template: Template;
  onSave: (customizedTemplate: Template) => void;
  onCancel: () => void;
}

export const TemplateCustomizer = ({ template, onSave, onCancel }: TemplateCustomizerProps) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Create PDF URL when component mounts or template changes
  useEffect(() => {
    console.log('TemplateCustomizer mounted with template:', template);
    console.log('Template file type:', template.file?.type);
    
    if (template.file && template.file.type === 'application/pdf') {
      const url = URL.createObjectURL(template.file);
      setPdfUrl(url);
      console.log('Created PDF URL:', url);
      
      // Cleanup function to revoke the URL when component unmounts
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [template.file]);

  const isPdfTemplate = template.file?.type === 'application/pdf';

  const saveTemplate = async () => {
    try {
      // For PDF templates, we keep the original template structure
      const customizedTemplate: Template = {
        ...template,
        updatedAt: new Date()
      };

      onSave(customizedTemplate);
      toast.success('Template saved successfully');
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    }
  };

  const downloadTemplate = () => {
    if (template.file) {
      const url = URL.createObjectURL(template.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = template.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${template.name}`);
    } else {
      toast.error('No file available for download');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Template Editor</h1>
            <p className="text-gray-600">
              {isPdfTemplate 
                ? `Editing PDF Template: ${template.name}` 
                : `Editing Template: ${template.name}`
              }
            </p>
          </div>
          <Button variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Close Editor
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Template Preview */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{template.name}</span>
                  {isPdfTemplate && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                      PDF Template
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  ref={containerRef}
                  className="relative bg-gray-100 rounded-lg overflow-hidden mx-auto border-2 border-dashed border-gray-300"
                  style={{ maxWidth: '800px', aspectRatio: '4/3', minHeight: '600px' }}
                >
                  {isPdfTemplate && pdfUrl ? (
                    <div className="w-full h-full relative">
                      <iframe
                        src={pdfUrl}
                        className="w-full h-full border-0"
                        title={`PDF Template - ${template.name}`}
                        style={{ minHeight: '600px' }}
                      />
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs z-10">
                        PDF Template - {template.name}
                      </div>
                    </div>
                  ) : isPdfTemplate ? (
                    <div className="w-full h-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center relative">
                      <div className="text-center">
                        <FileText className="w-16 h-16 text-red-400 mx-auto mb-2" />
                        <span className="text-red-600 font-medium text-lg">PDF Template</span>
                        <p className="text-red-500 text-sm mt-1">Loading PDF...</p>
                      </div>
                    </div>
                  ) : template.preview ? (
                    <img 
                      src={template.preview} 
                      alt={template.name}
                      className="w-full h-full object-contain"
                      draggable={false}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                        <span className="text-gray-600 font-medium">Template Preview</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {isPdfTemplate && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>PDF Template:</strong> This is your uploaded PDF template. 
                      You can view the content and save any modifications.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Properties Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Template Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Template Info */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Template Name</label>
                  <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                    {template.name}
                  </div>
                </div>

                {/* Template Type Info */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Template Type</label>
                  <div className={`text-sm px-3 py-2 rounded-lg ${
                    isPdfTemplate 
                      ? 'bg-red-50 text-red-700 border border-red-200' 
                      : 'bg-green-50 text-green-700 border border-green-200'
                  }`}>
                    {isPdfTemplate ? 'PDF Template' : 'Image Template'}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    onClick={saveTemplate}
                    className="w-full"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Template
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={downloadTemplate}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={onCancel}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>

                {/* Instructions */}
                <div className="text-xs text-gray-500 p-3 bg-blue-50 rounded-lg">
                  <strong>Instructions:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• View your template content above</li>
                    <li>• Save to store any changes</li>
                    <li>• Download to get the template file</li>
                    {isPdfTemplate && (
                      <li>• PDF content is displayed in the preview</li>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
