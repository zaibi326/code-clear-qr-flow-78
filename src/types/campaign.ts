

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'draft' | 'completed' | 'generating';
  type: 'single' | 'bulk';
  qrCodes: QRData[];
  template: any;
  createdAt: Date;
  scans?: number;
  createdDate?: string;
}

export interface QRData {
  id: string;
  url: string;
  scans: number;
  createdAt: string;
  campaignId: string;
  content?: string;
  customData?: Record<string, string>;
}

