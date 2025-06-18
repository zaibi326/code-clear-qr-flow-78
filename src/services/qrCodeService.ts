import { supabase } from '@/integrations/supabase/client';

export interface QRCodeFilter {
  timeRange?: '7d' | '30d' | '90d' | '1y' | 'all';
  campaignId?: string;
  projectId?: string;
  contentType?: string;
  visibilityStatus?: 'active' | 'archived' | 'deleted';
  searchTerm?: string;
  tagIds?: string[]; // New: filter by specific tag IDs
}

export interface QRCodeAnalytics {
  total_qr_codes: number;
  total_scans: number;
  unique_scans: number;
  avg_scans_per_qr: number;
  top_performing_qr: any;
  recent_activity: any[];
}

export const qrCodeService = {
  // Get paginated QR codes with filters (updated to include tag filtering)
  async getQRCodes(userId: string, filters: QRCodeFilter = {}, page = 1, limit = 20) {
    let query = supabase
      .from('qr_codes')
      .select(`
        *,
        campaigns:campaign_id(name, status),
        projects:project_id(name, color),
        qr_code_tags!inner(
          tags(id, name, color, category)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.campaignId) {
      query = query.eq('campaign_id', filters.campaignId);
    }
    
    if (filters.projectId) {
      query = query.eq('project_id', filters.projectId);
    }
    
    if (filters.contentType) {
      query = query.eq('content_type', filters.contentType as any);
    }
    
    if (filters.visibilityStatus) {
      query = query.eq('visibility_status', filters.visibilityStatus);
    } else {
      query = query.eq('visibility_status', 'active');
    }

    if (filters.timeRange && filters.timeRange !== 'all') {
      const daysAgo = {
        '7d': 7,
        '30d': 30,
        '90d': 90,
        '1y': 365
      }[filters.timeRange];
      
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
      query = query.gte('created_at', cutoffDate.toISOString());
    }

    if (filters.searchTerm) {
      query = query.or(`name.ilike.%${filters.searchTerm}%,content.ilike.%${filters.searchTerm}%`);
    }

    // Tag filtering - if specific tags are requested
    if (filters.tagIds && filters.tagIds.length > 0) {
      query = query.in('qr_code_tags.tag_id', filters.tagIds);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    
    if (error) throw error;

    // Process the data to flatten tag relationships
    const processedData = data?.map(qr => ({
      ...qr,
      tags: qr.qr_code_tags?.map((qt: any) => qt.tags).filter(Boolean) || []
    })) || [];

    return {
      data: processedData,
      totalCount: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page
    };
  },

  // Get QR code analytics
  async getQRAnalytics(
    userId: string, 
    timeRange = '30d', 
    campaignId?: string, 
    projectId?: string
  ): Promise<QRCodeAnalytics> {
    const { data, error } = await supabase.rpc('get_qr_analytics', {
      p_user_id: userId,
      p_time_range: timeRange,
      p_campaign_id: campaignId || null,
      p_project_id: projectId || null
    });

    if (error) throw error;

    const result = data?.[0] || {
      total_qr_codes: 0,
      total_scans: 0,
      unique_scans: 0,
      avg_scans_per_qr: 0,
      top_performing_qr: {},
      recent_activity: []
    };

    return {
      ...result,
      recent_activity: Array.isArray(result.recent_activity) ? result.recent_activity : []
    };
  },

  // Create QR code with enhanced metadata and tag support
  async createQRCode(qrData: {
    user_id: string;
    name?: string;
    content: string;
    content_type: string;
    campaign_id?: string;
    project_id?: string;
    qr_image_url?: string;
    generation_source?: string;
    generation_metadata?: any;
    qr_settings?: any;
    custom_data?: any;
    tags?: string[];
    tagIds?: string[]; // New: support for proper tag IDs
  }) {
    const { data, error } = await supabase
      .from('qr_codes')
      .insert({
        user_id: qrData.user_id,
        name: qrData.name,
        content: qrData.content,
        content_type: qrData.content_type as any,
        campaign_id: qrData.campaign_id,
        project_id: qrData.project_id,
        qr_image_url: qrData.qr_image_url,
        generation_source: qrData.generation_source || 'manual',
        generation_metadata: qrData.generation_metadata || {},
        qr_settings: qrData.qr_settings || {},
        stats: {
          total_scans: 0,
          unique_scans: 0,
          first_scan_at: null,
          last_scan_at: null,
          created_at: new Date().toISOString()
        },
        tags: qrData.tags || [] // Keep for backward compatibility
      })
      .select()
      .single();

    if (error) throw error;

    // If tagIds are provided, create the tag relationships
    if (qrData.tagIds && qrData.tagIds.length > 0) {
      const { tagService } = await import('./tagService');
      await tagService.assignTagsToQRCode(data.id, qrData.tagIds);
    }

    return data;
  },

  // Update QR code
  async updateQRCode(id: string, updates: any) {
    const { data, error } = await supabase
      .from('qr_codes')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Soft delete QR code
  async archiveQRCode(id: string) {
    return this.updateQRCode(id, { visibility_status: 'archived' });
  },

  // Restore archived QR code
  async restoreQRCode(id: string) {
    return this.updateQRCode(id, { visibility_status: 'active' });
  },

  // Hard delete QR code
  async deleteQRCode(id: string) {
    const { error } = await supabase
      .from('qr_codes')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  // Get content type options for filters
  getContentTypeOptions() {
    return [
      { label: 'URL/Website', value: 'url' },
      { label: 'Text', value: 'text' },
      { label: 'Email', value: 'email' },
      { label: 'Phone', value: 'phone' },
      { label: 'SMS', value: 'sms' },
      { label: 'WiFi', value: 'wifi' },
      { label: 'vCard', value: 'vcard' }
    ];
  },

  // Get time range options for filters
  getTimeRangeOptions() {
    return [
      { label: 'Last 7 days', value: '7d' },
      { label: 'Last 30 days', value: '30d' },
      { label: 'Last 90 days', value: '90d' },
      { label: 'Last year', value: '1y' },
      { label: 'All time', value: 'all' }
    ];
  },

  // Add new method to get QR codes with their tags
  async getQRCodeWithTags(qrCodeId: string) {
    const { data, error } = await supabase
      .from('qr_codes')
      .select(`
        *,
        campaigns:campaign_id(name, status),
        projects:project_id(name, color),
        qr_code_tags(
          tags(id, name, color, category)
        )
      `)
      .eq('id', qrCodeId)
      .single();

    if (error) throw error;

    return {
      ...data,
      tags: data.qr_code_tags?.map((qt: any) => qt.tags).filter(Boolean) || []
    };
  }
};
