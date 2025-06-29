
-- Add missing columns to lead_records table
ALTER TABLE public.lead_records 
ADD COLUMN qr_code_url text,
ADD COLUMN entry_url text;

-- Create qr_scan_history table for tracking QR code scans
CREATE TABLE public.qr_scan_history (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  record_id uuid NOT NULL REFERENCES public.lead_records(id) ON DELETE CASCADE,
  scanned_at timestamp with time zone NOT NULL DEFAULT now(),
  ip_address text,
  user_agent text,
  location jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add RLS policies for qr_scan_history
ALTER TABLE public.qr_scan_history ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view scan history for their own records
CREATE POLICY "Users can view scan history for their records" 
  ON public.qr_scan_history 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.lead_records lr 
      WHERE lr.id = qr_scan_history.record_id 
      AND lr.user_id = auth.uid()
    )
  );

-- Policy to allow inserting scan history (public access for QR scanning)
CREATE POLICY "Anyone can insert scan history" 
  ON public.qr_scan_history 
  FOR INSERT 
  WITH CHECK (true);

-- Create index for better performance
CREATE INDEX idx_qr_scan_history_record_id ON public.qr_scan_history(record_id);
CREATE INDEX idx_qr_scan_history_scanned_at ON public.qr_scan_history(scanned_at DESC);
