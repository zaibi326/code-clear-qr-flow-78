
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, Plus, X, FileSpreadsheet } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { leadListService } from '@/utils/leadListService';
import { useToast } from '@/hooks/use-toast';

export const CreateListTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [listName, setListName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setUploadedFile(acceptedFiles[0]);
      }
    }
  });

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleCreateList = async () => {
    if (!user || !listName.trim()) {
      toast({
        title: "Error",
        description: "Please provide a list name",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      const newList = await leadListService.createLeadList({
        user_id: user.id,
        name: listName.trim(),
        description: description.trim() || undefined,
        file_type: uploadedFile ? uploadedFile.name.split('.').pop() || 'csv' : 'manual',
        record_count: 0,
        tags,
        import_date: new Date().toISOString(),
        status: 'active'
      });

      toast({
        title: "Success",
        description: `List "${listName}" created successfully`,
      });

      // Reset form
      setListName('');
      setDescription('');
      setTags([]);
      setUploadedFile(null);
    } catch (error) {
      console.error('Error creating list:', error);
      toast({
        title: "Error",
        description: "Failed to create list",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* List Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              List Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="listName">List Name *</Label>
              <Input
                id="listName"
                placeholder="e.g., March Properties, NOC Group 5"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of this list..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label>Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button onClick={addTag} size="sm">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Data File (Optional)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              {uploadedFile ? (
                <div>
                  <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600">
                    {isDragActive ? 'Drop the file here...' : 'Drag & drop a CSV/Excel file here, or click to select'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Supports .csv, .xlsx, .xls files
                  </p>
                </div>
              )}
            </div>
            
            {uploadedFile && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setUploadedFile(null)}
              >
                Remove File
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleCreateList}
          disabled={!listName.trim() || isCreating}
          className="px-8"
        >
          {isCreating ? 'Creating...' : 'Create List'}
        </Button>
      </div>
    </div>
  );
};
