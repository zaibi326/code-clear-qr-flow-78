
import { databaseService } from './databaseService';

export interface ExportOptions {
  format: 'csv' | 'json' | 'xlsx';
  includeProjects?: boolean;
  includeCampaigns?: boolean;
  includeQRCodes?: boolean;
  includeAnalytics?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export class DataExportService {
  static async exportUserData(userId: string, options: ExportOptions): Promise<Blob> {
    const exportData: any = {
      exported_at: new Date().toISOString(),
      user_id: userId,
      format: options.format
    };

    if (options.includeProjects) {
      const projects = await databaseService.query({
        table: 'projects',
        filters: { user_id: userId }
      });
      exportData.projects = projects;
    }

    if (options.includeCampaigns) {
      const campaigns = await databaseService.query({
        table: 'campaigns',
        filters: { user_id: userId }
      });
      exportData.campaigns = campaigns;
    }

    if (options.includeQRCodes) {
      const qrCodes = await databaseService.query({
        table: 'qr_codes',
        filters: { user_id: userId }
      });
      exportData.qr_codes = qrCodes;
    }

    if (options.includeAnalytics) {
      const analytics = await databaseService.getUserAnalytics(userId, '30d');
      exportData.analytics = analytics;
    }

    return this.convertToFormat(exportData, options.format);
  }

  private static convertToFormat(data: any, format: string): Blob {
    switch (format) {
      case 'json':
        return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      case 'csv':
        return this.convertToCSV(data);
      default:
        return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    }
  }

  private static convertToCSV(data: any): Blob {
    const csvLines: string[] = [];
    
    // Add projects CSV
    if (data.projects?.length) {
      csvLines.push('=== PROJECTS ===');
      csvLines.push('ID,Name,Description,Created At,Status');
      data.projects.forEach((project: any) => {
        csvLines.push(`${project.id},"${project.name}","${project.description || ''}",${project.created_at},${project.status || 'active'}`);
      });
      csvLines.push('');
    }

    // Add campaigns CSV
    if (data.campaigns?.length) {
      csvLines.push('=== CAMPAIGNS ===');
      csvLines.push('ID,Name,Description,Status,Created At,QR Codes Count');
      data.campaigns.forEach((campaign: any) => {
        csvLines.push(`${campaign.id},"${campaign.name}","${campaign.description || ''}",${campaign.status},${campaign.created_at},${campaign.qr_codes?.length || 0}`);
      });
      csvLines.push('');
    }

    return new Blob([csvLines.join('\n')], { type: 'text/csv' });
  }

  static downloadFile(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
