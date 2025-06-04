
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FileText, Download, Star, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface Template {
  id: string;
  name: string;
  preview: string;
  category: string;
  downloads: number;
  rating: number;
  featured: boolean;
}

interface CampaignTemplateSelectorProps {
  onTemplateSelect: (template: Template) => void;
}

export const CampaignTemplateSelector = ({ onTemplateSelect }: CampaignTemplateSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const mockTemplates: Template[] = [
    {
      id: '1',
      name: 'Modern Business Card',
      preview: '/lovable-uploads/02a40581-58f3-4a8f-9289-addc9f13cab0.png',
      category: 'business',
      downloads: 1234,
      rating: 4.8,
      featured: true
    },
    {
      id: '2',
      name: 'Event Poster',
      preview: '/lovable-uploads/5a18dce6-2917-4c31-af16-17e4c3ac2cf1.png',
      category: 'events',
      downloads: 856,
      rating: 4.6,
      featured: false
    },
    {
      id: '3',
      name: 'Restaurant Menu',
      preview: '/lovable-uploads/7044a335-27b6-407a-8043-23c1c5995404.png',
      category: 'restaurant',
      downloads: 742,
      rating: 4.9,
      featured: true
    },
    {
      id: '4',
      name: 'Product Showcase',
      preview: '/lovable-uploads/83cd2073-42ea-432d-a04a-43858780a99c.png',
      category: 'marketing',
      downloads: 623,
      rating: 4.7,
      featured: false
    }
  ];

  const categories = ['all', 'business', 'events', 'restaurant', 'marketing'];

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTemplateSelect = (template: Template) => {
    onTemplateSelect(template);
    toast.success(`Selected template: ${template.name}`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse Campaign Templates</h2>
        <p className="text-gray-600">Choose from our collection of professional templates</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
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
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? 'bg-blue-600 hover:bg-blue-700' : ''}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
            <div className="relative">
              <img 
                src={template.preview} 
                alt={template.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              {template.featured && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  Featured
                </div>
              )}
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  <span>{template.downloads}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-current text-yellow-500" />
                  <span>{template.rating}</span>
                </div>
              </div>
              
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => handleTemplateSelect(template)}
              >
                Select Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};
