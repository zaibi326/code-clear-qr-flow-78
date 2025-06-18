
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, FileSpreadsheet, Users, Calendar, Tag as TagIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { leadListService, LeadList } from '@/utils/leadListService';
import { LeadImportDialog } from './LeadImportDialog';
import { LeadExportDialog } from './LeadExportDialog';
import { format } from 'date-fns';

export const LeadListManager: React.FC = () => {
  const { user } = useAuth();
  const [leadLists, setLeadLists] = useState<LeadList[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user) {
      loadLeadLists();
    }
  }, [user]);

  const loadLeadLists = async () => {
    if (!user) return;
    
    try {
      const lists = await leadListService.getLeadLists(user.id);
      setLeadLists(lists);
    } catch (error) {
      console.error('Error loading lead lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLists = leadLists.filter(list =>
    list.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    list.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRecords = leadLists.reduce((sum, list) => sum + list.record_count, 0);

  if (loading) {
    return <div className="flex justify-center p-8">Loading lead lists...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Lead Lists</h2>
          <p className="text-gray-600">Manage and organize your imported lead data</p>
        </div>
        <div className="flex gap-2">
          <LeadExportDialog />
          <LeadImportDialog />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Lists</p>
                <p className="text-2xl font-bold">{leadLists.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold">{totalRecords.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active Lists</p>
                <p className="text-2xl font-bold">
                  {leadLists.filter(list => list.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search lead lists..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Lead Lists Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Lead Lists</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredLists.length === 0 ? (
            <div className="text-center py-8">
              <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No lead lists found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No lists match your search criteria' : 'Get started by importing your first lead list'}
              </p>
              {!searchTerm && <LeadImportDialog />}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>List Name</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Import Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLists.map((list) => (
                  <TableRow key={list.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{list.name}</div>
                        {list.description && (
                          <div className="text-sm text-gray-500">{list.description}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{list.record_count.toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {list.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            <TagIcon className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {list.tags.length === 0 && (
                          <span className="text-sm text-gray-400">No tags</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={list.status === 'active' ? 'default' : 'secondary'}
                        className={list.status === 'active' ? 'bg-green-100 text-green-700' : ''}
                      >
                        {list.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {format(new Date(list.import_date), 'MMM dd, yyyy')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          Export
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
