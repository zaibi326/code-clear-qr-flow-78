
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, Filter, Calendar as CalendarIcon, Tag, Download, Eye, RefreshCw } from 'lucide-react';
import { leadListService, LeadList, LeadRecord } from '@/utils/leadListService';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export const ViewListTab = () => {
  const { user } = useAuth();
  const [lists, setLists] = useState<LeadList[]>([]);
  const [selectedListId, setSelectedListId] = useState<string>('');
  const [records, setRecords] = useState<LeadRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<LeadRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<Date | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadLists();
    }
  }, [user]);

  useEffect(() => {
    if (selectedListId) {
      loadRecords();
    }
  }, [selectedListId]);

  useEffect(() => {
    applyFilters();
  }, [records, searchQuery, selectedTags, dateFilter]);

  const loadLists = async () => {
    try {
      const data = await leadListService.getLeadLists(user!.id);
      setLists(data);
      if (data.length > 0 && !selectedListId) {
        setSelectedListId(data[0].id);
      }
    } catch (error) {
      console.error('Error loading lists:', error);
    }
  };

  const loadRecords = async () => {
    if (!selectedListId) return;
    
    try {
      setIsLoading(true);
      const data = await leadListService.getLeadRecords(selectedListId);
      setRecords(data);
    } catch (error) {
      console.error('Error loading records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...records];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(record => {
        const searchableText = JSON.stringify(record.data).toLowerCase();
        return searchableText.includes(searchQuery.toLowerCase());
      });
    }

    // Tag filter
    if (selectedTags.length > 0 && !selectedTags.includes('all')) {
      filtered = filtered.filter(record =>
        selectedTags.some(tag => record.tags.includes(tag))
      );
    }

    // Date filter
    if (dateFilter) {
      const filterDate = format(dateFilter, 'yyyy-MM-dd');
      filtered = filtered.filter(record =>
        format(new Date(record.created_at), 'yyyy-MM-dd') === filterDate
      );
    }

    setFilteredRecords(filtered);
  };

  const selectedList = lists.find(list => list.id === selectedListId);
  const allTags = [...new Set(records.flatMap(record => record.tags))];

  const getRecordColumns = () => {
    if (records.length === 0) return [];
    const allKeys = new Set<string>();
    records.forEach(record => {
      Object.keys(record.data).forEach(key => allKeys.add(key));
    });
    return Array.from(allKeys);
  };

  const columns = getRecordColumns();

  return (
    <div className="space-y-6">
      {/* List Selection and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            View List Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* List Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Select List</label>
              <Select value={selectedListId} onValueChange={setSelectedListId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a list" />
                </SelectTrigger>
                <SelectContent>
                  {lists.map((list) => (
                    <SelectItem key={list.id} value={list.id}>
                      {list.name} ({list.record_count} records)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div>
              <label className="text-sm font-medium mb-2 block">Search Records</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search in records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Tag Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Filter by Tags</label>
              <Select value={selectedTags[0] || 'all'} onValueChange={(value) => setSelectedTags(value === 'all' ? [] : [value])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  {allTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Filter by Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateFilter && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFilter ? format(dateFilter, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateFilter}
                    onSelect={setDateFilter}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                Search: {searchQuery}
                <button onClick={() => setSearchQuery('')} className="ml-1">×</button>
              </Badge>
            )}
            {selectedTags.filter(tag => tag !== 'all').map(tag => (
              <Badge key={tag} variant="secondary" className="gap-1">
                <Tag className="w-3 h-3" />
                {tag}
                <button onClick={() => setSelectedTags([])} className="ml-1">×</button>
              </Badge>
            ))}
            {dateFilter && (
              <Badge variant="secondary" className="gap-1">
                Date: {format(dateFilter, 'MMM dd, yyyy')}
                <button onClick={() => setDateFilter(undefined)} className="ml-1">×</button>
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* List Info */}
      {selectedList && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{selectedList.name}</h3>
                <p className="text-sm text-gray-600">
                  {filteredRecords.length} of {records.length} records shown
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={loadRecords}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
          ) : filteredRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    {columns.map((column) => (
                      <TableHead key={column} className="min-w-[120px]">
                        {column.charAt(0).toUpperCase() + column.slice(1)}
                      </TableHead>
                    ))}
                    <TableHead>Tags</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record, index) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      {columns.map((column) => (
                        <TableCell key={column}>
                          {record.data[column] || '-'}
                        </TableCell>
                      ))}
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {record.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(record.created_at), 'MMM dd, yyyy')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center p-8">
              <p className="text-gray-500">
                {selectedListId ? 'No records found matching your filters' : 'Select a list to view records'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
