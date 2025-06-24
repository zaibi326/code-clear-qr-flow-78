
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useLeadExportFilters } from '@/hooks/useLeadExportFilters';
import { leadExportService } from '@/utils/leadExportService';
import { ExportFormatSelector } from './export/ExportFormatSelector';
import { DateRangeFilter } from './export/DateRangeFilter';
import { TagFilterCard } from './export/TagFilterCard';
import { FieldSelector } from './export/FieldSelector';

export const LeadExportDialog: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'xlsx'>('csv');
  const [isExporting, setIsExporting] = useState(false);
  
  const {
    filters,
    handleFieldToggle,
    handleDateRangeChange,
    handleTagsChange
  } = useLeadExportFilters();

  console.log('LeadExportDialog rendering with exportFormat:', exportFormat);

  const handleExport = async () => {
    if (!user) return;

    setIsExporting(true);
    const success = await leadExportService.exportLeads(user.id, filters, exportFormat);
    if (success) {
      setIsOpen(false);
    }
    setIsExporting(false);
  };

  const handleFormatChange = (format: 'csv' | 'xlsx') => {
    console.log('LeadExportDialog format change:', format);
    setExportFormat(format);
  };

  console.log('About to render ExportFormatSelector');

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
          <ExportFormatSelector
            exportFormat={exportFormat}
            onFormatChange={handleFormatChange}
          />

          <DateRangeFilter
            dateRange={filters.dateRange}
            onDateRangeChange={handleDateRangeChange}
          />

          <TagFilterCard
            selectedTags={filters.selectedTags}
            onTagsChange={handleTagsChange}
          />

          <FieldSelector
            includeFields={filters.includeFields}
            onFieldToggle={handleFieldToggle}
          />

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
