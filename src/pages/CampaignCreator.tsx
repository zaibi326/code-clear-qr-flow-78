
import React, { useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { CampaignCreatorTabs } from '@/components/campaign/CampaignCreatorTabs';
import { CreateCampaignTab } from '@/components/campaign/CreateCampaignTab';
import { ManageCampaignsTab } from '@/components/campaign/ManageCampaignsTab';
import { CampaignAnalyticsTab } from '@/components/campaign/CampaignAnalyticsTab';
import CampaignWizard from '@/components/campaign/CampaignWizard';
import { Campaign } from '@/types/campaign';
import { useToast } from '@/hooks/use-toast';

const CampaignCreator = () => {
  const [activeTab, setActiveTab] = useState('manage');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showWizard, setShowWizard] = useState(false);
  const { toast } = useToast();

  const handleCampaignCreate = (campaign: Campaign) => {
    setCampaigns(prev => [campaign, ...prev]);
    setShowWizard(false);
    setActiveTab('manage');
    toast({
      title: "Campaign created",
      description: `${campaign.name} has been successfully created.`,
    });
  };

  const handleStartNewCampaign = () => {
    setShowWizard(true);
    setActiveTab('create');
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1 ml-60">
            <SidebarInset>
              <DashboardTopbar />
              <main className="flex-1 p-6 space-y-6 overflow-y-auto">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Campaign Creator</h1>
                  <p className="text-gray-600">Create, manage, and track your marketing campaigns</p>
                </div>

                <CampaignCreatorTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                {activeTab === 'create' && !showWizard && (
                  <CreateCampaignTab onStartCampaign={handleStartNewCampaign} />
                )}
                
                {activeTab === 'create' && showWizard && (
                  <CampaignWizard onCampaignCreate={handleCampaignCreate} />
                )}
                
                {activeTab === 'manage' && (
                  <ManageCampaignsTab 
                    campaigns={campaigns}
                    onCreateNew={handleStartNewCampaign}
                  />
                )}
                
                {activeTab === 'analytics' && (
                  <CampaignAnalyticsTab campaigns={campaigns} />
                )}
              </main>
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default CampaignCreator;
