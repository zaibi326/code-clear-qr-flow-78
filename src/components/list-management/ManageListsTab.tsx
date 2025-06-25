
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, FileText, Users, Calendar, Tag, Edit, Trash2 } from 'lucide-react';
import { leadListService, LeadList } from '@/utils/leadListService';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { format } from 'date-fns';

export const ManageListsTab = () => {
  const { user } = useAuth();
  const [lists, setLists] = useState<LeadList[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadLists();
    }
  }, [user]);

  const loadLists = async () => {
    try {
      setIsLoading(true);
      const data = await leadListService.getLeadLists(user!.id);
      setLists(data);
    } catch (error) {
      console.error('Error loading lists:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLists = lists.filter(list =>
    list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    list.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    list.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalRecords = lists.reduce((sum, list) => sum + list.record_count, 0);
  const activeLists = lists.filter(list => list.status === 'active').length;

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading lists...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-50">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Lists</p>
                <p className="text-2xl font-bold">{lists.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-50">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Records</p>
                <p className="text-2xl font-bold">{totalRecords.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-50">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Lists</p>
                <p className="text-2xl font-bold">{activeLists}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search lists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Records to List
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLists.map((list) => (
          <Card key={list.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg truncate">{list.name}</CardTitle>
                <Badge 
                  variant={list.status === 'active' ? 'default' : 'secondary'}
                  className="ml-2"
                >
                  {list.status}
                </Badge>
              </div>
              {list.description && (
                <p className="text-sm text-gray-600 line-clamp-2">{list.description}</p>
              )}
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Records:</span>
                  <span className="font-medium">{list.record_count.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium uppercase">{list.file_type || 'Manual'}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">
                    {format(new Date(list.created_at), 'MMM dd, yyyy')}
                  </span>
                </div>

                {list.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {list.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                    {list.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{list.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLists.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Lists Found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery ? 'No lists match your search criteria.' : 'Get started by creating your first list.'}
            </p>
            {!searchQuery && (
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First List
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
