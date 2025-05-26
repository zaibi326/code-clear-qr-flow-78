
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import CampaignWizard from '@/components/campaign/CampaignWizard';
import { Template } from '@/types/template';

export interface QRData {
  id: string;
  content: string;
  customData?: Record<string, string>;
}

export interface Campaign {
  id: string;
  name: string;
  template: Template;
  qrCodes: QRData[];
  createdAt: Date;
  status: 'draft' | 'generating' | 'completed';
}

const CampaignCreator = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  const handleCampaignCreate = (campaign: Campaign) => {
    setCampaigns(prev => [...prev, campaign]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Campaign Creator</h1>
          <p className="text-gray-600">Create QR code campaigns with your marketing templates</p>
        </div>

        <CampaignWizard onCampaignCreate={handleCampaignCreate} />
      </div>
    </div>
  );
};

export default CampaignCreator;
