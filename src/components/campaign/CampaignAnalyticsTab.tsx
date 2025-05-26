
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Campaign } from '@/types/campaign';

interface CampaignAnalyticsTabProps {
  campaigns: Campaign[];
}

export const CampaignAnalyticsTab = ({ campaigns }: CampaignAnalyticsTabProps) => {
  const totalCampaigns = campaigns.length;
  const totalScans = campaigns.reduce((sum, campaign) => sum + (campaign.scans || 0), 0);
  const totalQRCodes = campaigns.reduce((sum, campaign) => sum + campaign.qrCodes.length, 0);
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCampaigns}</div>
            <p className="text-xs text-muted-foreground">
              {activeCampaigns} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalScans.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all campaigns</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active QR Codes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQRCodes}</div>
            <p className="text-xs text-muted-foreground">Across all campaigns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Avg. Scans per QR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalQRCodes > 0 ? Math.round(totalScans / totalQRCodes) : 0}
            </div>
            <p className="text-xs text-muted-foreground">Average engagement</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
        </CardHeader>
        <CardContent>
          {campaigns.length > 0 ? (
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{campaign.name}</h4>
                    <p className="text-sm text-gray-600">
                      {campaign.qrCodes.length} QR codes • {campaign.scans || 0} scans
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      {campaign.qrCodes.length > 0 
                        ? Math.round((campaign.scans || 0) / campaign.qrCodes.length) 
                        : 0
                      }
                    </div>
                    <p className="text-xs text-gray-500">avg. scans/QR</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">
              No campaigns available for analytics. Create your first campaign to see performance data.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
