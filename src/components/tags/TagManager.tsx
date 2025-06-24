
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Tag as TagIcon, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { tagService, Tag } from '@/services/tagService';
import { useToast } from '@/hooks/use-toast';

export const TagManager: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tags, setTags] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    color: '#3B82F6',
    category: '',
    description: ''
  });

  useEffect(() => {
    if (user?.id) {
      loadTags();
      loadCategories();
    }
  }, [user, selectedCategory]);

  const loadTags = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const loadedTags = await tagService.getTags(user.id, {
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        searchTerm,
        sortBy: 'usage_count',
        sortOrder: 'desc'
      });
      setTags(loadedTags);
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

  const loadCategories = async () => {
    if (!user?.id) return;
    
    try {
      const cats = await tagService.getTagCategories(user.id);
      setCategories(cats);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleCreateTag = async () => {
    if (!user?.id || !formData.name.trim()) return;

    try {
      setLoading(true);
      const newTag = await tagService.createTag({
        user_id: user.id,
        name: formData.name.trim(),
        color: formData.color,
        category: formData.category || 'general',
        description: formData.description
      });

      setTags([...tags, newTag]);
      setIsCreateDialogOpen(false);
      resetForm();
      
      toast({
        title: "Tag Created",
        description: `Tag "${formData.name}" has been created successfully`
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

  const handleUpdateTag = async () => {
    if (!editingTag || !formData.name.trim()) return;

    try {
      setLoading(true);
      const updatedTag = await tagService.updateTag(editingTag.id, {
        name: formData.name.trim(),
        color: formData.color,
        category: formData.category || 'general',
        description: formData.description
      });

      setTags(tags.map(tag => tag.id === editingTag.id ? updatedTag : tag));
      setEditingTag(null);
      resetForm();
      
      toast({
        title: "Tag Updated",
        description: `Tag "${formData.name}" has been updated successfully`
      });
    } catch (error) {
      console.error('Error updating tag:', error);
      toast({
        title: "Error",
        description: "Failed to update tag",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTag = async (tag: Tag) => {
    if (!confirm(`Are you sure you want to delete the tag "${tag.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      await tagService.deleteTag(tag.id);
      setTags(tags.filter(t => t.id !== tag.id));
      
      toast({
        title: "Tag Deleted",
        description: `Tag "${tag.name}" has been deleted successfully`,
        variant: "destructive"
      });
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast({
        title: "Error",
        description: "Failed to delete tag",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      color: '#3B82F6',
      category: '',
      description: ''
    });
  };

  const openEditDialog = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      color: tag.color,
      category: tag.category || '',
      description: tag.description || ''
    });
  };

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const predefinedCategories = ['general', 'upload', 'status', 'batch', 'source', 'priority'];
  const allCategories = [...new Set([...predefinedCategories, ...categories])];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tag Management</h2>
          <p className="text-gray-600">Create and manage tags for organizing your data</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Tag</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="tag-name">Name *</Label>
                <Input
                  id="tag-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter tag name"
                />
              </div>
              
              <div>
                <Label htmlFor="tag-category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="tag-color">Color</Label>
                <Input
                  id="tag-color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="tag-description">Description</Label>
                <Textarea
                  id="tag-description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter tag description (optional)"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTag} disabled={loading || !formData.name.trim()}>
                  {loading ? 'Creating...' : 'Create Tag'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {allCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tags Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Tags ({filteredTags.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading tags...</div>
          ) : filteredTags.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTags.map((tag) => (
                <div key={tag.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                      style={{ backgroundColor: `${tag.color}20`, borderColor: tag.color }}
                    >
                      <TagIcon className="w-3 h-3" style={{ color: tag.color }} />
                      {tag.name}
                    </Badge>
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
                  
                  <div className="text-sm space-y-1">
                    <div><strong>Category:</strong> {tag.category || 'General'}</div>
                    <div><strong>Usage:</strong> {tag.usage_count} times</div>
                    {tag.description && (
                      <div><strong>Description:</strong> {tag.description}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <TagIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No tags found</p>
              <p>Create your first tag to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingTag} onOpenChange={() => setEditingTag(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-tag-name">Name *</Label>
              <Input
                id="edit-tag-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter tag name"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-tag-category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {allCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="edit-tag-color">Color</Label>
              <Input
                id="edit-tag-color"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-tag-description">Description</Label>
              <Textarea
                id="edit-tag-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter tag description (optional)"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingTag(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateTag} disabled={loading || !formData.name.trim()}>
                {loading ? 'Updating...' : 'Update Tag'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
