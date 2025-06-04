
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { CampaignCreatorTabs } from '@/components/campaign/CampaignCreatorTabs';
import { CreateCampaignTab } from '@/components/campaign/CreateCampaignTab';
import { ManageCampaignsTab } from '@/components/campaign/ManageCampaignsTab';
import { CampaignAnalyticsTab } from '@/components/campaign/CampaignAnalyticsTab';
import CampaignWizard from '@/components/campaign/CampaignWizard';
import { Campaign } from '@/types/campaign';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Megaphone, Target, TrendingUp, Users } from 'lucide-react';

const CampaignCreator = () => {
  const [activeTab, setActiveTab] = useState('manage');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showWizard, setShowWizard] = useState(false);
  const { toast } = useToast();

  const campaignStats = [
    {
      title: 'Active Campaigns',
      value: '12',
      icon: Megaphone,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Reach',
      value: '45.2K',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Conversion Rate',
      value: '8.4%',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Growth',
      value: '+24%',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

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
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 via-orange-50 to-red-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0 ml-[240px]">
          <DashboardTopbar />
          
          <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
              {/* Header Section */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  Campaign Manager
                </h1>
                <p className="text-gray-600">Create, manage, and track your marketing campaigns</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {campaignStats.map((stat, index) => (
                  <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                          <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Campaign Management */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg">
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
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CampaignCreator;
