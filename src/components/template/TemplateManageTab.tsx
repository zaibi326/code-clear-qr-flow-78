
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Plus, Eye, Download, Trash2, Search, Grid, List, Copy, Edit } from 'lucide-react';
import { Template } from '@/types/template';
import { toast } from 'sonner';

interface TemplateManageTabProps {
  templates: Template[];
  onTemplateEdit: (template: Template) => void;
  onTemplateDelete: (templateId: string) => void;
  onTemplateDuplicate: (templateId: string) => void;
  onUploadNew?: () => void;
}

export const TemplateManageTab = ({ 
  templates, 
  onTemplateEdit, 
  onTemplateDelete, 
  onTemplateDuplicate,
  onUploadNew 
}: TemplateManageTabProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [filterType, setFilterType] = useState<'all' | 'pdf' | 'image'>('all');

  // Fixed filtering logic
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (template.id && template.id.toLowerCase().includes(searchTerm.toLowerCase()));
    
    let matchesFilter = true;
    if (filterType === 'pdf') {
      matchesFilter = template.file?.type === 'application/pdf' || 
                      (template.preview && template.preview.includes('data:application/pdf')) ||
                      template.name.toLowerCase().includes('pdf');
    } else if (filterType === 'image') {
      matchesFilter = template.file?.type !== 'application/pdf' && 
                      (template.file?.type?.startsWith('image/') || 
                       (template.preview && template.preview.startsWith('data:image/')) ||
                       !template.name.toLowerCase().includes('pdf'));
    }
    
    return matchesSearch && matchesFilter;
  });

  // Helper function to check if template has viewable content
  const hasViewableContent = (template: Template): boolean => {
    return !!(template.preview || template.template_url || template.thumbnail_url || template.file);
  };

  // Helper function to get template display type
  const getTemplateType = (template: Template): 'pdf' | 'image' => {
    if (template.file?.type === 'application/pdf') return 'pdf';
    if (template.preview && template.preview.includes('data:application/pdf')) return 'pdf';
    if (template.name.toLowerCase().includes('pdf')) return 'pdf';
    return 'image';
  };

  const handlePreview = (template: Template) => {
    console.log('Preview template:', template);
    console.log('Template preview data available:', {
      hasPreview: !!template.preview,
      hasTemplateUrl: !!template.template_url,
      hasThumbnailUrl: !!template.thumbnail_url,
      hasFile: !!template.file,
      previewLength: template.preview?.length || 0
    });
    
    if (!hasViewableContent(template)) {
      toast.error('Preview not available for this template');
      return;
    }

    const templateType = getTemplateType(template);
    
    if (templateType === 'pdf') {
      // For PDF files, handle both file objects and data URLs
      let pdfData = null;
      
      if (template.file) {
        // Handle File objects
        try {
          const reader = new FileReader();
          reader.onload = function(e) {
            const pdfDataUrl = e.target?.result;
            if (pdfDataUrl) {
              openPdfPreview(template.name, pdfDataUrl as string);
            }
          };
          reader.readAsDataURL(template.file);
          return;
        } catch (error) {
          console.error('Error reading PDF file:', error);
          toast.error('Failed to read PDF file');
          return;
        }
      } else if (template.preview && template.preview.startsWith('data:application/pdf')) {
        // Handle PDF data URLs
        pdfData = template.preview;
      } else if (template.template_url && template.template_url.startsWith('data:application/pdf')) {
        pdfData = template.template_url;
      }
      
      if (pdfData) {
        openPdfPreview(template.name, pdfData);
      } else {
        toast.error('PDF data not available for preview');
      }
    } else {
      // For image templates, use available image data
      let imageData = template.preview || template.template_url || template.thumbnail_url;
      
      if (!imageData && template.file && template.file.type.startsWith('image/')) {
        // Convert image file to data URL for preview
        const reader = new FileReader();
        reader.onload = function(e) {
          const imageDataUrl = e.target?.result as string;
          if (imageDataUrl) {
            openImagePreview(template.name, imageDataUrl);
          }
        };
        reader.readAsDataURL(template.file);
        return;
      }
      
      if (imageData) {
        openImagePreview(template.name, imageData);
      } else {
        toast.error('Image data not available for preview');
      }
    }
  };

  const openPdfPreview = (templateName: string, pdfData: string) => {
    try {
      const previewWindow = window.open('', '_blank', 'width=900,height=700,scrollbars=yes,resizable=yes');
      if (previewWindow) {
        previewWindow.document.write(`
          <html>
            <head>
              <title>PDF Preview - ${templateName}</title>
              <style>
                body { margin: 0; padding: 20px; background: #f5f5f5; font-family: Arial, sans-serif; }
                .header { background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .pdf-container { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                embed { width: 100%; height: 600px; border: none; }
                iframe { width: 100%; height: 600px; border: none; }
              </style>
            </head>
            <body>
              <div class="header">
                <h2>PDF Template Preview: ${templateName}</h2>
                <p>Template Type: PDF Document</p>
              </div>
              <div class="pdf-container">
                <embed src="${pdfData}" type="application/pdf" />
                <noembed>
                  <iframe src="${pdfData}"></iframe>
                </noembed>
              </div>
            </body>
          </html>
        `);
        previewWindow.document.close();
        toast.success(`Opened PDF preview for ${templateName}`);
      } else {
        toast.error('Could not open preview window. Please check your browser settings.');
      }
    } catch (error) {
      console.error('Error opening PDF preview:', error);
      toast.error('Failed to open PDF preview');
    }
  };

  const openImagePreview = (templateName: string, imageData: string) => {
    try {
      const previewWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
      if (previewWindow) {
        previewWindow.document.write(`
          <html>
            <head>
              <title>Template Preview - ${templateName}</title>
              <style>
                body { margin: 0; background: #f0f0f0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
                .container { text-align: center; padding: 20px; }
                img { max-width: 100%; max-height: 90vh; object-fit: contain; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
                .title { margin-bottom: 20px; color: #333; font-family: Arial, sans-serif; }
              </style>
            </head>
            <body>
              <div class="container">
                <h2 class="title">Template Preview: ${templateName}</h2>
                <img src="${imageData}" alt="${templateName}" />
              </div>
            </body>
          </html>
        `);
        previewWindow.document.close();
        toast.success(`Opened preview for ${templateName}`);
      } else {
        toast.error('Could not open preview window. Please check your browser settings.');
      }
    } catch (error) {
      console.error('Error opening image preview:', error);
      toast.error('Failed to open image preview');
    }
  };

  const handleEdit = (template: Template) => {
    console.log('Editing template:', template);
    console.log('Template edit data check:', {
      hasFile: !!template.file,
      hasPreview: !!template.preview,
      hasTemplateUrl: !!template.template_url,
      hasThumbnailUrl: !!template.thumbnail_url,
      fileType: template.file?.type,
      previewLength: template.preview?.length || 0
    });
    
    // Check if template has any usable data for editing
    if (!hasViewableContent(template)) {
      toast.error('Cannot edit template - no file or preview data available');
      return;
    }
    
    const templateType = getTemplateType(template);
    
    console.log(`Opening ${templateType} editor for template: ${template.name}`);
    toast.success(`Opening ${templateType.toUpperCase()} editor for ${template.name}`);
    
    onTemplateEdit(template);
  };

  const handleDownload = (template: Template) => {
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
    } else if (template.preview) {
      // For templates without files, create a download link for the preview
      const link = document.createElement('a');
      link.href = template.preview;
      link.download = `${template.name}.png`;
      link.click();
      toast.success(`Downloaded ${template.name}`);
    } else {
      toast.error('No downloadable content available for this template');
    }
  };

  const handleDuplicate = (templateId: string) => {
    onTemplateDuplicate(templateId);
    const template = templates.find(t => t.id === templateId);
    toast.success(`Duplicated ${template?.name || 'template'}`);
  };

  const handleDelete = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (confirm(`Are you sure you want to delete "${template?.name}"? This action cannot be undone.`)) {
      onTemplateDelete(templateId);
      toast.success(`Deleted ${template?.name || 'template'}`);
    }
  };

  if (templates.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600 mb-6">Upload your first marketing template to get started</p>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={onUploadNew}
          >
            <Plus className="h-4 w-4 mr-2" />
            Upload Template
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar with improved functionality */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search templates by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchTerm('')}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              ×
            </Button>
          )}
        </div>
        
        <div className="flex gap-2">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="pdf">PDF Only</option>
            <option value="image">Images Only</option>
          </select>
          
          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-none"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={onUploadNew}
          >
            <Plus className="h-4 w-4 mr-2" />
            Upload New
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {filteredTemplates.length} of {templates.length} templates
          {searchTerm && (
            <span className="ml-2 text-blue-600">
              for "{searchTerm}"
            </span>
          )}
        </div>
      </div>

      {/* Templates Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => {
            const templateType = getTemplateType(template);
            return (
              <Card key={template.id} className="hover:shadow-md transition-shadow duration-200">
                <div className="relative">
                  {templateType === 'pdf' ? (
                    <div className="w-full h-48 bg-red-100 flex items-center justify-center cursor-pointer" onClick={() => handlePreview(template)}>
                      <FileText className="w-12 h-12 text-red-600" />
                      <span className="ml-2 text-red-600 font-medium">PDF Template</span>
                    </div>
                  ) : (
                    <img 
                      src={template.preview || template.template_url || template.thumbnail_url} 
                      alt={template.name}
                      className="w-full h-48 object-cover cursor-pointer"
                      onClick={() => handlePreview(template)}
                      onError={(e) => {
                        // Fallback to a placeholder if image fails to load
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA4VjE2TTggMTJIMTYiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+';
                      }}
                    />
                  )}
                  
                  {template.qrPosition && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      QR Ready
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 truncate">{template.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Updated {template.updatedAt.toLocaleDateString()}
                  </p>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handlePreview(template)}
                      className="flex-1"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(template)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDuplicate(template.id)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTemplates.map((template) => {
            const templateType = getTemplateType(template);
            return (
              <Card key={template.id} className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div 
                        className={`p-3 rounded-lg cursor-pointer ${
                          templateType === 'pdf' ? 'bg-red-100' : 'bg-purple-100'
                        }`}
                        onClick={() => handlePreview(template)}
                      >
                        <FileText className={`h-6 w-6 ${
                          templateType === 'pdf' ? 'text-red-600' : 'text-purple-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{templateType === 'pdf' ? 'PDF Template' : 'IMAGE Template'}</span>
                          <span>•</span>
                          <span>Updated {template.updatedAt.toLocaleDateString()}</span>
                          {template.qrPosition && (
                            <>
                              <span>•</span>
                              <span className="text-green-600 font-medium">QR Positioned</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handlePreview(template)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(template)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownload(template)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDuplicate(template.id)}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Duplicate
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(template.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {filteredTemplates.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <Search className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600 mb-6">
            No templates match your search "{searchTerm}". Try adjusting your search or filter criteria.
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('');
              setFilterType('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};
