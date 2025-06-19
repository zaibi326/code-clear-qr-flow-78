
import { format } from 'date-fns';
import { leadListService } from '@/utils/leadListService';
import { toast } from '@/hooks/use-toast';

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
  dateRange: { from?: Date; to?: Date };
  selectedTags: string[];
  selectedLists: string[];
  includeFields: IncludeFields;
}

export const leadExportService = {
  async exportLeads(
    userId: string,
    filters: ExportFilters,
    exportFormat: 'csv' | 'xlsx'
  ): Promise<boolean> {
    try {
      // Get all lead lists for the user
      const leadLists = await leadListService.getLeadLists(userId);
      
      let allRecords: any[] = [];
      for (const list of leadLists) {
        const records = await leadListService.getLeadRecords(list.id);
        // Ensure records is an array before processing
        if (Array.isArray(records)) {
          const mappedRecords = records.map(record => {
            // Safely extract data from record
            const recordData = (typeof record.data === 'object' && record.data !== null) ? record.data : {};
            
            return {
              ...recordData,
              list_name: list.name,
              created_at: record.created_at,
              tags: record.tags
            };
          });
          
          // Use push with spread to concatenate arrays safely
          allRecords.push(...mappedRecords);
        }
      }

      // Filter records based on selected fields
      const filteredRecords = allRecords.map(record => {
        const filteredRecord: any = {};
        Object.keys(filters.includeFields).forEach(field => {
          const typedField = field as keyof IncludeFields;
          if (filters.includeFields[typedField]) {
            filteredRecord[field] = record[field] || '';
          }
        });
        return filteredRecord;
      });

      if (filteredRecords.length === 0) {
        toast({
          title: "No Data",
          description: "No records found matching your filters",
          variant: "destructive"
        });
        return false;
      }

      // Create CSV content
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

      return true;
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export lead data",
        variant: "destructive"
      });
      return false;
    }
  }
};
