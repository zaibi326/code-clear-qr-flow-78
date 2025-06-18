
-- Enhance the existing qr_codes table with better metadata tracking
ALTER TABLE public.qr_codes 
ADD COLUMN IF NOT EXISTS generation_source TEXT DEFAULT 'manual',
ADD COLUMN IF NOT EXISTS generation_metadata JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS visibility_status TEXT DEFAULT 'active' CHECK (visibility_status IN ('active', 'archived', 'deleted')),
ADD COLUMN IF NOT EXISTS qr_settings JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS performance_metrics JSONB DEFAULT '{"conversion_rate": 0, "engagement_score": 0}';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_qr_codes_user_created ON public.qr_codes(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_qr_codes_campaign ON public.qr_codes(campaign_id) WHERE campaign_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_qr_codes_project ON public.qr_codes(project_id) WHERE project_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_qr_codes_visibility ON public.qr_codes(visibility_status);
CREATE INDEX IF NOT EXISTS idx_qr_codes_content_type ON public.qr_codes(content_type);

-- Update the stats column to have more detailed tracking
UPDATE public.qr_codes 
SET stats = jsonb_set(
  COALESCE(stats, '{}'),
  '{created_at}',
  to_jsonb(created_at::text)
) WHERE stats->>'created_at' IS NULL;

-- Create RLS policies for QR codes
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;

-- Policy for users to see their own QR codes
CREATE POLICY "Users can view their own QR codes" ON public.qr_codes
  FOR SELECT USING (auth.uid() = user_id);

-- Policy for users to create their own QR codes
CREATE POLICY "Users can create their own QR codes" ON public.qr_codes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own QR codes
CREATE POLICY "Users can update their own QR codes" ON public.qr_codes
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy for users to delete their own QR codes (soft delete)
CREATE POLICY "Users can delete their own QR codes" ON public.qr_codes
  FOR DELETE USING (auth.uid() = user_id);

-- Create a function to get QR code analytics
CREATE OR REPLACE FUNCTION public.get_qr_analytics(
  p_user_id UUID,
  p_time_range TEXT DEFAULT '30d',
  p_campaign_id UUID DEFAULT NULL,
  p_project_id UUID DEFAULT NULL
)
RETURNS TABLE (
  total_qr_codes BIGINT,
  total_scans BIGINT,
  unique_scans BIGINT,
  avg_scans_per_qr NUMERIC,
  top_performing_qr JSONB,
  recent_activity JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  date_filter TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Calculate date filter based on time range
  CASE p_time_range
    WHEN '7d' THEN date_filter := NOW() - INTERVAL '7 days';
    WHEN '30d' THEN date_filter := NOW() - INTERVAL '30 days';
    WHEN '90d' THEN date_filter := NOW() - INTERVAL '90 days';
    WHEN '1y' THEN date_filter := NOW() - INTERVAL '1 year';
    ELSE date_filter := NOW() - INTERVAL '30 days';
  END CASE;

  RETURN QUERY
  WITH qr_stats AS (
    SELECT 
      COUNT(*) as qr_count,
      COALESCE(SUM((stats->>'total_scans')::INTEGER), 0) as scan_total,
      COALESCE(SUM((stats->>'unique_scans')::INTEGER), 0) as unique_total,
      CASE 
        WHEN COUNT(*) > 0 THEN ROUND(COALESCE(SUM((stats->>'total_scans')::INTEGER), 0)::NUMERIC / COUNT(*), 2)
        ELSE 0
      END as avg_scans
    FROM public.qr_codes 
    WHERE user_id = p_user_id 
      AND created_at >= date_filter
      AND visibility_status = 'active'
      AND (p_campaign_id IS NULL OR campaign_id = p_campaign_id)
      AND (p_project_id IS NULL OR project_id = p_project_id)
  ),
  top_qr AS (
    SELECT jsonb_build_object(
      'id', id,
      'name', COALESCE(name, 'Unnamed QR'),
      'scans', COALESCE((stats->>'total_scans')::INTEGER, 0),
      'content_type', content_type
    ) as top_qr_data
    FROM public.qr_codes 
    WHERE user_id = p_user_id 
      AND created_at >= date_filter
      AND visibility_status = 'active'
      AND (p_campaign_id IS NULL OR campaign_id = p_campaign_id)
      AND (p_project_id IS NULL OR project_id = p_project_id)
    ORDER BY COALESCE((stats->>'total_scans')::INTEGER, 0) DESC 
    LIMIT 1
  ),
  recent_scans AS (
    SELECT jsonb_agg(
      jsonb_build_object(
        'qr_id', qr_code_id,
        'timestamp', scan_timestamp,
        'location', location_data
      ) ORDER BY scan_timestamp DESC
    ) as recent_data
    FROM public.scan_analytics
    WHERE user_id = p_user_id 
      AND scan_timestamp >= date_filter
      AND (p_campaign_id IS NULL OR campaign_id = p_campaign_id)
      AND (p_project_id IS NULL OR project_id = p_project_id)
    LIMIT 10
  )
  SELECT 
    qs.qr_count::BIGINT,
    qs.scan_total::BIGINT,
    qs.unique_total::BIGINT,
    qs.avg_scans,
    COALESCE(tq.top_qr_data, '{}'::JSONB),
    COALESCE(rs.recent_data, '[]'::JSONB)
  FROM qr_stats qs
  CROSS JOIN LATERAL (SELECT top_qr_data FROM top_qr) tq
  CROSS JOIN LATERAL (SELECT recent_data FROM recent_scans) rs;
END;
$$;
