
-- Create a dedicated tags table for better tag management
CREATE TABLE public.tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  category TEXT, -- campaign, source, region, date, etc.
  description TEXT,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, name)
);

-- Create junction table for QR code tags (many-to-many relationship)
CREATE TABLE public.qr_code_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  qr_code_id UUID REFERENCES public.qr_codes(id) ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(qr_code_id, tag_id)
);

-- Create junction table for lead record tags
CREATE TABLE public.lead_record_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_record_id UUID REFERENCES public.lead_records(id) ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(lead_record_id, tag_id)
);

-- Add RLS policies for tags table
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tags" ON public.tags
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tags" ON public.tags
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tags" ON public.tags
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tags" ON public.tags
  FOR DELETE USING (auth.uid() = user_id);

-- Add RLS policies for junction tables
ALTER TABLE public.qr_code_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view QR code tags" ON public.qr_code_tags
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.qr_codes 
      WHERE id = qr_code_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage QR code tags" ON public.qr_code_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.qr_codes 
      WHERE id = qr_code_id AND user_id = auth.uid()
    )
  );

ALTER TABLE public.lead_record_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view lead record tags" ON public.lead_record_tags
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.lead_records 
      WHERE id = lead_record_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage lead record tags" ON public.lead_record_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.lead_records 
      WHERE id = lead_record_id AND user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_tags_user_category ON public.tags(user_id, category);
CREATE INDEX idx_tags_usage_count ON public.tags(usage_count DESC);
CREATE INDEX idx_qr_code_tags_qr_code ON public.qr_code_tags(qr_code_id);
CREATE INDEX idx_qr_code_tags_tag ON public.qr_code_tags(tag_id);
CREATE INDEX idx_lead_record_tags_record ON public.lead_record_tags(lead_record_id);
CREATE INDEX idx_lead_record_tags_tag ON public.lead_record_tags(tag_id);

-- Function to update tag usage count
CREATE OR REPLACE FUNCTION update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.tags 
    SET usage_count = usage_count + 1, updated_at = now()
    WHERE id = NEW.tag_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.tags 
    SET usage_count = GREATEST(usage_count - 1, 0), updated_at = now()
    WHERE id = OLD.tag_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to maintain tag usage counts
CREATE TRIGGER trigger_qr_code_tag_usage
  AFTER INSERT OR DELETE ON public.qr_code_tags
  FOR EACH ROW EXECUTE FUNCTION update_tag_usage_count();

CREATE TRIGGER trigger_lead_record_tag_usage
  AFTER INSERT OR DELETE ON public.lead_record_tags
  FOR EACH ROW EXECUTE FUNCTION update_tag_usage_count();

-- Function to get popular tags for a user
CREATE OR REPLACE FUNCTION get_popular_tags(p_user_id UUID, p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  name TEXT,
  color TEXT,
  category TEXT,
  usage_count INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT t.id, t.name, t.color, t.category, t.usage_count
  FROM public.tags t
  WHERE t.user_id = p_user_id
  ORDER BY t.usage_count DESC, t.name ASC
  LIMIT p_limit;
END;
$$;
