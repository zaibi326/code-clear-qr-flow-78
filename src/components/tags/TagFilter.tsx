
import React, { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { tagService, Tag } from '@/services/tagService';

interface TagFilterProps {
  selectedTags: string[];
  onTagsChange: (tagIds: string[]) => void;
  category?: string;
  className?: string;
}

export const TagFilter: React.FC<TagFilterProps> = ({
  selectedTags,
  onTagsChange,
  category,
  className = ""
}) => {
  const { user } = useAuth();
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(category || 'all');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadTags();
      loadCategories();
    }
  }, [user, selectedCategory]);

  const loadTags = async () => {
    if (!user?.id) return;
    
    try {
      const tags = await tagService.getTags(user.id, {
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        sortBy: 'usage_count',
        sortOrder: 'desc'
      });
      setAvailableTags(tags);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const loadCategories = async () => {
    if (!user?.id) return;
    
    try {
      const cats = await tagService.getTagCategories(user.id);
      setCategories(cats);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleTagToggle = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter(id => id !== tagId));
    } else {
      onTagsChange([...selectedTags, tagId]);
    }
  };

  const clearAllFilters = () => {
    onTagsChange([]);
  };

  const filteredTags = availableTags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedTagObjects = availableTags.filter(tag => 
    selectedTags.includes(tag.id)
  );

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Selected Tags Display */}
      {selectedTagObjects.map((tag) => (
        <Badge
          key={tag.id}
          variant="secondary"
          className="flex items-center gap-1 px-2 py-1"
          style={{ backgroundColor: `${tag.color}20`, borderColor: tag.color }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: tag.color }}
          />
          <span className="text-sm">{tag.name}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={() => handleTagToggle(tag.id)}
          >
            <X className="w-3 h-3" />
          </Button>
        </Badge>
      ))}

      {/* Filter Popover */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filter by Tags
            {selectedTags.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {selectedTags.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filter by Tags</h4>
              {selectedTags.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-xs"
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat || 'uncategorized'}>
                        {cat ? (cat.charAt(0).toUpperCase() + cat.slice(1)) : 'Uncategorized'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Search */}
            <div>
              <Input
                placeholder="Search tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Tags List */}
            <div className="max-h-48 overflow-y-auto space-y-2">
              {filteredTags.length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-4">
                  No tags found
                </div>
              ) : (
                filteredTags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    onClick={() => handleTagToggle(tag.id)}
                  >
                    <Checkbox
                      checked={selectedTags.includes(tag.id)}
                      onChange={() => handleTagToggle(tag.id)}
                    />
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    <span className="flex-1 text-sm">{tag.name}</span>
                    <span className="text-xs text-gray-500">
                      {tag.usage_count}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
