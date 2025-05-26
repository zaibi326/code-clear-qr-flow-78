
import { 
  DatabaseUser, 
  DatabaseTemplate, 
  DatabaseCampaign, 
  DatabaseQRCode, 
  DatabaseScanEvent,
  DatabaseProject 
} from '@/types/database';

export interface DatabaseQuery {
  table: string;
  filters?: Record<string, any>;
  sort?: { field: string; direction: 'asc' | 'desc' };
  limit?: number;
  offset?: number;
}

export interface DatabaseInsert {
  table: string;
  data: Record<string, any>;
}

export interface DatabaseUpdate {
  table: string;
  id: string;
  data: Record<string, any>;
}

export class DatabaseService {
  private static instance: DatabaseService;
  private data: Map<string, any[]> = new Map();

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
      DatabaseService.instance.initializeMockData();
    }
    return DatabaseService.instance;
  }

  private initializeMockData() {
    // Initialize with mock data for demonstration
    this.data.set('users', []);
    this.data.set('templates', []);
    this.data.set('campaigns', []);
    this.data.set('qr_codes', []);
    this.data.set('scan_events', []);
    this.data.set('projects', []);
  }

  async query<T>(query: DatabaseQuery): Promise<T[]> {
    try {
      let results = this.data.get(query.table) || [];

      // Apply filters
      if (query.filters) {
        results = results.filter(item => {
          return Object.entries(query.filters!).every(([key, value]) => {
            if (Array.isArray(value)) {
              return value.includes(item[key]);
            }
            return item[key] === value;
          });
        });
      }

      // Apply sorting
      if (query.sort) {
        results.sort((a, b) => {
          const aVal = a[query.sort!.field];
          const bVal = b[query.sort!.field];
          const direction = query.sort!.direction === 'asc' ? 1 : -1;
          
          if (aVal < bVal) return -1 * direction;
          if (aVal > bVal) return 1 * direction;
          return 0;
        });
      }

      // Apply pagination
      if (query.offset) {
        results = results.slice(query.offset);
      }
      if (query.limit) {
        results = results.slice(0, query.limit);
      }

      return results as T[];
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Failed to execute query');
    }
  }

  async insert(insert: DatabaseInsert): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const table = this.data.get(insert.table) || [];
      const id = `${insert.table}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const record = {
        id,
        ...insert.data,
        created_at: new Date(),
        updated_at: new Date()
      };

      table.push(record);
      this.data.set(insert.table, table);

      return { success: true, id };
    } catch (error) {
      console.error('Database insert error:', error);
      return { success: false, error: 'Failed to insert record' };
    }
  }

  async update(update: DatabaseUpdate): Promise<{ success: boolean; error?: string }> {
    try {
      const table = this.data.get(update.table) || [];
      const index = table.findIndex(item => item.id === update.id);

      if (index === -1) {
        return { success: false, error: 'Record not found' };
      }

      table[index] = {
        ...table[index],
        ...update.data,
        updated_at: new Date()
      };

      this.data.set(update.table, table);
      return { success: true };
    } catch (error) {
      console.error('Database update error:', error);
      return { success: false, error: 'Failed to update record' };
    }
  }

  async delete(table: string, id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const tableData = this.data.get(table) || [];
      const filtered = tableData.filter(item => item.id !== id);
      
      this.data.set(table, filtered);
      return { success: true };
    } catch (error) {
      console.error('Database delete error:', error);
      return { success: false, error: 'Failed to delete record' };
    }
  }

  async findById<T>(table: string, id: string): Promise<T | null> {
    try {
      const tableData = this.data.get(table) || [];
      const record = tableData.find(item => item.id === id);
      return record as T || null;
    } catch (error) {
      console.error('Database findById error:', error);
      return null;
    }
  }

  async count(table: string, filters?: Record<string, any>): Promise<number> {
    try {
      let results = this.data.get(table) || [];

      if (filters) {
        results = results.filter(item => {
          return Object.entries(filters).every(([key, value]) => {
            if (Array.isArray(value)) {
              return value.includes(item[key]);
            }
            return item[key] === value;
          });
        });
      }

      return results.length;
    } catch (error) {
      console.error('Database count error:', error);
      return 0;
    }
  }

  // Specialized methods for analytics
  async getUserAnalytics(userId: string, timeRange: string): Promise<any> {
    try {
      const campaigns = await this.query<DatabaseCampaign>({
        table: 'campaigns',
        filters: { user_id: userId }
      });

      const qrCodes = await this.query<DatabaseQRCode>({
        table: 'qr_codes',
        filters: { user_id: userId }
      });

      const scans = await this.query<DatabaseScanEvent>({
        table: 'scan_events',
        filters: { user_id: userId }
      });

      return {
        campaigns: campaigns.length,
        qr_codes: qrCodes.length,
        total_scans: scans.length,
        unique_scans: new Set(scans.map(s => s.ip_address)).size,
        recent_scans: scans.slice(-10)
      };
    } catch (error) {
      console.error('Analytics query error:', error);
      return null;
    }
  }

  async getCampaignAnalytics(campaignId: string): Promise<any> {
    try {
      const qrCodes = await this.query<DatabaseQRCode>({
        table: 'qr_codes',
        filters: { campaign_id: campaignId }
      });

      const scans = await this.query<DatabaseScanEvent>({
        table: 'scan_events',
        filters: { campaign_id: campaignId }
      });

      const deviceBreakdown = scans.reduce((acc, scan) => {
        const device = scan.device.type;
        acc[device] = (acc[device] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const locationBreakdown = scans.reduce((acc, scan) => {
        const country = scan.location?.country || 'Unknown';
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        qr_codes: qrCodes.length,
        total_scans: scans.length,
        unique_scans: new Set(scans.map(s => s.ip_address)).size,
        device_breakdown: deviceBreakdown,
        location_breakdown: locationBreakdown,
        scan_timeline: this.groupScansByDate(scans)
      };
    } catch (error) {
      console.error('Campaign analytics error:', error);
      return null;
    }
  }

  private groupScansByDate(scans: DatabaseScanEvent[]): Record<string, number> {
    return scans.reduce((acc, scan) => {
      const date = scan.timestamp.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  // Backup and restore methods
  async exportData(userId: string): Promise<any> {
    try {
      const userData = await this.query<DatabaseUser>({
        table: 'users',
        filters: { id: userId }
      });

      const templates = await this.query<DatabaseTemplate>({
        table: 'templates',
        filters: { user_id: userId }
      });

      const campaigns = await this.query<DatabaseCampaign>({
        table: 'campaigns',
        filters: { user_id: userId }
      });

      const qrCodes = await this.query<DatabaseQRCode>({
        table: 'qr_codes',
        filters: { user_id: userId }
      });

      return {
        user: userData[0],
        templates,
        campaigns,
        qr_codes,
        exported_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Data export error:', error);
      throw new Error('Failed to export data');
    }
  }

  async getDatabaseStats(): Promise<any> {
    try {
      const stats = {};
      
      for (const [table, data] of this.data.entries()) {
        stats[table] = {
          count: data.length,
          size: JSON.stringify(data).length
        };
      }

      return stats;
    } catch (error) {
      console.error('Database stats error:', error);
      return {};
    }
  }
}

export const databaseService = DatabaseService.getInstance();
