
import { supabase } from '@/integrations/supabase/client';

export type QRContentType = 'url' | 'text' | 'email' | 'phone' | 'sms' | 'wifi' | 'vcard' | 'location' | 'social_media';

export interface EnhancedQRCode {
  id: string;
  name?: string;
  content: string;
  content_type: QRContentType;
  project_id?: string;
  campaign_id?: string;
  tags: string[];
  logo_url?: string;
  border_style: Record<string, any>;
  variable_fields: Record<string, any>;
  stats: {
    total_scans: number;
    unique_scans: number;
    last_scan_at?: string;
    first_scan_at?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ScanAnalytic {
  id: string;
  qr_code_id: string;
  campaign_id?: string;
  project_id?: string;
  scan_timestamp: string;
  is_first_time_scan: boolean;
  device_info: Record<string, any>;
  location_data: Record<string, any>;
  referrer_source?: string;
  lead_source?: string;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  conversion_data: Record<string, any>;
  qr_codes?: { name?: string };
  projects?: { name?: string };
}

export const enhancedQRService = {
  async createQRCode(qrData: Omit<EnhancedQRCode, 'id' | 'created_at' | 'updated_at' | 'stats'> & { user_id: string }) {
    const { data, error } = await supabase
      .from('qr_codes')
      .insert({
        name: qrData.name,
        content: qrData.content,
        content_type: qrData.content_type,
        project_id: qrData.project_id,
        campaign_id: qrData.campaign_id,
        tags: qrData.tags,
        logo_url: qrData.logo_url,
        border_style: qrData.border_style,
        variable_fields: qrData.variable_fields,
        user_id: qrData.user_id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getQRCodesWithAnalytics(userId: string) {
    const { data, error } = await supabase
      .from('qr_codes')
      .select(`
        *,
        projects(name, color),
        campaigns(name, status),
        scan_analytics(
          id,
          scan_timestamp,
          is_first_time_scan,
          device_info,
          location_data,
          lead_source
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async recordScan(scanData: Omit<ScanAnalytic, 'id'>) {
    const { data, error } = await supabase
      .from('scan_analytics')
      .insert(scanData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getScanAnalytics(userId: string, timeRange?: string) {
    let query = supabase
      .from('scan_analytics')
      .select(`
        *,
        qr_codes(name, content_type, tags),
        campaigns(name),
        projects(name, color)
      `)
      .eq('user_id', userId);

    if (timeRange) {
      const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      query = query.gte('scan_timestamp', startDate.toISOString());
    }

    const { data, error } = await query.order('scan_timestamp', { ascending: false });
    if (error) throw error;
    return data;
  },

  async updateQRCodeTags(qrCodeId: string, tags: string[]) {
    const { data, error } = await supabase
      .from('qr_codes')
      .update({ tags })
      .eq('id', qrCodeId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
