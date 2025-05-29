
import { supabase } from '@/integrations/supabase/client';
import { DatabaseUser, DatabaseTemplate, DatabaseCampaign, DatabaseQRCode, DatabaseScanEvent, DatabaseProject } from '@/types/database';

export class SupabaseService {
  private static instance: SupabaseService;

  static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  // User Profile Operations
  async getUserProfile(userId: string): Promise<DatabaseUser | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data as DatabaseUser;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  async updateUserProfile(userId: string, updates: Partial<DatabaseUser>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
  }

  // QR Code Operations
  async createQRCode(qrCodeData: Omit<DatabaseQRCode, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('qr_codes')
        .insert({
          ...qrCodeData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating QR code:', error);
      return null;
    }
  }

  async getUserQRCodes(userId: string): Promise<DatabaseQRCode[]> {
    try {
      const { data, error } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DatabaseQRCode[];
    } catch (error) {
      console.error('Error fetching QR codes:', error);
      return [];
    }
  }

  async updateQRCode(id: string, updates: Partial<DatabaseQRCode>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('qr_codes')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating QR code:', error);
      return false;
    }
  }

  async deleteQRCode(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('qr_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting QR code:', error);
      return false;
    }
  }

  // Template Operations
  async createTemplate(templateData: Omit<DatabaseTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('templates')
        .insert({
          ...templateData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating template:', error);
      return null;
    }
  }

  async getUserTemplates(userId: string): Promise<DatabaseTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .or(`user_id.eq.${userId},is_public.eq.true`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DatabaseTemplate[];
    } catch (error) {
      console.error('Error fetching templates:', error);
      return [];
    }
  }

  // Project Operations
  async createProject(projectData: Omit<DatabaseProject, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          ...projectData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating project:', error);
      return null;
    }
  }

  async getUserProjects(userId: string): Promise<DatabaseProject[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .eq('is_archived', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DatabaseProject[];
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  }

  // Campaign Operations
  async createCampaign(campaignData: Omit<DatabaseCampaign, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .insert({
          ...campaignData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating campaign:', error);
      return null;
    }
  }

  async getUserCampaigns(userId: string): Promise<DatabaseCampaign[]> {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DatabaseCampaign[];
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return [];
    }
  }

  // Analytics Operations
  async recordScanEvent(scanData: Omit<DatabaseScanEvent, 'id' | 'timestamp'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('scan_events')
        .insert({
          ...scanData,
          timestamp: new Date().toISOString()
        });

      if (error) throw error;

      // Increment QR code scan count
      await supabase.rpc('increment_qr_scan', { qr_id: scanData.qr_code_id });

      return true;
    } catch (error) {
      console.error('Error recording scan event:', error);
      return false;
    }
  }

  async getUserAnalytics(userId: string, timeRange: string = '30d'): Promise<any> {
    try {
      const [qrCodes, campaigns, scanEvents] = await Promise.all([
        supabase.from('qr_codes').select('*').eq('user_id', userId),
        supabase.from('campaigns').select('*').eq('user_id', userId),
        supabase.from('scan_events').select('*').eq('user_id', userId)
      ]);

      return {
        qr_codes: qrCodes.data?.length || 0,
        campaigns: campaigns.data?.length || 0,
        total_scans: scanEvents.data?.length || 0,
        unique_scans: new Set(scanEvents.data?.map(s => s.ip_address)).size,
        recent_scans: scanEvents.data?.slice(-10) || []
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return null;
    }
  }

  // Real-time subscriptions
  subscribeToQRCodeScans(qrCodeId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`qr-code-${qrCodeId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'scan_events',
          filter: `qr_code_id=eq.${qrCodeId}`
        },
        callback
      )
      .subscribe();
  }

  subscribeToUserQRCodes(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`user-qr-codes-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'qr_codes',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe();
  }
}

export const supabaseService = SupabaseService.getInstance();
