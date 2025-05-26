
export interface ScanEvent {
  id: string;
  qrCodeId: string;
  campaignId: string;
  timestamp: Date;
  userAgent?: string;
  ipAddress?: string;
  location?: {
    country?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
  device?: {
    type: 'mobile' | 'tablet' | 'desktop';
    browser?: string;
    os?: string;
  };
  referrer?: string;
}

export interface AnalyticsData {
  totalScans: number;
  uniqueScans: number;
  scansByDate: Array<{ date: string; scans: number }>;
  scansByDevice: Array<{ device: string; scans: number; percentage: number }>;
  scansByLocation: Array<{ location: string; scans: number; percentage: number }>;
  topCampaigns: Array<{ campaignId: string; name: string; scans: number }>;
  recentScans: ScanEvent[];
}

export const processAnalyticsData = (scans: ScanEvent[]): AnalyticsData => {
  const totalScans = scans.length;
  const uniqueIPs = new Set(scans.map(scan => scan.ipAddress).filter(Boolean));
  const uniqueScans = uniqueIPs.size;

  // Group scans by date
  const scansByDate = groupScansByDate(scans);
  
  // Group scans by device
  const scansByDevice = groupScansByDevice(scans);
  
  // Group scans by location
  const scansByLocation = groupScansByLocation(scans);
  
  // Get top campaigns
  const topCampaigns = getTopCampaigns(scans);
  
  // Get recent scans (last 10)
  const recentScans = scans
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 10);

  return {
    totalScans,
    uniqueScans,
    scansByDate,
    scansByDevice,
    scansByLocation,
    topCampaigns,
    recentScans
  };
};

const groupScansByDate = (scans: ScanEvent[]): Array<{ date: string; scans: number }> => {
  const dateGroups: Record<string, number> = {};
  
  scans.forEach(scan => {
    const date = scan.timestamp.toISOString().split('T')[0];
    dateGroups[date] = (dateGroups[date] || 0) + 1;
  });

  return Object.entries(dateGroups)
    .map(([date, scans]) => ({ date, scans }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

const groupScansByDevice = (scans: ScanEvent[]): Array<{ device: string; scans: number; percentage: number }> => {
  const deviceGroups: Record<string, number> = {};
  
  scans.forEach(scan => {
    const device = scan.device?.type || 'unknown';
    deviceGroups[device] = (deviceGroups[device] || 0) + 1;
  });

  const total = scans.length;
  return Object.entries(deviceGroups)
    .map(([device, scans]) => ({
      device,
      scans,
      percentage: Math.round((scans / total) * 100)
    }))
    .sort((a, b) => b.scans - a.scans);
};

const groupScansByLocation = (scans: ScanEvent[]): Array<{ location: string; scans: number; percentage: number }> => {
  const locationGroups: Record<string, number> = {};
  
  scans.forEach(scan => {
    const location = scan.location?.country || 'Unknown';
    locationGroups[location] = (locationGroups[location] || 0) + 1;
  });

  const total = scans.length;
  return Object.entries(locationGroups)
    .map(([location, scans]) => ({
      location,
      scans,
      percentage: Math.round((scans / total) * 100)
    }))
    .sort((a, b) => b.scans - a.scans);
};

const getTopCampaigns = (scans: ScanEvent[]): Array<{ campaignId: string; name: string; scans: number }> => {
  const campaignGroups: Record<string, number> = {};
  
  scans.forEach(scan => {
    campaignGroups[scan.campaignId] = (campaignGroups[scan.campaignId] || 0) + 1;
  });

  return Object.entries(campaignGroups)
    .map(([campaignId, scans]) => ({
      campaignId,
      name: `Campaign ${campaignId}`, // In real app, fetch actual name
      scans
    }))
    .sort((a, b) => b.scans - a.scans)
    .slice(0, 5);
};

export const generateAnalyticsReport = (data: AnalyticsData): string => {
  return `Analytics Report
=================

Total Scans: ${data.totalScans}
Unique Scans: ${data.uniqueScans}

Top Devices:
${data.scansByDevice.map(d => `- ${d.device}: ${d.scans} (${d.percentage}%)`).join('\n')}

Top Locations:
${data.scansByLocation.slice(0, 5).map(l => `- ${l.location}: ${l.scans} (${l.percentage}%)`).join('\n')}

Top Campaigns:
${data.topCampaigns.map(c => `- ${c.name}: ${c.scans} scans`).join('\n')}
`;
};

export const exportAnalyticsToCSV = (scans: ScanEvent[]): string => {
  const headers = ['ID', 'QR Code ID', 'Campaign ID', 'Timestamp', 'Device Type', 'Browser', 'OS', 'Country', 'City', 'IP Address'];
  
  const rows = scans.map(scan => [
    scan.id,
    scan.qrCodeId,
    scan.campaignId,
    scan.timestamp.toISOString(),
    scan.device?.type || '',
    scan.device?.browser || '',
    scan.device?.os || '',
    scan.location?.country || '',
    scan.location?.city || '',
    scan.ipAddress || ''
  ]);

  return [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
};
