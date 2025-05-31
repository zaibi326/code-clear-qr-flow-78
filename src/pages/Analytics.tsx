import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { AnalyticsFilters } from '@/components/analytics/AnalyticsFilters';
import { AnalyticsStats } from '@/components/analytics/AnalyticsStats';
import { AdvancedAnalytics } from '@/components/analytics/AdvancedAnalytics';
import { QRCodeTable } from '@/components/analytics/QRCodeTable';
import { UserInteractionLog } from '@/components/analytics/UserInteractionLog';
import { CampaignInsights } from '@/components/analytics/CampaignInsights';
import { ScanActivityChart } from '@/components/analytics/ScanActivityChart';
import { CampaignPerformanceChart } from '@/components/analytics/CampaignPerformanceChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Analytics = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50" style={{ boxSizing: 'border-box' }}>
        <AppSidebar />
        <main className="flex-1 flex flex-col min-w-0 ml-0 lg:ml-64" style={{ boxSizing: 'border-box' }}>
          <DashboardTopbar />
          
          {/* Header Section */}
          <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Analytics</h1>
                  <p className="text-sm text-gray-600 mt-2">Track your QR code performance and scan analytics</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
              {/* Filters */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <AnalyticsFilters />
              </div>
              
              {/* Tabs Content */}
              <Tabs defaultValue="overview" className="w-full">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="px-6 pt-6 pb-0">
                    <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full max-w-2xl">
                      <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
                      <TabsTrigger value="insights" className="text-sm">Insights</TabsTrigger>
                      <TabsTrigger value="advanced" className="text-sm">Advanced</TabsTrigger>
                      <TabsTrigger value="interactions" className="text-sm">Interactions</TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <div className="p-6">
                    <TabsContent value="overview" className="space-y-6 m-0">
                      <AnalyticsStats />
                      
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <ScanActivityChart />
                        <CampaignPerformanceChart />
                      </div>
                      
                      <QRCodeTable />
                    </TabsContent>

                    <TabsContent value="insights" className="m-0">
                      <CampaignInsights />
                    </TabsContent>
                    
                    <TabsContent value="advanced" className="m-0">
                      <AdvancedAnalytics />
                    </TabsContent>
                    
                    <TabsContent value="interactions" className="m-0">
                      <UserInteractionLog />
                    </TabsContent>
                  </div>
                </div>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Analytics;
