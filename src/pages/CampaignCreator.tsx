
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
        <SidebarInset className="flex-1 flex flex-col min-w-0 ml-0">
          <DashboardTopbar />
          
          {/* Header Section */}
          <div className="bg-white border-b border-gray-200 px-6 lg:px-8 py-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Campaigns</h1>
                  <p className="text-sm text-gray-600 mt-2">Create, manage, and track your marketing campaigns</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="px-6 pt-6 pb-0">
                  <CampaignCreatorTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
                <div className="p-6">
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
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default CampaignCreator;
