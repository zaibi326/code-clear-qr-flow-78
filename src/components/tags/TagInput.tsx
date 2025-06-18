
import React, { useState, useEffect } from 'react';
import { X, Plus, Tag as TagIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { tagService, Tag } from '@/services/tagService';
import { toast } from '@/hooks/use-toast';

interface TagInputProps {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  placeholder?: string;
  className?: string;
  allowCreate?: boolean;
  category?: string;
}

export const TagInput: React.FC<TagInputProps> = ({
  selectedTags,
  onTagsChange,
  placeholder = "Add tags...",
  className = "",
  allowCreate = true,
  category
}) => {
  const { user } = useAuth();
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadTags();
    }
  }, [user, category]);

  const loadTags = async () => {
    if (!user?.id) return;
    
    try {
      const tags = await tagService.getTags(user.id, { 
        category,
        sortBy: 'usage_count',
        sortOrder: 'desc'
      });
      setAvailableTags(tags);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const handleCreateTag = async (tagName: string) => {
    if (!user?.id || !tagName.trim()) return;

    setLoading(true);
    try {
      const newTag = await tagService.createTag({
        user_id: user.id,
        name: tagName.trim(),
        category: category || 'general',
        color: getRandomTagColor()
      });

      setAvailableTags([...availableTags, newTag]);
      handleTagSelect(newTag);
      setSearchValue('');
      
      toast({
        title: "Tag created",
        description: `Tag "${tagName}" has been created successfully`
      });
    } catch (error) {
      console.error('Error creating tag:', error);
      toast({
        title: "Error",
        description: "Failed to create tag",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTagSelect = (tag: Tag) => {
    if (!selectedTags.find(t => t.id === tag.id)) {
      onTagsChange([...selectedTags, tag]);
    }
    setIsOpen(false);
    setSearchValue('');
  };

  const handleTagRemove = (tagToRemove: Tag) => {
    onTagsChange(selectedTags.filter(tag => tag.id !== tagToRemove.id));
  };

  const getRandomTagColor = () => {
    const colors = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
      '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const filteredTags = availableTags.filter(tag => 
    !selectedTags.find(selected => selected.id === tag.id) &&
    tag.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const showCreateOption = allowCreate && 
    searchValue.trim() && 
    !filteredTags.find(tag => tag.name.toLowerCase() === searchValue.toLowerCase());

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Selected Tags Display */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1"
              style={{ backgroundColor: `${tag.color}20`, borderColor: tag.color }}
            >
              <TagIcon className="w-3 h-3" style={{ color: tag.color }} />
              <span className="text-sm">{tag.name}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleTagRemove(tag)}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Tag Input */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className="w-full justify-start text-left font-normal"
          >
            <Plus className="w-4 h-4 mr-2" />
            {placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search or create tags..."
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>
                {loading ? (
                  <div className="py-6 text-center text-sm">Loading...</div>
                ) : (
                  <div className="py-6 text-center text-sm">No tags found.</div>
                )}
              </CommandEmpty>
              
              {showCreateOption && (
                <CommandGroup heading="Create New">
                  <CommandItem
                    onSelect={() => handleCreateTag(searchValue)}
                    className="cursor-pointer"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create "{searchValue}"
                  </CommandItem>
                </CommandGroup>
              )}

              {filteredTags.length > 0 && (
                <CommandGroup heading="Available Tags">
                  {filteredTags.map((tag) => (
                    <CommandItem
                      key={tag.id}
                      onSelect={() => handleTagSelect(tag)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-2 w-full">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                        <span className="flex-1">{tag.name}</span>
                        {tag.category && (
                          <Badge variant="outline" className="text-xs">
                            {tag.category}
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500">
                          {tag.usage_count}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
