
import { supabase } from '@/integrations/supabase/client';
import { DatabaseUser, DatabaseQRCode, DatabaseTemplate } from '@/types/database';

export const supabaseService = {
  // User Profile operations
  async createUserProfile(profile: Omit<DatabaseUser, 'id'> & { id: string }): Promise<DatabaseUser> {
    const profileData = {
      ...profile,
      created_at: profile.created_at.toISOString(),
      updated_at: profile.updated_at.toISOString(),
      trial_ends_at: profile.trial_ends_at?.toISOString()
    };

    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single();

    if (error) throw error;
    
    return {
      ...data,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at),
      trial_ends_at: data.trial_ends_at ? new Date(data.trial_ends_at) : null
    } as DatabaseUser;
  },

  async updateUserProfile(userId: string, updates: Partial<DatabaseUser>): Promise<DatabaseUser> {
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString(),
      ...(updates.created_at && { created_at: updates.created_at.toISOString() }),
      ...(updates.trial_ends_at && { trial_ends_at: updates.trial_ends_at.toISOString() })
    };

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    
    return {
      ...data,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at),
      trial_ends_at: data.trial_ends_at ? new Date(data.trial_ends_at) : null
    } as DatabaseUser;
  },

  async getUserProfile(userId: string): Promise<DatabaseUser | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows returned
      throw error;
    }

    return {
      ...data,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at),
      trial_ends_at: data.trial_ends_at ? new Date(data.trial_ends_at) : null
    } as DatabaseUser;
  },

  // QR Code operations
  async createQRCode(qrCode: Omit<DatabaseQRCode, 'id'>): Promise<DatabaseQRCode> {
    const qrCodeData = {
      ...qrCode,
      created_at: qrCode.created_at.toISOString(),
      updated_at: qrCode.updated_at.toISOString(),
      expires_at: qrCode.expires_at?.toISOString()
    };

    const { data, error } = await supabase
      .from('qr_codes')
      .insert(qrCodeData)
      .select()
      .single();

    if (error) throw error;
    
    return {
      ...data,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at),
      expires_at: data.expires_at ? new Date(data.expires_at) : null
    } as DatabaseQRCode;
  },

  async getUserQRCodes(userId: string): Promise<DatabaseQRCode[]> {
    const { data, error } = await supabase
      .from('qr_codes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return (data || []).map(qr => ({
      ...qr,
      created_at: new Date(qr.created_at),
      updated_at: new Date(qr.updated_at),
      expires_at: qr.expires_at ? new Date(qr.expires_at) : null
    })) as DatabaseQRCode[];
  },

  async updateQRCode(qrCodeId: string, updates: Partial<DatabaseQRCode>): Promise<DatabaseQRCode> {
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString(),
      ...(updates.created_at && { created_at: updates.created_at.toISOString() }),
      ...(updates.expires_at && { expires_at: updates.expires_at.toISOString() })
    };

    const { data, error } = await supabase
      .from('qr_codes')
      .update(updateData)
      .eq('id', qrCodeId)
      .select()
      .single();

    if (error) throw error;
    
    return {
      ...data,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at),
      expires_at: data.expires_at ? new Date(data.expires_at) : null
    } as DatabaseQRCode;
  },

  async deleteQRCode(qrCodeId: string): Promise<void> {
    const { error } = await supabase
      .from('qr_codes')
      .delete()
      .eq('id', qrCodeId);

    if (error) throw error;
  },

  // Template operations
  async createTemplate(template: Omit<DatabaseTemplate, 'id'>): Promise<DatabaseTemplate> {
    const templateData = {
      ...template,
      created_at: template.created_at.toISOString(),
      updated_at: template.updated_at.toISOString()
    };

    const { data, error } = await supabase
      .from('templates')
      .insert(templateData)
      .select()
      .single();

    if (error) throw error;
    
    return {
      ...data,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at)
    } as DatabaseTemplate;
  },

  async getUserTemplates(userId: string): Promise<DatabaseTemplate[]> {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return (data || []).map(template => ({
      ...template,
      created_at: new Date(template.created_at),
      updated_at: new Date(template.updated_at)
    })) as DatabaseTemplate[];
  },

  async getPublicTemplates(): Promise<DatabaseTemplate[]> {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return (data || []).map(template => ({
      ...template,
      created_at: new Date(template.created_at),
      updated_at: new Date(template.updated_at)
    })) as DatabaseTemplate[];
  },

  async updateTemplate(templateId: string, updates: Partial<DatabaseTemplate>): Promise<DatabaseTemplate> {
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString(),
      ...(updates.created_at && { created_at: updates.created_at.toISOString() })
    };

    const { data, error } = await supabase
      .from('templates')
      .update(updateData)
      .eq('id', templateId)
      .select()
      .single();

    if (error) throw error;
    
    return {
      ...data,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at)
    } as DatabaseTemplate;
  },

  async deleteTemplate(templateId: string): Promise<void> {
    const { error } = await supabase
      .from('templates')
      .delete()
      .eq('id', templateId);

    if (error) throw error;
  },

  // Scan tracking
  async recordScan(qrCodeId: string, metadata: Record<string, any> = {}): Promise<void> {
    const { error } = await supabase
      .from('scan_events')
      .insert({
        qr_code_id: qrCodeId,
        scanned_at: new Date().toISOString(),
        user_agent: metadata.userAgent || '',
        ip_address: metadata.ipAddress || '',
        country: metadata.country || '',
        city: metadata.city || '',
        device_type: metadata.deviceType || '',
        referrer: metadata.referrer || ''
      });

    if (error) throw error;
  }
};
