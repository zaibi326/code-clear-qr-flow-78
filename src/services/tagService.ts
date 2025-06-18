
import { supabase } from '@/integrations/supabase/client';

export interface Tag {
  id: string;
  user_id: string;
  name: string;
  color: string;
  category?: string;
  description?: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface TagFilter {
  category?: string;
  searchTerm?: string;
  sortBy?: 'name' | 'usage_count' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}

// Type for database function returns that only include partial Tag data
interface PartialTagData {
  id: string;
  name: string;
  color: string;
  category: string;
  usage_count: number;
}

export const tagService = {
  // Get all tags for a user with filtering
  async getTags(userId: string, filters: TagFilter = {}): Promise<Tag[]> {
    let query = supabase
      .from('tags')
      .select('*')
      .eq('user_id', userId);

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.searchTerm) {
      query = query.ilike('name', `%${filters.searchTerm}%`);
    }

    const sortBy = filters.sortBy || 'name';
    const sortOrder = filters.sortOrder || 'asc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // Get popular tags using the database function
  async getPopularTags(userId: string, limit = 10): Promise<PartialTagData[]> {
    const { data, error } = await supabase.rpc('get_popular_tags', {
      p_user_id: userId,
      p_limit: limit
    });

    if (error) throw error;
    return data || [];
  },

  // Create a new tag
  async createTag(tagData: {
    user_id: string;
    name: string;
    color?: string;
    category?: string;
    description?: string;
  }): Promise<Tag> {
    const { data, error } = await supabase
      .from('tags')
      .insert({
        user_id: tagData.user_id,
        name: tagData.name.trim(),
        color: tagData.color || '#3B82F6',
        category: tagData.category,
        description: tagData.description
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a tag
  async updateTag(tagId: string, updates: Partial<Tag>): Promise<Tag> {
    const { data, error } = await supabase
      .from('tags')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', tagId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a tag
  async deleteTag(tagId: string): Promise<void> {
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', tagId);

    if (error) throw error;
  },

  // Get tags for a specific QR code
  async getQRCodeTags(qrCodeId: string): Promise<Tag[]> {
    const { data, error } = await supabase
      .from('qr_code_tags')
      .select(`
        tag_id,
        tags (
          id,
          user_id,
          name,
          color,
          category,
          description,
          usage_count,
          created_at,
          updated_at
        )
      `)
      .eq('qr_code_id', qrCodeId);

    if (error) throw error;
    return data?.map(item => item.tags as Tag).filter(Boolean) || [];
  },

  // Assign tags to a QR code
  async assignTagsToQRCode(qrCodeId: string, tagIds: string[]): Promise<void> {
    // First, remove existing tags
    await supabase
      .from('qr_code_tags')
      .delete()
      .eq('qr_code_id', qrCodeId);

    // Then, add new tags
    if (tagIds.length > 0) {
      const tagAssignments = tagIds.map(tagId => ({
        qr_code_id: qrCodeId,
        tag_id: tagId
      }));

      const { error } = await supabase
        .from('qr_code_tags')
        .insert(tagAssignments);

      if (error) throw error;
    }
  },

  // Get tags for a specific lead record
  async getLeadRecordTags(leadRecordId: string): Promise<Tag[]> {
    const { data, error } = await supabase
      .from('lead_record_tags')
      .select(`
        tag_id,
        tags (
          id,
          user_id,
          name,
          color,
          category,
          description,
          usage_count,
          created_at,
          updated_at
        )
      `)
      .eq('lead_record_id', leadRecordId);

    if (error) throw error;
    return data?.map(item => item.tags as Tag).filter(Boolean) || [];
  },

  // Assign tags to a lead record
  async assignTagsToLeadRecord(leadRecordId: string, tagIds: string[]): Promise<void> {
    // First, remove existing tags
    await supabase
      .from('lead_record_tags')
      .delete()
      .eq('lead_record_id', leadRecordId);

    // Then, add new tags
    if (tagIds.length > 0) {
      const tagAssignments = tagIds.map(tagId => ({
        lead_record_id: leadRecordId,
        tag_id: tagId
      }));

      const { error } = await supabase
        .from('lead_record_tags')
        .insert(tagAssignments);

      if (error) throw error;
    }
  },

  // Get all tag categories for a user
  async getTagCategories(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('tags')
      .select('category')
      .eq('user_id', userId)
      .not('category', 'is', null);

    if (error) throw error;
    
    const categories = data?.map(item => item.category).filter(Boolean) || [];
    return [...new Set(categories)];
  },

  // Bulk create tags from array of names
  async bulkCreateTags(userId: string, tagNames: string[], category?: string): Promise<Tag[]> {
    const uniqueNames = [...new Set(tagNames.map(name => name.trim()).filter(Boolean))];
    
    const tagData = uniqueNames.map(name => ({
      user_id: userId,
      name,
      category: category || 'general',
      color: '#3B82F6'
    }));

    const { data, error } = await supabase
      .from('tags')
      .upsert(tagData, { 
        onConflict: 'user_id,name',
        ignoreDuplicates: true 
      })
      .select();

    if (error) throw error;
    return data || [];
  }
};
