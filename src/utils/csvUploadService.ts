
import { databaseService } from './databaseService';

export interface CSVUploadResult {
  success: boolean;
  recordsProcessed: number;
  errors: string[];
  data?: any[];
}

export class CSVUploadService {
  static async parseCSV(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n').filter(line => line.trim());
          
          if (lines.length < 2) {
            reject(new Error('CSV must have at least a header row and one data row'));
            return;
          }

          const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
          const data = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
            const row: any = {};
            headers.forEach((header, index) => {
              row[header] = values[index] || '';
            });
            return row;
          });

          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  static async uploadProjectData(userId: string, csvData: any[]): Promise<CSVUploadResult> {
    const errors: string[] = [];
    let recordsProcessed = 0;

    for (const row of csvData) {
      try {
        if (!row.name || !row.name.trim()) {
          errors.push(`Row ${recordsProcessed + 1}: Project name is required`);
          continue;
        }

        const result = await databaseService.insert({
          table: 'projects',
          data: {
            user_id: userId,
            name: row.name.trim(),
            description: row.description || '',
            color: row.color || '#3B82F6'
          }
        });

        if (result.success) {
          recordsProcessed++;
        } else {
          errors.push(`Row ${recordsProcessed + 1}: ${result.error}`);
        }
      } catch (error) {
        errors.push(`Row ${recordsProcessed + 1}: ${error.message}`);
      }
    }

    return {
      success: errors.length === 0,
      recordsProcessed,
      errors,
      data: csvData
    };
  }

  static async uploadCampaignData(userId: string, csvData: any[]): Promise<CSVUploadResult> {
    const errors: string[] = [];
    let recordsProcessed = 0;

    for (const row of csvData) {
      try {
        if (!row.name || !row.name.trim()) {
          errors.push(`Row ${recordsProcessed + 1}: Campaign name is required`);
          continue;
        }

        const result = await databaseService.insert({
          table: 'campaigns',
          data: {
            user_id: userId,
            name: row.name.trim(),
            description: row.description || '',
            status: row.status || 'draft',
            type: row.type || 'single'
          }
        });

        if (result.success) {
          recordsProcessed++;
        } else {
          errors.push(`Row ${recordsProcessed + 1}: ${result.error}`);
        }
      } catch (error) {
        errors.push(`Row ${recordsProcessed + 1}: ${error.message}`);
      }
    }

    return {
      success: errors.length === 0,
      recordsProcessed,
      errors,
      data: csvData
    };
  }
}
