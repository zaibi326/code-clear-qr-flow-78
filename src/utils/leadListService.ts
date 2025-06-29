
import { supabase } from '@/integrations/supabase/client';

export interface LeadList {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  file_url?: string;
  file_type?: string;
  record_count: number;
  tags: string[];
  import_date: string;
  status: 'active' | 'archived' | 'processing';
  created_at: string;
  updated_at: string;
}

export interface LeadRecord {
  id: string;
  list_id: string;
  user_id: string;
  data: Record<string, any>;
  tags: string[];
  qr_code_url?: string;
  entry_url?: string;
  created_at: string;
  updated_at: string;
}

export interface QRScanHistory {
  id: string;
  record_id: string;
  scanned_at: string;
  ip_address?: string;
  user_agent?: string;
  location?: Record<string, any>;
}

export const leadListService = {
  async createLeadList(listData: Omit<LeadList, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('lead_lists')
      .insert(listData)
      .select()
      .single();

    if (error) throw error;
    return data as LeadList;
  },

  async getLeadLists(userId: string) {
    const { data, error } = await supabase
      .from('lead_lists')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as LeadList[];
  },

  async importCSVData(listId: string, csvData: Record<string, any>[], userId: string) {
    const records = csvData.map(row => ({
      list_id: listId,
      user_id: userId,
      data: row,
      tags: [],
      entry_url: `/entry/${listId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      qr_code_url: null // Will be generated after insert
    }));

    const { data, error } = await supabase
      .from('lead_records')
      .insert(records)
      .select();

    if (error) throw error;

    // Generate QR codes for each record
    if (data) {
      await this.generateQRCodesForRecords(data);
    }

    // Update record count
    await supabase
      .from('lead_lists')
      .update({ record_count: csvData.length })
      .eq('id', listId);

    return data;
  },

  async generateQRCodesForRecords(records: any[]) {
    for (const record of records) {
      try {
        // Generate QR code URL pointing to the entry detail page
        const entryUrl = `${window.location.origin}${record.entry_url}`;
        
        // You can integrate with a QR code generation service here
        // For now, we'll use a placeholder QR service
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(entryUrl)}`;
        
        await supabase
          .from('lead_records')
          .update({ qr_code_url: qrCodeUrl })
          .eq('id', record.id);
          
      } catch (error) {
        console.error(`Failed to generate QR code for record ${record.id}:`, error);
      }
    }
  },

  async getLeadRecord(recordId: string): Promise<LeadRecord | null> {
    const { data, error } = await supabase
      .from('lead_records')
      .select('*')
      .eq('id', recordId)
      .single();

    if (error) {
      console.error('Error fetching lead record:', error);
      return null;
    }

    return {
      id: data.id,
      list_id: data.list_id,
      user_id: data.user_id,
      data: typeof data.data === 'object' && data.data !== null ? data.data as Record<string, any> : {},
      tags: data.tags || [],
      qr_code_url: data.qr_code_url,
      entry_url: data.entry_url,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  },

  async getLeadRecordByEntryUrl(entryUrl: string): Promise<LeadRecord | null> {
    const { data, error } = await supabase
      .from('lead_records')
      .select('*')
      .eq('entry_url', entryUrl)
      .single();

    if (error) {
      console.error('Error fetching lead record by entry URL:', error);
      return null;
    }

    return {
      id: data.id,
      list_id: data.list_id,
      user_id: data.user_id,
      data: typeof data.data === 'object' && data.data !== null ? data.data as Record<string, any> : {},
      tags: data.tags || [],
      qr_code_url: data.qr_code_url,
      entry_url: data.entry_url,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  },

  async recordQRScan(recordId: string, scanData: Partial<QRScanHistory>) {
    const { data, error } = await supabase
      .from('qr_scan_history')
      .insert({
        record_id: recordId,
        scanned_at: new Date().toISOString(),
        ...scanData
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getQRScanHistory(recordId: string): Promise<QRScanHistory[]> {
    const { data, error } = await supabase
      .from('qr_scan_history')
      .select('*')
      .eq('record_id', recordId)
      .order('scanned_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(scan => ({
      id: scan.id,
      record_id: scan.record_id,
      scanned_at: scan.scanned_at,
      ip_address: scan.ip_address,
      user_agent: scan.user_agent,
      location: typeof scan.location === 'object' && scan.location !== null ? scan.location as Record<string, any> : {}
    }));
  },

  async exportLeadData(listId: string) {
    const { data, error } = await supabase
      .from('lead_records')
      .select('data, tags, created_at, qr_code_url, entry_url')
      .eq('list_id', listId);

    if (error) throw error;
    return data;
  },

  async getLeadRecords(listId: string): Promise<LeadRecord[]> {
    const { data, error } = await supabase
      .from('lead_records')
      .select('*')
      .eq('list_id', listId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map(record => ({
      id: record.id,
      list_id: record.list_id,
      user_id: record.user_id,
      data: typeof record.data === 'object' && record.data !== null ? record.data as Record<string, any> : {},
      tags: record.tags || [],
      qr_code_url: record.qr_code_url,
      entry_url: record.entry_url,
      created_at: record.created_at,
      updated_at: record.updated_at
    })) as LeadRecord[];
  }
};
