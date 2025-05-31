
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
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col min-w-0">
          <DashboardTopbar />
          
          {/* Header Section */}
          <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Analytics</h1>
                <p className="text-sm text-gray-600 mt-1">Track your QR code performance and scan analytics</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
              {/* Filters */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
                <AnalyticsFilters />
              </div>
              
              {/* Tabs Content */}
              <Tabs defaultValue="overview" className="w-full">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-0">
                    <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full max-w-2xl">
                      <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
                      <TabsTrigger value="insights" className="text-sm">Insights</TabsTrigger>
                      <TabsTrigger value="advanced" className="text-sm">Advanced</TabsTrigger>
                      <TabsTrigger value="interactions" className="text-sm">Interactions</TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <div className="p-4 sm:p-6">
                    <TabsContent value="overview" className="space-y-4 sm:space-y-6 m-0">
                      <AnalyticsStats />
                      
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
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
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Analytics;
