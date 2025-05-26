
export interface DatabaseUser {
  id: string;
  email: string;
  name: string;
  company?: string;
  phone?: string;
  avatar_url?: string;
  plan: 'free' | 'pro' | 'enterprise';
  subscription_status: 'active' | 'inactive' | 'cancelled' | 'trial';
  trial_ends_at?: Date;
  created_at: Date;
  updated_at: Date;
  last_login_at?: Date;
  timezone?: string;
  language?: string;
  preferences: {
    notifications: {
      email: boolean;
      scan_alerts: boolean;
      weekly_reports: boolean;
      marketing: boolean;
    };
    dashboard: {
      default_view: 'grid' | 'list';
      items_per_page: number;
    };
  };
  usage_stats: {
    qr_codes_created: number;
    campaigns_created: number;
    total_scans: number;
    storage_used: number; // in bytes
  };
}

export interface DatabaseTemplate {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  file_url: string;
  preview_url: string;
  file_type: 'image/jpeg' | 'image/png' | 'application/pdf';
  file_size: number;
  dimensions: {
    width: number;
    height: number;
  };
  qr_position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  tags: string[];
  is_public: boolean;
  usage_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface DatabaseCampaign {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  template_id: string;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'archived';
  type: 'single' | 'bulk';
  settings: {
    qr_size: number;
    qr_color: string;
    background_color: string;
    error_correction: 'L' | 'M' | 'Q' | 'H';
    format: 'PNG' | 'SVG' | 'PDF';
  };
  target_audience?: string;
  start_date?: Date;
  end_date?: Date;
  budget?: number;
  expected_scans?: number;
  created_at: Date;
  updated_at: Date;
  stats: {
    total_qr_codes: number;
    total_scans: number;
    unique_scans: number;
    conversion_rate: number;
    last_scan_at?: Date;
  };
}

export interface DatabaseQRCode {
  id: string;
  campaign_id: string;
  user_id: string;
  name?: string;
  content: string;
  content_type: 'url' | 'text' | 'email' | 'phone' | 'sms' | 'wifi' | 'vcard';
  qr_image_url: string;
  pdf_url?: string;
  short_url?: string;
  custom_data?: Record<string, any>;
  is_active: boolean;
  expires_at?: Date;
  password_protected: boolean;
  password_hash?: string;
  created_at: Date;
  updated_at: Date;
  stats: {
    total_scans: number;
    unique_scans: number;
    last_scan_at?: Date;
    first_scan_at?: Date;
  };
}

export interface DatabaseScanEvent {
  id: string;
  qr_code_id: string;
  campaign_id: string;
  user_id: string;
  timestamp: Date;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  location?: {
    country?: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    timezone?: string;
  };
  device: {
    type: 'mobile' | 'tablet' | 'desktop';
    brand?: string;
    model?: string;
    browser?: string;
    browser_version?: string;
    os?: string;
    os_version?: string;
    screen_resolution?: string;
  };
  session: {
    session_id: string;
    is_new_session: boolean;
    duration?: number; // in seconds
  };
  conversion?: {
    action: string;
    value?: number;
    currency?: string;
  };
}

export interface DatabaseProject {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  color: string;
  is_archived: boolean;
  created_at: Date;
  updated_at: Date;
  stats: {
    campaigns_count: number;
    qr_codes_count: number;
    total_scans: number;
    last_activity_at?: Date;
  };
}

export interface DatabaseSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'past_due' | 'cancelled' | 'unpaid';
  current_period_start: Date;
  current_period_end: Date;
  cancel_at_period_end: boolean;
  cancelled_at?: Date;
  trial_start?: Date;
  trial_end?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface DatabaseApiKey {
  id: string;
  user_id: string;
  name: string;
  key_hash: string;
  permissions: string[];
  last_used_at?: Date;
  expires_at?: Date;
  is_active: boolean;
  created_at: Date;
}

export interface DatabaseAuditLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  timestamp: Date;
}
