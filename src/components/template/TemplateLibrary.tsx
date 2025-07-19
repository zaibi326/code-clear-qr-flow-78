
import React, { useState } from 'react';
import { Template } from '@/types/template';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Trash2, 
  Copy, 
  Download, 
  Eye,
  FileText,
  Image as ImageIcon,
  Edit3
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TemplateLibraryProps {
  templates: Template[];
  onTemplateSelect: (template: Template) => void;
  onTemplateEdit: (template: Template) => void;
  onTemplateDelete: (templateId: string) => void;
  onTemplateDuplicate: (template: Template) => void;
  isPDFTemplate?: (template: Template) => boolean;
}

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({
  templates,
  onTemplateSelect,
  onTemplateEdit,
  onTemplateDelete,
  onTemplateDuplicate,
  isPDFTemplate = () => false
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...new Set(templates.map(t => t.category).filter(Boolean))];
  
  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const handleDownload = async (template: Template) => {
    try {
      const url = template.template_url || template.preview;
      if (!url) return;

      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${template.name}.${isPDFTemplate(template) ? 'pdf' : 'png'}`;
      link.click();
      
      URL.revokeObjectURL(downloadUrl);
      
      toast({
        title: "Download started",
        description: `${template.name} is being downloaded`
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  if (templates.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">No templates yet</h3>
          <p className="text-gray-600 mb-4">
            Upload your first template to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Filter Bar */}
      <div className="px-6 py-4 bg-gray-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-sm border rounded px-2 py-1"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="text-sm text-gray-600">
            {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="p-4">
                <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden mb-3">
                  {template.preview || template.template_url ? (
                    <img
                      src={template.thumbnail_url || template.preview || template.template_url}
                      alt={template.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className="hidden w-full h-full flex items-center justify-center bg-gray-100">
                    {isPDFTemplate(template) ? (
                      <FileText className="w-12 h-12 text-gray-400" />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-sm truncate" title={template.name}>
                    {template.name}
                  </h3>
                  
                  <div className="flex items-center gap-2">
                    {isPDFTemplate(template) && (
                      <Badge variant="secondary" className="text-xs">
                        <FileText className="w-3 h-3 mr-1" />
                        PDF
                      </Badge>
                    )}
                    {template.category && (
                      <Badge variant="outline" className="text-xs">
                        {template.category}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardFooter className="p-4 pt-0">
                <div className="flex items-center gap-1 w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTemplateSelect(template)}
                    className="flex-1"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTemplateEdit(template)}
                  >
                    {isPDFTemplate(template) ? (
                      <Edit3 className="w-3 h-3" />
                    ) : (
                      <Edit className="w-3 h-3" />
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(template)}
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTemplateDuplicate(template)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTemplateDelete(template.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
