
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, Plus, Search, FileText, Users, Calendar, Tag } from 'lucide-react';
import { leadListService, LeadList } from '@/utils/leadListService';
import { useAuth } from '@/hooks/useSupabaseAuth';

export function LeadListManager() {
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
      console.error('Error loading lead lists:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateList = async () => {
    if (!user) return;
    
    try {
      const newList = await leadListService.createLeadList({
        user_id: user.id,
        name: 'New Lead List',
        description: 'Description for new list',
        file_type: 'csv',
        record_count: 0,
        tags: [],
        import_date: new Date().toISOString(),
        status: 'active' as const
      });
      
      setLists(prev => [newList, ...prev] as LeadList[]);
    } catch (error) {
      console.error('Error creating lead list:', error);
    }
  };

  const filteredLists = lists.filter(list =>
    list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    list.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRecords = lists.reduce((sum, list) => sum + list.record_count, 0);
  const activeLists = lists.filter(list => list.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
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

      {/* Actions Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex gap-2">
              <Button onClick={handleCreateList} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create List
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Import CSV
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export All
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search lists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
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
              <p className="text-sm text-gray-600 line-clamp-2">{list.description}</p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Records:</span>
                  <span className="font-medium">{list.record_count.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium uppercase">{list.file_type || 'CSV'}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">
                    {new Date(list.created_at).toLocaleDateString()}
                  </span>
                </div>

                {list.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {list.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
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
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLists.length === 0 && !isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Lead Lists Found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery ? 'No lists match your search criteria.' : 'Get started by creating your first lead list.'}
            </p>
            {!searchQuery && (
              <Button onClick={handleCreateList}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First List
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
