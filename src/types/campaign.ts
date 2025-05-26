
export interface Campaign {
  id: number;
  name: string;
  status: 'active' | 'draft' | 'completed';
  qrCodes: number;
  scans: number;
  createdDate: string;
  template: string;
}

export interface QRData {
  id: string;
  url: string;
  scans: number;
  createdAt: string;
  campaignId: string;
}
