import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Download, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/hooks/use-toast';
import { leadListService } from '@/utils/leadListService';
import { TagFilter } from '@/components/tags/TagFilter';
import { cn } from '@/lib/utils';

interface DateRange {
  from?: Date;
  to?: Date;
}

interface IncludeFields {
  name: boolean;
  phone: boolean;
  email: boolean;
  qr_id: boolean;
  notes: boolean;
  company: boolean;
  tags: boolean;
  created_at: boolean;
}

interface ExportFilters {
  dateRange: DateRange;
  selectedTags: string[];
  selectedLists: string[];
  includeFields: IncludeFields;
}

export const LeadExportDialog: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'xlsx'>('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [filters, setFilters] = useState<ExportFilters>({
    dateRange: { from: undefined, to: undefined },
    selectedTags: [],
    selectedLists: [],
    includeFields: {
      name: true,
      phone: true,
      email: true,
      qr_id: true,
      notes: true,
      company: true,
      tags: true,
      created_at: true
    }
  });

  const handleFieldToggle = (field: keyof IncludeFields) => {
    setFilters(prev => ({
      ...prev,
      includeFields: {
        ...prev.includeFields,
        [field]: !prev.includeFields[field]
      }
    }));
  };

  const handleDateRangeChange = (key: 'from' | 'to', date?: Date) => {
    setFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [key]: date
      }
    }));
  };

  const handleExport = async () => {
    if (!user) return;

    setIsExporting(true);
    try {
      // For now, we'll export all data as a simple implementation
      // In a real application, you would apply the filters to the query
      const leadLists = await leadListService.getLeadLists(user.id);
      
      let allRecords: any[] = [];
      for (const list of leadLists) {
        const records = await leadListService.getLeadRecords(list.id);
        allRecords = [...allRecords, ...records.map(record => ({
          ...record.data,
          list_name: list.name,
          created_at: record.created_at,
          tags: record.tags
        }))];
      }

      // Filter records based on selected fields
      const filteredRecords = allRecords.map(record => {
        const filteredRecord: any = {};
        Object.keys(filters.includeFields).forEach(field => {
          if (filters.includeFields[field as keyof IncludeFields]) {
            filteredRecord[field] = record[field] || '';
          }
        });
        return filteredRecord;
      });

      // Create CSV content
      if (filteredRecords.length === 0) {
        toast({
          title: "No Data",
          description: "No records found matching your filters",
          variant: "destructive"
        });
        return;
      }

      const headers = Object.keys(filteredRecords[0]);
      const csvContent = [
        headers.join(','),
        ...filteredRecords.map(record => 
          headers.map(header => `"${record[header] || ''}"`).join(',')
        )
      ].join('\n');

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `leads_export_${format(new Date(), 'yyyy-MM-dd')}.${exportFormat}`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      toast({
        title: "Export Successful",
        description: `Exported ${filteredRecords.length} lead records`
      });

      setIsOpen(false);
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export lead data",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Leads
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Lead Data
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Format */}
          <Card>
            <CardHeader>
              <CardTitle>Export Format</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={exportFormat} onValueChange={(value: 'csv' | 'xlsx') => setExportFormat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV (.csv)</SelectItem>
                  <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Date Range Filter */}
          <Card>
            <CardHeader>
              <CardTitle>Date Range</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>From Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !filters.dateRange.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateRange.from ? format(filters.dateRange.from, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.dateRange.from}
                        onSelect={(date) => handleDateRangeChange('from', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !filters.dateRange.to && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateRange.to ? format(filters.dateRange.to, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.dateRange.to}
                        onSelect={(date) => handleDateRangeChange('to', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tag Filter */}
          <Card>
            <CardHeader>
              <CardTitle>Filter by Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <TagFilter
                selectedTags={filters.selectedTags}
                onTagsChange={(tagIds) => setFilters(prev => ({ ...prev, selectedTags: tagIds }))}
              />
            </CardContent>
          </Card>

          {/* Fields to Include */}
          <Card>
            <CardHeader>
              <CardTitle>Fields to Include</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(filters.includeFields).map(([field, checked]) => (
                  <div key={field} className="flex items-center space-x-2">
                    <Checkbox
                      id={field}
                      checked={checked}
                      onCheckedChange={() => handleFieldToggle(field as keyof IncludeFields)}
                    />
                    <Label htmlFor={field} className="capitalize">
                      {field.replace('_', ' ')}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Export Button */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? 'Exporting...' : `Export as ${exportFormat.toUpperCase()}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
