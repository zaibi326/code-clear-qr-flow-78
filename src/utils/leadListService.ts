
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
  created_at: string;
  updated_at: string;
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
      tags: []
    }));

    const { data, error } = await supabase
      .from('lead_records')
      .insert(records)
      .select();

    if (error) throw error;

    // Update record count
    await supabase
      .from('lead_lists')
      .update({ record_count: csvData.length })
      .eq('id', listId);

    return data;
  },

  async exportLeadData(listId: string) {
    const { data, error } = await supabase
      .from('lead_records')
      .select('data, tags, created_at')
      .eq('list_id', listId);

    if (error) throw error;
    return data;
  },

  async getLeadRecords(listId: string) {
    const { data, error } =  await supabase
      .from('lead_records')
      .select('*')
      .eq('list_id', listId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};
