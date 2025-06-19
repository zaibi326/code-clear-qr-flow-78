import { supabase } from '@/integrations/supabase/client';

export interface QRCodeFilter {
  timeRange?: '7d' | '30d' | '90d' | '1y' | 'all';
  campaignId?: string;
  projectId?: string;
  contentType?: string;
  visibilityStatus?: 'active' | 'archived' | 'deleted';
  searchTerm?: string;
  tagIds?: string[];
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
  // Get paginated QR codes with filters (with fallback for failed joins)
  async getQRCodes(userId: string, filters: QRCodeFilter = {}, page = 1, limit = 20) {
    try {
      // First, try the complex query with joins
      let query = supabase
        .from('qr_codes')
        .select(`
          *,
          campaigns:campaign_id(name, status),
          projects:project_id(name, color),
          qr_code_tags(
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

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      
      if (error) {
        console.error('Complex query failed, trying fallback:', error);
        // Fallback to simpler query without joins
        return this.getQRCodesSimple(userId, filters, page, limit);
      }

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
    } catch (error) {
      console.error('Error in getQRCodes, using fallback:', error);
      return this.getQRCodesSimple(userId, filters, page, limit);
    }
  },

  // Fallback method with simpler query
  async getQRCodesSimple(userId: string, filters: QRCodeFilter = {}, page = 1, limit = 20) {
    let query = supabase
      .from('qr_codes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Apply basic filters
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

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    
    if (error) throw error;

    // For simple query, return QR codes without complex relationships
    const processedData = data?.map(qr => ({
      ...qr,
      tags: [],
      campaigns: null,
      projects: null
    })) || [];

    return {
      data: processedData,
      totalCount: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page
    };
  },

  // Get QR code analytics with error handling
  async getQRAnalytics(
    userId: string, 
    timeRange = '30d', 
    campaignId?: string, 
    projectId?: string
  ): Promise<QRCodeAnalytics> {
    try {
      const { data, error } = await supabase.rpc('get_qr_analytics', {
        p_user_id: userId,
        p_time_range: timeRange,
        p_campaign_id: campaignId || null,
        p_project_id: projectId || null
      });

      if (error) {
        console.error('Analytics RPC failed:', error);
        // Fallback to basic count query
        return this.getBasicAnalytics(userId, timeRange);
      }

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
    } catch (error) {
      console.error('Error getting analytics:', error);
      return this.getBasicAnalytics(userId, timeRange);
    }
  },

  // Fallback analytics method
  async getBasicAnalytics(userId: string, timeRange: string): Promise<QRCodeAnalytics> {
    try {
      const { data, error } = await supabase
        .from('qr_codes')
        .select('id, stats')
        .eq('user_id', userId)
        .eq('visibility_status', 'active');

      if (error) throw error;

      const totalCodes = data?.length || 0;
      const totalScans = data?.reduce((sum, qr) => sum + (qr.stats?.total_scans || 0), 0) || 0;
      const uniqueScans = data?.reduce((sum, qr) => sum + (qr.stats?.unique_scans || 0), 0) || 0;
      const avgScans = totalCodes > 0 ? Math.round(totalScans / totalCodes) : 0;

      return {
        total_qr_codes: totalCodes,
        total_scans: totalScans,
        unique_scans: uniqueScans,
        avg_scans_per_qr: avgScans,
        top_performing_qr: {},
        recent_activity: []
      };
    } catch (error) {
      console.error('Error in basic analytics:', error);
      return {
        total_qr_codes: 0,
        total_scans: 0,
        unique_scans: 0,
        avg_scans_per_qr: 0,
        top_performing_qr: {},
        recent_activity: []
      };
    }
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
    tagIds?: string[];
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
        tags: qrData.tags || []
      })
      .select()
      .single();

    if (error) throw error;

    // If tagIds are provided, create the tag relationships
    if (qrData.tagIds && qrData.tagIds.length > 0) {
      try {
        const { tagService } = await import('./tagService');
        await tagService.assignTagsToQRCode(data.id, qrData.tagIds);
      } catch (tagError) {
        console.error('Error assigning tags:', tagError);
        // Continue without tags if assignment fails
      }
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
    try {
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
    } catch (error) {
      console.error('Error fetching QR code with tags:', error);
      // Fallback to basic QR code data
      const { data, error: basicError } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('id', qrCodeId)
        .single();

      if (basicError) throw basicError;

      return {
        ...data,
        tags: [],
        campaigns: null,
        projects: null
      };
    }
  }
};
