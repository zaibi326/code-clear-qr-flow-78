
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Tag as TagIcon, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { tagService, Tag, TagFilter } from '@/services/tagService';
import { toast } from '@/hooks/use-toast';

const TAG_COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
  '#8B5CF6', '#06B6D4', '#84CC16', '#F97316',
  '#EC4899', '#6366F1', '#14B8A6', '#F59E0B'
];

const TAG_CATEGORIES = [
  'campaign', 'source', 'region', 'date', 'status', 
  'priority', 'channel', 'product', 'audience', 'general'
];

export const TagManager: React.FC = () => {
  const { user } = useAuth();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TagFilter>({
    sortBy: 'usage_count',
    sortOrder: 'desc'
  });
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    color: TAG_COLORS[0],
    category: 'general',
    description: ''
  });

  useEffect(() => {
    if (user?.id) {
      loadTags();
    }
  }, [user, filters]);

  const loadTags = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const data = await tagService.getTags(user.id, filters);
      setTags(data);
    } catch (error) {
      console.error('Error loading tags:', error);
      toast({
        title: "Error",
        description: "Failed to load tags",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async () => {
    if (!user?.id || !formData.name.trim()) return;

    try {
      const newTag = await tagService.createTag({
        user_id: user.id,
        name: formData.name.trim(),
        color: formData.color,
        category: formData.category,
        description: formData.description
      });

      setTags([newTag, ...tags]);
      setIsCreateDialogOpen(false);
      resetForm();
      
      toast({
        title: "Success",
        description: "Tag created successfully"
      });
    } catch (error) {
      console.error('Error creating tag:', error);
      toast({
        title: "Error",
        description: "Failed to create tag",
        variant: "destructive"
      });
    }
  };

  const handleUpdateTag = async () => {
    if (!editingTag) return;

    try {
      const updatedTag = await tagService.updateTag(editingTag.id, {
        name: formData.name.trim(),
        color: formData.color,
        category: formData.category,
        description: formData.description
      });

      setTags(tags.map(tag => tag.id === editingTag.id ? updatedTag : tag));
      setEditingTag(null);
      resetForm();
      
      toast({
        title: "Success",
        description: "Tag updated successfully"
      });
    } catch (error) {
      console.error('Error updating tag:', error);
      toast({
        title: "Error",
        description: "Failed to update tag",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTag = async (tag: Tag) => {
    if (!confirm(`Are you sure you want to delete the tag "${tag.name}"?`)) return;

    try {
      await tagService.deleteTag(tag.id);
      setTags(tags.filter(t => t.id !== tag.id));
      
      toast({
        title: "Success",
        description: "Tag deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast({
        title: "Error",
        description: "Failed to delete tag",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      color: TAG_COLORS[0],
      category: 'general',
      description: ''
    });
  };

  const openEditDialog = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      color: tag.color,
      category: tag.category || 'general',
      description: tag.description || ''
    });
  };

  const TagForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Tag Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter tag name"
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TAG_CATEGORIES.map(category => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="color">Color</Label>
        <div className="flex gap-2 mt-2">
          {TAG_COLORS.map(color => (
            <button
              key={color}
              type="button"
              className={`w-8 h-8 rounded-full border-2 ${
                formData.color === color ? 'border-gray-900' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setFormData({ ...formData, color })}
            />
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter tag description"
          rows={3}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button 
          variant="outline" 
          onClick={() => {
            setIsCreateDialogOpen(false);
            setEditingTag(null);
            resetForm();
          }}
        >
          Cancel
        </Button>
        <Button onClick={editingTag ? handleUpdateTag : handleCreateTag}>
          {editingTag ? 'Update' : 'Create'} Tag
        </Button>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TagIcon className="w-5 h-5" />
            Tag Management
          </CardTitle>
          <Dialog open={isCreateDialogOpen || !!editingTag} onOpenChange={(open) => {
            setIsCreateDialogOpen(open);
            if (!open) {
              setEditingTag(null);
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Tag
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingTag ? 'Edit Tag' : 'Create New Tag'}
                </DialogTitle>
              </DialogHeader>
              <TagForm />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search tags..."
              value={filters.searchTerm || ''}
              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
            />
          </div>
          <Select 
            value={filters.category || 'all'} 
            onValueChange={(value) => setFilters({ ...filters, category: value === 'all' ? undefined : value })}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {TAG_CATEGORIES.map(category => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select 
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onValueChange={(value) => {
              const [sortBy, sortOrder] = value.split('-') as [string, 'asc' | 'desc'];
              setFilters({ ...filters, sortBy: sortBy as any, sortOrder });
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name A-Z</SelectItem>
              <SelectItem value="name-desc">Name Z-A</SelectItem>
              <SelectItem value="usage_count-desc">Most Used</SelectItem>
              <SelectItem value="usage_count-asc">Least Used</SelectItem>
              <SelectItem value="created_at-desc">Newest</SelectItem>
              <SelectItem value="created_at-asc">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tags Grid */}
        {loading ? (
          <div className="text-center py-8">Loading tags...</div>
        ) : tags.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No tags found. Create your first tag to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tags.map((tag) => (
              <Card key={tag.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                      <h3 className="font-medium">{tag.name}</h3>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(tag)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTag(tag)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {tag.category && (
                    <Badge variant="outline" className="mb-2">
                      {tag.category}
                    </Badge>
                  )}
                  
                  {tag.description && (
                    <p className="text-sm text-gray-600 mb-2">{tag.description}</p>
                  )}
                  
                  <div className="text-sm text-gray-500">
                    Used {tag.usage_count} times
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
