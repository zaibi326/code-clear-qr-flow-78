
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  SortAsc, 
  FileImage, 
  Calendar,
  Download,
  Share2,
  Copy
} from 'lucide-react';
import { Template } from '@/types/template';

interface TemplateOrganizerProps {
  templates: Template[];
  onTemplateSelect: (template: Template) => void;
  selectedTemplate?: Template | null;
}

const TemplateOrganizer = ({ templates, onTemplateSelect, selectedTemplate }: TemplateOrganizerProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'usage'>('date');
  const [filterType, setFilterType] = useState<'all' | 'pdf' | 'image'>('all');

  const filteredTemplates = templates
    .filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || 
        (filterType === 'pdf' && template.file?.type === 'application/pdf') ||
        (filterType === 'image' && template.file?.type !== 'application/pdf');
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return b.updatedAt.getTime() - a.updatedAt.getTime();
        case 'usage':
          return 0; // Would implement usage tracking
        default:
          return 0;
      }
    });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const handleTemplateAction = (template: Template, action: 'duplicate' | 'download' | 'share') => {
    switch (action) {
      case 'duplicate':
        console.log('Duplicating template:', template.name);
        break;
      case 'download':
        console.log('Downloading template:', template.name);
        break;
      case 'share':
        console.log('Sharing template:', template.name);
        break;
    }
  };

  if (templates.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="text-gray-400 text-6xl mb-4">📂</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Templates Found</h3>
        <p className="text-gray-600">Upload your first marketing template to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Types</option>
            <option value="pdf">PDF Only</option>
            <option value="image">Images Only</option>
          </select>
          
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="usage">Sort by Usage</option>
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
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {filteredTemplates.length} of {templates.length} templates
        </div>
        <div className="flex gap-2">
          {filterType !== 'all' && (
            <Badge variant="outline">
              {filterType === 'pdf' ? 'PDF Files' : 'Image Files'}
            </Badge>
          )}
          {searchTerm && (
            <Badge variant="outline">
              Search: "{searchTerm}"
            </Badge>
          )}
        </div>
      </div>

      {/* Templates Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
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
                
                {template.qrPosition && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    QR Ready
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
                <div className="flex gap-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTemplateAction(template, 'duplicate');
                    }}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Duplicate
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTemplateAction(template, 'download');
                    }}
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTemplateAction(template, 'share');
                    }}
                  >
                    <Share2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTemplates.map((template) => (
            <Card 
              key={template.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedTemplate?.id === template.id 
                  ? 'ring-2 ring-blue-500 border-blue-500' 
                  : 'border-gray-200'
              }`}
              onClick={() => onTemplateSelect(template)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 flex-shrink-0">
                    {template.file?.type === 'application/pdf' ? (
                      <div className="w-full h-full bg-red-100 rounded flex items-center justify-center">
                        <FileImage className="w-6 h-6 text-red-600" />
                      </div>
                    ) : (
                      <img 
                        src={template.preview} 
                        alt={template.name}
                        className="w-full h-full object-cover rounded"
                      />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{template.name}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(template.updatedAt)}
                      </div>
                      {template.qrPosition && (
                        <Badge variant="secondary" className="text-xs">
                          QR Positioned
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTemplateAction(template, 'duplicate');
                      }}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Duplicate
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTemplateAction(template, 'download');
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredTemplates.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('');
              setFilterType('all');
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default TemplateOrganizer;
