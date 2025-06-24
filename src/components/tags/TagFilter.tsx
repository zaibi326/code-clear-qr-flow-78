
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Filter, Tag } from 'lucide-react';
import { useTagFilter } from '@/hooks/useTagFilter';

interface TagFilterProps {
  selectedTags: string[];
  onTagsChange: (tagIds: string[]) => void;
  category?: string;
}

export const TagFilter: React.FC<TagFilterProps> = ({
  selectedTags,
  onTagsChange,
  category = 'all'
}) => {
  const {
    availableTags,
    categories,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    isOpen,
    setIsOpen,
    handleTagToggle,
    clearAllFilters,
    filteredTags,
    selectedTagObjects
  } = useTagFilter({ selectedTags, onTagsChange, category });

  console.log('TagFilter rendering with:');
  console.log('- availableTags:', availableTags.length);
  console.log('- categories:', categories);
  console.log('- selectedCategory:', selectedCategory);
  console.log('- filteredTags:', filteredTags.length);

  // Enhanced validation for category options
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map(cat => ({
      value: cat || `category-${Math.random().toString(36).substr(2, 9)}`,
      label: cat || 'Unnamed Category'
    }))
  ].filter(option => {
    const isValid = option.value && 
                   typeof option.value === 'string' && 
                   option.value.trim() !== '' && 
                   option.label && 
                   typeof option.label === 'string' && 
                   option.label.trim() !== '';
    if (!isValid) {
      console.error('TagFilter: Invalid category option detected:', option);
    }
    return isValid;
  });

  console.log('TagFilter: Valid category options:', categoryOptions);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Tags</Label>
        {selectedTags.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear all
          </Button>
        )}
      </div>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            <Filter className="mr-2 h-4 w-4" />
            {selectedTags.length > 0 ? `${selectedTags.length} tags selected` : 'Select tags'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-4">
            <div>
              <Label htmlFor="category-select" className="text-sm font-medium">Category</Label>
              {categoryOptions.length > 0 ? (
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger id="category-select">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(option => {
                      console.log('TagFilter: Rendering category SelectItem with value:', option.value, 'label:', option.label);
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-sm text-gray-500 p-2 border rounded">
                  No categories available
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="tag-search" className="text-sm font-medium">Search</Label>
              <Input
                id="tag-search"
                placeholder="Search tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="max-h-48 overflow-y-auto">
              {filteredTags.length > 0 ? (
                <div className="space-y-2">
                  {filteredTags.map((tag) => (
                    <div key={tag.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`tag-${tag.id}`}
                        checked={selectedTags.includes(tag.id)}
                        onChange={() => handleTagToggle(tag.id)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={`tag-${tag.id}`} className="text-sm flex-1 cursor-pointer">
                        <Tag className="inline w-3 h-3 mr-1" />
                        {tag.name}
                        {tag.usage_count && (
                          <span className="text-gray-500 ml-2">({tag.usage_count})</span>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 p-4 text-center">
                  No tags found
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {selectedTagObjects.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTagObjects.map((tag) => (
            <Badge key={tag.id} variant="secondary" className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {tag.name}
              <X
                className="w-3 h-3 cursor-pointer hover:text-red-500"
                onClick={() => handleTagToggle(tag.id)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
