
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, Download, Plus, Search, Tag, Users, FileText } from 'lucide-react';
import { leadListService, LeadList } from '@/utils/leadListService';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';

export function LeadListManager() {
  const { user } = useAuth();
  const [leadLists, setLeadLists] = useState<LeadList[]>([]);
  const [selectedList, setSelectedList] = useState<LeadList | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadLeadLists();
    }
  }, [user]);

  const loadLeadLists = async () => {
    try {
      setLoading(true);
      const data = await leadListService.getLeadLists(user!.id);
      setLeadLists(data || []);
    } catch (error) {
      console.error('Error loading lead lists:', error);
      toast.error('Failed to load lead lists');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const csvData = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const record: Record<string, any> = {};
        headers.forEach((header, index) => {
          record[header] = values[index] || '';
        });
        return record;
      }).filter(record => Object.values(record).some(v => v)); // Filter empty rows

      // Create lead list
      const listData = {
        user_id: user!.id,
        name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        description: `Imported from ${file.name}`,
        file_type: file.name.split('.').pop() || 'csv',
        record_count: csvData.length,
        tags: ['imported'],
        status: 'active' as const
      };

      const newList = await leadListService.createLeadList(listData);
      await leadListService.importCSVData(newList.id, csvData, user!.id);
      
      toast.success(`Successfully imported ${csvData.length} records`);
      loadLeadLists();
    } catch (error) {
      console.error('Error importing file:', error);
      toast.error('Failed to import file');
    }
  };

  const exportList = async (list: LeadList) => {
    try {
      const data = await leadListService.exportLeadData(list.id);
      const csv = convertToCSV(data);
      downloadCSV(csv, `${list.name}_export.csv`);
      toast.success('List exported successfully');
    } catch (error) {
      console.error('Error exporting list:', error);
      toast.error('Failed to export list');
    }
  };

  const convertToCSV = (data: any[]) => {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0].data);
    const csvContent = [
      headers.join(','),
      ...data.map(record => 
        headers.map(header => `"${record.data[header] || ''}"`).join(',')
      )
    ].join('\n');
    
    return csvContent;
  };

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLists = leadLists.filter(list =>
    list.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    list.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Lead List Management
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="flex items-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                Import CSV/XLS
              </label>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="lists" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="lists">My Lists</TabsTrigger>
            <TabsTrigger value="records">Records</TabsTrigger>
          </TabsList>
          
          <TabsContent value="lists" className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search lists..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLists.map((list) => (
                <Card key={list.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{list.name}</h3>
                        <p className="text-sm text-gray-600">{list.description}</p>
                      </div>
                      <Badge variant={list.status === 'active' ? 'default' : 'secondary'}>
                        {list.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {list.record_count} records
                      </span>
                      <span className="text-gray-500">{list.file_type?.toUpperCase()}</span>
                    </div>
                    
                    <div className="flex gap-1 flex-wrap">
                      {list.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedList(list)}
                        className="flex-1"
                      >
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportList(list)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="records">
            {selectedList ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{selectedList.name} Records</h3>
                  <Button variant="outline" onClick={() => exportList(selectedList)}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
                <div className="text-sm text-gray-600">
                  {selectedList.record_count} total records
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Select a list from the "My Lists" tab to view its records
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
