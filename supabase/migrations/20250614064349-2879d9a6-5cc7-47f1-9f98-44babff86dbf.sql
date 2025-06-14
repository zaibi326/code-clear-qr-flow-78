
-- 1. Add built-in/user-uploaded type and gallery features.
ALTER TABLE public.templates
  ADD COLUMN IF NOT EXISTS is_builtin boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS category text NULL,
  ADD COLUMN IF NOT EXISTS thumbnail_url text NULL,
  ADD COLUMN IF NOT EXISTS editable_json jsonb NULL,
  ADD COLUMN IF NOT EXISTS template_url text NULL;

-- 2. (Optional) Add "launched_campaigns" if you want to track launches separately.
CREATE TABLE IF NOT EXISTS public.launched_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  template_id uuid NOT NULL,
  layout_json jsonb NOT NULL,
  qr_metadata jsonb,
  export_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  description text,
  FOREIGN KEY (user_id) REFERENCES profiles(id),
  FOREIGN KEY (template_id) REFERENCES templates(id)
);

-- 3. Add RLS policies so users ONLY see their own uploaded templates and campaigns.
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own and built-in templates"
  ON public.templates FOR SELECT
  USING (is_builtin = true OR user_id = auth.uid());

CREATE POLICY "Users can insert/edit/delete their own templates"
  ON public.templates FOR ALL
  USING (user_id = auth.uid() AND is_builtin = false)
  WITH CHECK (user_id = auth.uid() AND is_builtin = false);

-- (Optional) For launched_campaigns
ALTER TABLE public.launched_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own launched campaigns"
  ON public.launched_campaigns FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
