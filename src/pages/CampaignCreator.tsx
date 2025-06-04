
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
import { Button } from '@/components/ui/button';
import { Megaphone, Target, TrendingUp, Users, Plus, Eye, BarChart3 } from 'lucide-react';

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
      bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
      lightBg: 'bg-blue-50',
      change: '+18%'
    },
    {
      title: 'Total Reach',
      value: '45.2K',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
      lightBg: 'bg-green-50',
      change: '+28%'
    },
    {
      title: 'Conversion Rate',
      value: '8.4%',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-r from-purple-500 to-purple-600',
      lightBg: 'bg-purple-50',
      change: '+5.2%'
    },
    {
      title: 'Growth',
      value: '+24%',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-gradient-to-r from-orange-500 to-orange-600',
      lightBg: 'bg-orange-50',
      change: '+12%'
    }
  ];

  const handleCampaignCreate = (campaign: Campaign) => {
    setCampaigns(prev => [campaign, ...prev]);
    setShowWizard(false);
    setActiveTab('manage');
    toast({
      title: "Campaign created successfully",
      description: `${campaign.name} has been created and is ready to launch.`,
    });
  };

  const handleStartNewCampaign = () => {
    setShowWizard(true);
    setActiveTab('create');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0 ml-[240px]">
          <DashboardTopbar />
          
          <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
              {/* Header Section */}
              <div className="mb-8 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent mb-2">
                      Campaign Manager
                    </h1>
                    <p className="text-lg text-gray-600">Create, manage, and track your marketing campaigns</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex items-center gap-2 hover:bg-gray-100">
                      <BarChart3 className="h-4 w-4" />
                      View Analytics
                    </Button>
                    <Button 
                      onClick={handleStartNewCampaign}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      New Campaign
                    </Button>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
                {campaignStats.map((stat, index) => (
                  <Card key={index} className="group border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl hover:scale-105 transition-all duration-500">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-4 rounded-2xl ${stat.bgColor} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                          <stat.icon className="h-6 w-6" />
                        </div>
                        <div className="flex items-center gap-1 text-green-600">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm font-medium">{stat.change}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Campaign Management */}
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-gray-200 shadow-2xl animate-fade-in">
                <div className="px-8 pt-8 pb-0">
                  <CampaignCreatorTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
                <div className="p-8">
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
