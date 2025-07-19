
import React, { useState, useMemo } from 'react';
import { Template } from '@/types/template';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  Edit, 
  Trash2, 
  Copy, 
  FileText, 
  Image as ImageIcon,
  Download,
  Calendar
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TemplateLibraryProps {
  templates: Template[];
  onTemplateSelect: (template: Template) => void;
  onTemplateEdit: (template: Template) => void;
  onTemplateDelete: (templateId: string) => void;
  onTemplateDuplicate: (template: Template) => void;
}

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({
  templates,
  onTemplateSelect,
  onTemplateEdit,
  onTemplateDelete,
  onTemplateDuplicate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(templates.map(t => t.category).filter(Boolean)));
    return ['all', ...cats];
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [templates, searchTerm, selectedCategory]);

  const isPDFTemplate = (template: Template): boolean => {
    return template.template_url?.toLowerCase().includes('.pdf') ||
           template.preview?.includes('application/pdf') ||
           template.category === 'pdf';
  };

  const getTemplateIcon = (template: Template) => {
    return isPDFTemplate(template) ? (
      <FileText className="w-5 h-5 text-red-600" />
    ) : (
      <ImageIcon className="w-5 h-5 text-blue-600" />
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Unknown';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search and Filter Bar */}
      <div className="p-6 border-b bg-white">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="flex-1 overflow-auto p-6">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'Upload your first template to get started'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="group hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-0">
                  {/* Template Preview */}
                  <div className="aspect-[3/4] bg-gray-100 rounded-t-lg overflow-hidden relative">
                    {template.preview || template.template_url ? (
                      <div className="w-full h-full flex items-center justify-center">
                        {isPDFTemplate(template) ? (
                          <div className="text-center">
                            <FileText className="w-16 h-16 text-red-600 mx-auto mb-2" />
                            <span className="text-sm text-gray-600 font-medium">PDF Template</span>
                          </div>
                        ) : (
                          <img
                            src={template.preview || template.template_url}
                            alt={template.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.parentElement!.innerHTML = `
                                <div class="flex flex-col items-center justify-center h-full">
                                  <svg class="w-16 h-16 text-gray-400 mb-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                                  </svg>
                                  <span class="text-sm text-gray-500">Preview not available</span>
                                </div>
                              `;
                            }}
                          />
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {getTemplateIcon(template)}
                        <span className="ml-2 text-gray-600">No preview</span>
                      </div>
                    )}
                    
                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => onTemplateSelect(template)}
                          className="bg-white text-gray-900 hover:bg-gray-100"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Use
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => onTemplateEdit(template)}
                          className="bg-white text-gray-900 hover:bg-gray-100"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Template Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900 truncate flex-1" title={template.name}>
                        {template.name}
                      </h3>
                      {getTemplateIcon(template)}
                    </div>
                    
                    {/* Tags */}
                    {template.tags && template.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {template.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {template.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Date */}
                    <div className="flex items-center text-xs text-gray-500 mb-3">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(template.created_at)}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center pt-2 border-t">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onTemplateDuplicate(template)}
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onTemplateDelete(template.id)}
                          title="Delete"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        {isPDFTemplate(template) ? 'PDF' : 'Image'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
