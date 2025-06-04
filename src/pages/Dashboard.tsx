
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { QRCodeManagement } from '@/components/dashboard/QRCodeManagement';
import { PerformanceMetrics } from '@/components/dashboard/PerformanceMetrics';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50" style={{ boxSizing: 'border-box' }}>
        <AppSidebar />
        <main className="flex-1 flex flex-col min-w-0 ml-0 md:ml-[240px] transition-all duration-300 max-w-full" style={{ boxSizing: 'border-box' }}>
          <DashboardTopbar />
          
          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
              {/* Tabs Content */}
              <Tabs defaultValue="overview" className="w-full">
                <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-gray-200 shadow-2xl">
                  <div className="px-6 pt-6 pb-0">
                    <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full max-w-2xl">
                      <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
                      <TabsTrigger value="qrcodes" className="text-sm">QR Codes</TabsTrigger>
                      <TabsTrigger value="performance" className="text-sm">Performance</TabsTrigger>
                      <TabsTrigger value="activity" className="text-sm">Activity</TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <div className="p-6">
                    <TabsContent value="overview" className="space-y-6 m-0">
                      <DashboardOverview />
                    </TabsContent>

                    <TabsContent value="qrcodes" className="m-0">
                      <QRCodeManagement />
                    </TabsContent>
                    
                    <TabsContent value="performance" className="m-0">
                      <PerformanceMetrics />
                    </TabsContent>
                    
                    <TabsContent value="activity" className="m-0">
                      <RecentActivity />
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

export default Dashboard;
