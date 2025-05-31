
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
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 ml-60">
          <SidebarInset>
            <DashboardTopbar />
            <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50">
              <div className="max-w-7xl mx-auto space-y-6">
                <div className="mb-6">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
                  <p className="text-gray-600">Track your QR code performance and scan analytics</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
                  <AnalyticsFilters />
                </div>
                
                <Tabs defaultValue="overview" className="w-full">
                  <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
                    <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6 w-full max-w-2xl">
                      <TabsTrigger value="overview" className="text-xs md:text-sm">Overview</TabsTrigger>
                      <TabsTrigger value="insights" className="text-xs md:text-sm">Insights</TabsTrigger>
                      <TabsTrigger value="advanced" className="text-xs md:text-sm">Advanced</TabsTrigger>
                      <TabsTrigger value="interactions" className="text-xs md:text-sm">Interactions</TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="overview" className="space-y-6 mt-6">
                    <AnalyticsStats />
                    
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                      <ScanActivityChart />
                      <CampaignPerformanceChart />
                    </div>
                    
                    <QRCodeTable />
                  </TabsContent>

                  <TabsContent value="insights" className="mt-6">
                    <CampaignInsights />
                  </TabsContent>
                  
                  <TabsContent value="advanced" className="mt-6">
                    <AdvancedAnalytics />
                  </TabsContent>
                  
                  <TabsContent value="interactions" className="mt-6">
                    <UserInteractionLog />
                  </TabsContent>
                </Tabs>
              </div>
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Analytics;
