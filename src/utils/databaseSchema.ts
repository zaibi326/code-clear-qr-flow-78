
export interface DatabaseSchema {
  users: {
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
    preferences: UserPreferences;
    usage_stats: UsageStats;
  };
  
  templates: {
    id: string;
    user_id: string;
    name: string;
    description?: string;
    file_url: string;
    preview_url: string;
    file_type: 'image/jpeg' | 'image/png' | 'application/pdf';
    file_size: number;
    dimensions: { width: number; height: number; };
    qr_position?: QRPosition;
    tags: string[];
    is_public: boolean;
    usage_count: number;
    created_at: Date;
    updated_at: Date;
  };
  
  campaigns: {
    id: string;
    user_id: string;
    project_id?: string;
    name: string;
    description?: string;
    template_id: string;
    status: 'draft' | 'active' | 'paused' | 'completed' | 'archived';
    type: 'single' | 'bulk';
    settings: CampaignSettings;
    target_audience?: string;
    start_date?: Date;
    end_date?: Date;
    budget?: number;
    expected_scans?: number;
    created_at: Date;
    updated_at: Date;
    stats: CampaignStats;
  };
  
  qr_codes: {
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
    stats: QRStats;
  };
  
  scan_events: {
    id: string;
    qr_code_id: string;
    campaign_id: string;
    user_id: string;
    timestamp: Date;
    ip_address?: string;
    user_agent?: string;
    referrer?: string;
    location?: LocationData;
    device: DeviceData;
    session: SessionData;
    conversion?: ConversionData;
  };
  
  projects: {
    id: string;
    user_id: string;
    name: string;
    description?: string;
    color: string;
    is_archived: boolean;
    created_at: Date;
    updated_at: Date;
    stats: ProjectStats;
  };
  
  support_tickets: {
    id: string;
    user_id: string;
    subject: string;
    description: string;
    category: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    attachments?: string[];
    assigned_to?: string;
    created_at: Date;
    updated_at: Date;
    resolved_at?: Date;
  };
}

interface UserPreferences {
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
}

interface UsageStats {
  qr_codes_created: number;
  campaigns_created: number;
  total_scans: number;
  storage_used: number;
}

interface QRPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CampaignSettings {
  qr_size: number;
  qr_color: string;
  background_color: string;
  error_correction: 'L' | 'M' | 'Q' | 'H';
  format: 'PNG' | 'SVG' | 'PDF';
}

interface CampaignStats {
  total_qr_codes: number;
  total_scans: number;
  unique_scans: number;
  conversion_rate: number;
  last_scan_at?: Date;
}

interface QRStats {
  total_scans: number;
  unique_scans: number;
  last_scan_at?: Date;
  first_scan_at?: Date;
}

interface LocationData {
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
}

interface DeviceData {
  type: 'mobile' | 'tablet' | 'desktop';
  brand?: string;
  model?: string;
  browser?: string;
  browser_version?: string;
  os?: string;
  os_version?: string;
  screen_resolution?: string;
}

interface SessionData {
  session_id: string;
  is_new_session: boolean;
  duration?: number;
}

interface ConversionData {
  action: string;
  value?: number;
  currency?: string;
}

interface ProjectStats {
  campaigns_count: number;
  qr_codes_count: number;
  total_scans: number;
  last_activity_at?: Date;
}

export const createIndexes = () => {
  return {
    users: ['email', 'plan', 'subscription_status', 'created_at'],
    templates: ['user_id', 'is_public', 'created_at', 'usage_count'],
    campaigns: ['user_id', 'project_id', 'status', 'created_at'],
    qr_codes: ['campaign_id', 'user_id', 'is_active', 'created_at'],
    scan_events: ['qr_code_id', 'campaign_id', 'user_id', 'timestamp'],
    projects: ['user_id', 'is_archived', 'created_at'],
    support_tickets: ['user_id', 'status', 'priority', 'created_at']
  };
};

export const createConstraints = () => {
  return {
    foreign_keys: [
      'templates.user_id -> users.id',
      'campaigns.user_id -> users.id',
      'campaigns.template_id -> templates.id',
      'campaigns.project_id -> projects.id',
      'qr_codes.campaign_id -> campaigns.id',
      'qr_codes.user_id -> users.id',
      'scan_events.qr_code_id -> qr_codes.id',
      'scan_events.campaign_id -> campaigns.id',
      'scan_events.user_id -> users.id',
      'projects.user_id -> users.id',
      'support_tickets.user_id -> users.id'
    ],
    unique_constraints: [
      'users.email',
      'templates.user_id,name',
      'campaigns.user_id,name',
      'projects.user_id,name'
    ]
  };
};
