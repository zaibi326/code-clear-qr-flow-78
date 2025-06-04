
import { supabase } from '@/integrations/supabase/client';
import { DatabaseUser, DatabaseQRCode, DatabaseScanEvent } from '@/types/database';

export const supabaseService = {
  // User Profile Operations
  async createUserProfile(userData: Omit<DatabaseUser, 'id'>, userId: string): Promise<DatabaseUser> {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: userData.email,
        name: userData.name,
        company: userData.company || '',
        phone: userData.phone || null,
        avatar_url: userData.avatar_url || null,
        plan: userData.plan || 'free',
        subscription_status: userData.subscription_status || 'trial',
        trial_ends_at: userData.trial_ends_at?.toISOString() || null,
        created_at: userData.created_at.toISOString(),
        updated_at: userData.updated_at.toISOString(),
        last_login_at: userData.last_login_at?.toISOString() || null,
        timezone: userData.timezone || 'UTC',
        language: userData.language || 'en',
        preferences: userData.preferences || {
          notifications: {
            email: true,
            scan_alerts: true,
            weekly_reports: false,
            marketing: false
          },
          dashboard: {
            default_view: 'grid',
            items_per_page: 10
          }
        },
        usage_stats: userData.usage_stats || {
          qr_codes_created: 0,
          campaigns_created: 0,
          total_scans: 0,
          storage_used: 0
        }
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }

    return this.mapDatabaseRowToUser(data, userId);
  },

  async getUserProfile(userId: string): Promise<DatabaseUser | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // User not found
      }
      console.error('Error fetching user profile:', error);
      throw error;
    }

    return this.mapDatabaseRowToUser(data, userId);
  },

  async updateUserProfile(userId: string, updates: Partial<DatabaseUser>): Promise<DatabaseUser> {
    const updateData: any = { ...updates };
    
    // Convert dates to ISO strings for database storage
    if (updateData.trial_ends_at) {
      updateData.trial_ends_at = updateData.trial_ends_at.toISOString();
    }
    if (updateData.last_login_at) {
      updateData.last_login_at = updateData.last_login_at.toISOString();
    }
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }

    return this.mapDatabaseRowToUser(data, userId);
  },

  // Helper method to safely map database row to DatabaseUser
  mapDatabaseRowToUser(data: any, userId: string): DatabaseUser {
    // Safely parse preferences
    let preferences = {
      notifications: {
        email: true,
        scan_alerts: true,
        weekly_reports: false,
        marketing: false
      },
      dashboard: {
        default_view: 'grid' as const,
        items_per_page: 10
      }
    };

    if (data.preferences && typeof data.preferences === 'object') {
      preferences = {
        notifications: {
          email: data.preferences.notifications?.email ?? true,
          scan_alerts: data.preferences.notifications?.scan_alerts ?? true,
          weekly_reports: data.preferences.notifications?.weekly_reports ?? false,
          marketing: data.preferences.notifications?.marketing ?? false
        },
        dashboard: {
          default_view: (data.preferences.dashboard?.default_view === 'list' ? 'list' : 'grid') as 'grid' | 'list',
          items_per_page: data.preferences.dashboard?.items_per_page ?? 10
        }
      };
    }

    // Safely parse usage_stats
    let usage_stats = {
      qr_codes_created: 0,
      campaigns_created: 0,
      total_scans: 0,
      storage_used: 0
    };

    if (data.usage_stats && typeof data.usage_stats === 'object') {
      usage_stats = {
        qr_codes_created: data.usage_stats.qr_codes_created ?? 0,
        campaigns_created: data.usage_stats.campaigns_created ?? 0,
        total_scans: data.usage_stats.total_scans ?? 0,
        storage_used: data.usage_stats.storage_used ?? 0
      };
    }

    return {
      id: userId,
      email: data.email,
      name: data.name,
      company: data.company || '',
      phone: data.phone,
      avatar_url: data.avatar_url,
      plan: data.plan,
      subscription_status: data.subscription_status,
      trial_ends_at: data.trial_ends_at ? new Date(data.trial_ends_at) : undefined,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at),
      last_login_at: data.last_login_at ? new Date(data.last_login_at) : undefined,
      timezone: data.timezone || 'UTC',
      language: data.language || 'en',
      preferences,
      usage_stats
    };
  },

  // QR Code Operations - Simplified for now since we don't have the qr_codes table
  async createQRCode(qrCodeData: Omit<DatabaseQRCode, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseQRCode> {
    // For now, return a mock QR code since we don't have the table set up
    const mockQRCode: DatabaseQRCode = {
      id: `qr_${Date.now()}`,
      campaign_id: qrCodeData.campaign_id,
      user_id: qrCodeData.user_id,
      name: qrCodeData.name,
      content: qrCodeData.content,
      content_type: qrCodeData.content_type,
      qr_image_url: qrCodeData.qr_image_url,
      pdf_url: qrCodeData.pdf_url,
      short_url: qrCodeData.short_url,
      custom_data: qrCodeData.custom_data,
      is_active: qrCodeData.is_active,
      expires_at: qrCodeData.expires_at,
      password_protected: qrCodeData.password_protected,
      password_hash: qrCodeData.password_hash,
      created_at: new Date(),
      updated_at: new Date(),
      stats: qrCodeData.stats
    };
    
    console.log('Mock QR code created:', mockQRCode);
    return mockQRCode;
  },

  async getUserQRCodes(userId: string): Promise<DatabaseQRCode[]> {
    // Return empty array for now since we don't have the table
    console.log('Getting QR codes for user:', userId);
    return [];
  },

  async updateQRCode(id: string, updates: Partial<DatabaseQRCode>): Promise<DatabaseQRCode | null> {
    // Mock update for now
    console.log('Updating QR code:', id, updates);
    return null;
  },

  async deleteQRCode(id: string): Promise<boolean> {
    // Mock delete for now
    console.log('Deleting QR code:', id);
    return true;
  },

  // Scan Event Operations - Mock for now
  async recordScanEvent(scanData: Omit<DatabaseScanEvent, 'id' | 'timestamp'>): Promise<DatabaseScanEvent> {
    const mockScanEvent: DatabaseScanEvent = {
      id: `scan_${Date.now()}`,
      timestamp: new Date(),
      ...scanData
    };
    
    console.log('Mock scan event recorded:', mockScanEvent);
    return mockScanEvent;
  }
};
