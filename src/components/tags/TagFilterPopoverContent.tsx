
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tag } from '@/services/tagService';

interface TagFilterPopoverContentProps {
  selectedTags: string[];
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredTags: Tag[];
  onTagToggle: (tagId: string) => void;
  onClearAll: () => void;
}

export const TagFilterPopoverContent: React.FC<TagFilterPopoverContentProps> = ({
  selectedTags,
  categories,
  selectedCategory,
  setSelectedCategory,
  searchTerm,
  setSearchTerm,
  filteredTags,
  onTagToggle,
  onClearAll
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Filter by Tags</h4>
        {selectedTags.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
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
                <SelectItem key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
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
              onClick={() => onTagToggle(tag.id)}
            >
              <Checkbox
                checked={selectedTags.includes(tag.id)}
                onChange={() => onTagToggle(tag.id)}
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
  );
};
