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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Analytics = () => {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset>
            <DashboardTopbar />
            <main className="flex-1 p-6 space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
                <p className="text-gray-600">Track your QR code performance and scan analytics</p>
              </div>
              
              <AnalyticsFilters />
              
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid grid-cols-4 mb-6 w-[600px]">
                  <TabsTrigger value="overview">Overview Dashboard</TabsTrigger>
                  <TabsTrigger value="insights">Campaign Insights</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced Analytics</TabsTrigger>
                  <TabsTrigger value="interactions">User Interactions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <AnalyticsStats />
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ScanActivityChart />
                    <CampaignPerformanceChart />
                  </div>
                  
                  <QRCodeTable />
                </TabsContent>

                <TabsContent value="insights">
                  <CampaignInsights />
                </TabsContent>
                
                <TabsContent value="advanced">
                  <AdvancedAnalytics />
                </TabsContent>
                
                <TabsContent value="interactions">
                  <UserInteractionLog />
                </TabsContent>
              </Tabs>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

// Import these components to prevent build errors
import { ScanActivityChart } from '@/components/analytics/ScanActivityChart';
import { CampaignPerformanceChart } from '@/components/analytics/CampaignPerformanceChart';

export default Analytics;
