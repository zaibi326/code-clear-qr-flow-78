
import { supabase } from '@/integrations/supabase/client';

export interface CsvImportResult {
  success: boolean;
  recordsProcessed: number;
  errors: string[];
  listId?: string;
}

export interface FieldMapping {
  csvField: string;
  targetField: string;
}

export interface ExportOptions {
  format: 'csv' | 'xlsx';
  includeFields: string[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  tagIds?: string[];
  listIds?: string[];
}

export class EnhancedCsvService {
  // Import CSV data with field mapping
  static async importLeadsFromCsv(
    userId: string,
    csvData: any[],
    fieldMappings: FieldMapping[],
    listName: string,
    tags: string[] = []
  ): Promise<CsvImportResult> {
    try {
      // Create lead list
      const { data: leadList, error: listError } = await supabase
        .from('lead_lists')
        .insert({
          user_id: userId,
          name: listName,
          record_count: csvData.length,
          tags,
          status: 'active'
        })
        .select()
        .single();

      if (listError) throw listError;

      // Transform data according to mappings
      const transformedData = csvData.map(row => {
        const mappedData: any = {};
        fieldMappings.forEach(mapping => {
          if (mapping.targetField !== 'skip') {
            mappedData[mapping.targetField] = row[mapping.csvField] || '';
          }
        });
        return {
          list_id: leadList.id,
          user_id: userId,
          data: mappedData,
          tags
        };
      });

      // Import records in batches
      const batchSize = 100;
      let processedRecords = 0;
      const errors: string[] = [];

      for (let i = 0; i < transformedData.length; i += batchSize) {
        const batch = transformedData.slice(i, i + batchSize);
        
        try {
          const { error } = await supabase
            .from('lead_records')
            .insert(batch);

          if (error) {
            errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error.message}`);
          } else {
            processedRecords += batch.length;
          }
        } catch (batchError) {
          errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${batchError}`);
        }
      }

      // Update final record count
      await supabase
        .from('lead_lists')
        .update({ record_count: processedRecords })
        .eq('id', leadList.id);

      return {
        success: errors.length === 0,
        recordsProcessed: processedRecords,
        errors,
        listId: leadList.id
      };

    } catch (error) {
      return {
        success: false,
        recordsProcessed: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error occurred']
      };
    }
  }

  // Export leads with filtering
  static async exportLeads(
    userId: string,
    options: ExportOptions
  ): Promise<{ success: boolean; data?: any[]; error?: string }> {
    try {
      let query = supabase
        .from('lead_records')
        .select(`
          *,
          lead_lists!inner(name, user_id)
        `)
        .eq('lead_lists.user_id', userId);

      // Apply date range filter
      if (options.dateRange) {
        if (options.dateRange.from) {
          query = query.gte('created_at', options.dateRange.from.toISOString());
        }
        if (options.dateRange.to) {
          query = query.lte('created_at', options.dateRange.to.toISOString());
        }
      }

      // Apply list filter
      if (options.listIds && options.listIds.length > 0) {
        query = query.in('list_id', options.listIds);
      }

      const { data: records, error } = await query;
      
      if (error) throw error;

      // Transform data for export
      const exportData = records?.map(record => {
        const exportRecord: any = {};
        
        // Include selected fields
        options.includeFields.forEach(field => {
          switch (field) {
            case 'list_name':
              exportRecord.list_name = record.lead_lists?.name;
              break;
            case 'created_at':
              exportRecord.created_at = record.created_at;
              break;
            case 'tags':
              exportRecord.tags = record.tags.join(', ');
              break;
            default:
              exportRecord[field] = record.data[field] || '';
          }
        });

        return exportRecord;
      }) || [];

      return { success: true, data: exportData };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Export failed'
      };
    }
  }

  // Generate CSV content from data
  static generateCsvContent(data: any[]): string {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header] || '';
          // Escape quotes and wrap in quotes if contains comma, quote, or newline
          const escaped = value.toString().replace(/"/g, '""');
          return /[",\n\r]/.test(escaped) ? `"${escaped}"` : escaped;
        }).join(',')
      )
    ].join('\n');

    return csvContent;
  }

  // Download file helper
  static downloadFile(content: string, filename: string, mimeType: string = 'text/csv') {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }
}
