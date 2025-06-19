
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { tagService, Tag } from '@/services/tagService';

interface UseTagFilterProps {
  selectedTags: string[];
  onTagsChange: (tagIds: string[]) => void;
  category?: string;
}

export const useTagFilter = ({ selectedTags, onTagsChange, category }: UseTagFilterProps) => {
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
      setAvailableTags([]); // Set empty array on error
    }
  };

  const loadCategories = async () => {
    if (!user?.id) return;
    
    try {
      const cats = await tagService.getTagCategories(user.id);
      // Filter out empty strings, null values, and whitespace-only strings
      const validCategories = cats.filter(cat => cat && typeof cat === 'string' && cat.trim() !== '');
      setCategories(validCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]); // Set empty array on error
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

  return {
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
  };
};
