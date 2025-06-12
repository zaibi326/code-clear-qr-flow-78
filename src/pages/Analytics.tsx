
import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { SystemHierarchyDefinition } from '@/components/dashboard/SystemHierarchyDefinition';
import { EnhancedScanAnalytics } from '@/components/analytics/EnhancedScanAnalytics';
import { LeadListManager } from '@/components/lead-management/LeadListManager';
import { AnalyticsOverview } from '@/components/analytics/AnalyticsOverview';
import { AdvancedAnalytics } from '@/components/analytics/AdvancedAnalytics';
import { UserInteractionLog } from '@/components/analytics/UserInteractionLog';
import { CampaignInsights } from '@/components/analytics/CampaignInsights';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Analytics = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50" style={{ boxSizing: 'border-box' }}>
        <AppSidebar />
        <main className="flex-1 flex flex-col min-w-0 ml-0 md:ml-[240px] transition-all duration-300 max-w-full" style={{ boxSizing: 'border-box' }}>
          <DashboardTopbar />
          
          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
              {/* System Hierarchy Definition */}
              <SystemHierarchyDefinition />
              
              {/* Tabs Content */}
              <Tabs defaultValue="enhanced" className="w-full">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="px-6 pt-6 pb-0">
                    <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full max-w-4xl">
                      <TabsTrigger value="enhanced" className="text-sm">Enhanced Analytics</TabsTrigger>
                      <TabsTrigger value="lead-management" className="text-sm">Lead Management</TabsTrigger>
                      <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
                      <TabsTrigger value="insights" className="text-sm">Insights</TabsTrigger>
                      <TabsTrigger value="advanced" className="text-sm">Advanced</TabsTrigger>
                      <TabsTrigger value="interactions" className="text-sm">Interactions</TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <div className="p-6">
                    <TabsContent value="enhanced" className="space-y-6 m-0">
                      <EnhancedScanAnalytics />
                    </TabsContent>

                    <TabsContent value="lead-management" className="m-0">
                      <LeadListManager />
                    </TabsContent>

                    <TabsContent value="overview" className="space-y-6 m-0">
                      <AnalyticsOverview />
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
