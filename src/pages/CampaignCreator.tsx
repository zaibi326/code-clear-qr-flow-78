
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <DashboardTopbar />
          <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto">
            <div className="max-w-full mx-auto space-y-4 lg:space-y-6">
              <div className="mb-4 lg:mb-6">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Campaign Creator</h1>
                <p className="text-sm sm:text-base text-gray-600">Create, manage, and track your marketing campaigns</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-4 lg:p-6">
                <CampaignCreatorTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                <div className="mt-4 lg:mt-6">
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
                </div>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default CampaignCreator;
