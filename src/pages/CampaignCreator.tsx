
import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { CampaignCreatorTabs } from '@/components/campaign/CampaignCreatorTabs';
import { CreateCampaignTab } from '@/components/campaign/CreateCampaignTab';
import { ManageCampaignsTab } from '@/components/campaign/ManageCampaignsTab';
import { CampaignAnalyticsTab } from '@/components/campaign/CampaignAnalyticsTab';
import { Card, CardContent } from '@/components/ui/card';
import { Campaign } from '@/types/campaign';
import { 
  Zap, 
  Target, 
  BarChart3, 
  Users, 
  TrendingUp
} from 'lucide-react';

const CampaignCreator = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  // Load campaigns from localStorage on component mount
  useEffect(() => {
    const savedCampaigns = localStorage.getItem('campaigns');
    if (savedCampaigns) {
      try {
        const parsedCampaigns = JSON.parse(savedCampaigns);
        // Convert date strings back to Date objects
        const campaignsWithDates = parsedCampaigns.map((campaign: any) => ({
          ...campaign,
          createdAt: new Date(campaign.createdAt)
        }));
        setCampaigns(campaignsWithDates);
      } catch (error) {
        console.error('Error loading campaigns from localStorage:', error);
        setCampaigns([]);
      }
    }
  }, []);

  const campaignStats = [
    {
      title: 'Active Campaigns',
      value: campaigns.filter(c => c.status === 'active').length.toString(),
      icon: Zap,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
      lightBg: 'bg-blue-50',
      change: '+8'
    },
    {
      title: 'Total Campaigns',
      value: campaigns.length.toString(),
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
      lightBg: 'bg-green-50',
      change: '+23%'
    },
    {
      title: 'Total QR Codes',
      value: campaigns.reduce((sum, c) => sum + c.qrCodes.length, 0).toString(),
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-r from-purple-500 to-purple-600',
      lightBg: 'bg-purple-50',
      change: '+3.2%'
    },
    {
      title: 'Total Scans',
      value: campaigns.reduce((sum, c) => sum + (c.scans || 0), 0).toString(),
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-gradient-to-r from-orange-500 to-orange-600',
      lightBg: 'bg-orange-50',
      change: '+15%'
    }
  ];

  const handleCampaignCreate = (campaign: Campaign) => {
    setCampaigns(prev => {
      const updated = [campaign, ...prev];
      return updated;
    });
  };

  const handleCampaignUpdate = (updatedCampaign: Campaign) => {
    setCampaigns(prev => {
      const updated = prev.map(campaign => 
        campaign.id === updatedCampaign.id ? updatedCampaign : campaign
      );
      return updated;
    });
  };

  const handleCampaignDelete = (campaignId: string) => {
    setCampaigns(prev => {
      const updated = prev.filter(campaign => campaign.id !== campaignId);
      return updated;
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'create':
        return <CreateCampaignTab onCampaignCreate={handleCampaignCreate} />;
      case 'manage':
        return (
          <ManageCampaignsTab 
            campaigns={campaigns}
            onCampaignUpdate={handleCampaignUpdate}
            onCampaignDelete={handleCampaignDelete}
          />
        );
      case 'analytics':
        return <CampaignAnalyticsTab campaigns={campaigns} />;
      default:
        return <CreateCampaignTab onCampaignCreate={handleCampaignCreate} />;
    }
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
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      Campaign Creator
                    </h1>
                    <p className="text-lg text-gray-600">Design, launch, and manage powerful QR code campaigns</p>
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
                        <div className={`flex items-center gap-1 ${stat.change.includes('+') || stat.change.includes('%') ? 'text-green-600' : 'text-blue-600'}`}>
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

              {/* Campaign Creator Content */}
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-gray-200 shadow-2xl animate-fade-in">
                <div className="px-8 pt-8 pb-0">
                  <CampaignCreatorTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
                <div className="p-8">
                  {renderTabContent()}
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
