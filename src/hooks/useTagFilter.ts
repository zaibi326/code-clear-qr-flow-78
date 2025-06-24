
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
      console.log('useTagFilter: Loading tags for category:', selectedCategory);
      const tags = await tagService.getTags(user.id, {
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        sortBy: 'usage_count',
        sortOrder: 'desc'
      });
      
      // Enhanced validation for tags
      const validTags = tags.filter(tag => {
        const isValid = tag && 
                       typeof tag === 'object' && 
                       tag.id && 
                       typeof tag.id === 'string' && 
                       tag.id.trim() !== '' &&
                       tag.name && 
                       typeof tag.name === 'string' && 
                       tag.name.trim() !== '';
        if (!isValid) {
          console.error('useTagFilter: Invalid tag detected:', tag);
        }
        return isValid;
      });
      
      console.log('useTagFilter: Valid tags loaded:', validTags.length);
      setAvailableTags(validTags);
    } catch (error) {
      console.error('useTagFilter: Error loading tags:', error);
      setAvailableTags([]); // Set empty array on error
    }
  };

  const loadCategories = async () => {
    if (!user?.id) return;
    
    try {
      console.log('useTagFilter: Loading categories');
      const cats = await tagService.getTagCategories(user.id);
      
      // Enhanced validation for categories
      const validCategories = cats.filter(cat => {
        const isValid = cat && 
                       typeof cat === 'string' && 
                       cat.trim() !== '';
        if (!isValid) {
          console.error('useTagFilter: Invalid category detected:', cat);
        }
        return isValid;
      });
      
      console.log('useTagFilter: Valid categories loaded:', validCategories);
      setCategories(validCategories);
    } catch (error) {
      console.error('useTagFilter: Error loading categories:', error);
      setCategories([]); // Set empty array on error
    }
  };

  const handleTagToggle = (tagId: string) => {
    if (!tagId || typeof tagId !== 'string' || tagId.trim() === '') {
      console.error('useTagFilter: Invalid tagId for toggle:', tagId);
      return;
    }
    
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
