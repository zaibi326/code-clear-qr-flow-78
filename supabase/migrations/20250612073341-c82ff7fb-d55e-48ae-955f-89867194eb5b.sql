
-- First, let's ensure QR codes are properly stored with all necessary fields
-- Add missing columns to qr_codes table for better tracking
ALTER TABLE public.qr_codes 
ADD COLUMN IF NOT EXISTS project_id uuid REFERENCES public.projects(id),
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS logo_url text,
ADD COLUMN IF NOT EXISTS border_style jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS variable_fields jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS scan_location_data jsonb DEFAULT '{}';

-- Create a comprehensive scan_analytics table for better tracking
CREATE TABLE IF NOT EXISTS public.scan_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_code_id uuid REFERENCES public.qr_codes(id) ON DELETE CASCADE,
  campaign_id uuid REFERENCES public.campaigns(id),
  project_id uuid REFERENCES public.projects(id),
  user_id uuid REFERENCES auth.users(id),
  scan_timestamp timestamp with time zone DEFAULT now(),
  is_first_time_scan boolean DEFAULT true,
  device_info jsonb DEFAULT '{}',
  location_data jsonb DEFAULT '{}',
  referrer_source text,
  lead_source text,
  ip_address inet,
  user_agent text,
  session_id text,
  conversion_data jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_scan_analytics_qr_code_id ON public.scan_analytics(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_scan_analytics_campaign_id ON public.scan_analytics(campaign_id);
CREATE INDEX IF NOT EXISTS idx_scan_analytics_project_id ON public.scan_analytics(project_id);
CREATE INDEX IF NOT EXISTS idx_scan_analytics_user_id ON public.scan_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_scan_analytics_timestamp ON public.scan_analytics(scan_timestamp);

-- Create a table for lead lists management
CREATE TABLE IF NOT EXISTS public.lead_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  description text,
  file_url text,
  file_type text, -- 'csv', 'xlsx', etc.
  record_count integer DEFAULT 0,
  tags text[] DEFAULT '{}',
  import_date timestamp with time zone DEFAULT now(),
  status text DEFAULT 'active', -- 'active', 'archived', 'processing'
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create a table for individual lead records
CREATE TABLE IF NOT EXISTS public.lead_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id uuid REFERENCES public.lead_lists(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  data jsonb NOT NULL, -- Store all lead data as JSON
  tags text[] DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes for lead management
CREATE INDEX IF NOT EXISTS idx_lead_lists_user_id ON public.lead_lists(user_id);
CREATE INDEX IF NOT EXISTS idx_lead_records_list_id ON public.lead_records(list_id);
CREATE INDEX IF NOT EXISTS idx_lead_records_user_id ON public.lead_records(user_id);

-- Enable RLS on new tables
ALTER TABLE public.scan_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_records ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for scan_analytics
CREATE POLICY "Users can view their own scan analytics" ON public.scan_analytics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scan analytics" ON public.scan_analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for lead_lists
CREATE POLICY "Users can view their own lead lists" ON public.lead_lists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lead lists" ON public.lead_lists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lead lists" ON public.lead_lists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lead lists" ON public.lead_lists
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for lead_records
CREATE POLICY "Users can view their own lead records" ON public.lead_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lead records" ON public.lead_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lead records" ON public.lead_records
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lead records" ON public.lead_records
  FOR DELETE USING (auth.uid() = user_id);

-- Create a function to automatically update scan counts
CREATE OR REPLACE FUNCTION update_qr_scan_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the QR code stats
  UPDATE public.qr_codes 
  SET stats = jsonb_set(
    COALESCE(stats, '{}'),
    '{total_scans}',
    (COALESCE((stats->>'total_scans')::integer, 0) + 1)::text::jsonb
  ),
  updated_at = now()
  WHERE id = NEW.qr_code_id;
  
  -- Update campaign stats if campaign_id exists
  IF NEW.campaign_id IS NOT NULL THEN
    UPDATE public.campaigns 
    SET updated_at = now()
    WHERE id = NEW.campaign_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic scan counting
DROP TRIGGER IF EXISTS trigger_update_scan_stats ON public.scan_analytics;
CREATE TRIGGER trigger_update_scan_stats
  AFTER INSERT ON public.scan_analytics
  FOR EACH ROW EXECUTE FUNCTION update_qr_scan_stats();

-- Add updated_at trigger to lead_lists
CREATE TRIGGER update_lead_lists_updated_at
  BEFORE UPDATE ON public.lead_lists
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add updated_at trigger to lead_records  
CREATE TRIGGER update_lead_records_updated_at
  BEFORE UPDATE ON public.lead_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
