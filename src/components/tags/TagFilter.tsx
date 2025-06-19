
import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useTagFilter } from '@/hooks/useTagFilter';
import { SelectedTagsDisplay } from './SelectedTagsDisplay';
import { TagFilterPopoverContent } from './TagFilterPopoverContent';

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
  const {
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

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Selected Tags Display */}
      <SelectedTagsDisplay
        selectedTagObjects={selectedTagObjects}
        onTagToggle={handleTagToggle}
      />

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
          <TagFilterPopoverContent
            selectedTags={selectedTags}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredTags={filteredTags}
            onTagToggle={handleTagToggle}
            onClearAll={clearAllFilters}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
