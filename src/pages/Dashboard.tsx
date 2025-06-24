
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { EnhancedDashboardStats } from '@/components/dashboard/EnhancedDashboardStats';
import { QRCodeDatabase } from '@/components/dashboard/QRCodeDatabase';
import { ProjectCampaignHierarchy } from '@/components/dashboard/ProjectCampaignHierarchy';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  console.log('Dashboard component rendering - checking for Select issues');
  
  // Mock data - in real app this would come from your database
  const dashboardData = {
    totalQRCodes: 1247,
    totalScans: 15420,
    uniqueScans: 12340,
    activeCampaigns: 8,
    totalProjects: 4,
    recentScans: [
      {
        qrName: 'Summer Landing Page',
        project: 'Summer Marketing 2024',
        location: 'New York, US',
        time: '2 min ago'
      },
      {
        qrName: 'Product Demo',
        project: 'Product Launch Q4',
        location: 'California, US',
        time: '5 min ago'
      },
      {
        qrName: 'Holiday Promo',
        project: 'Holiday Promotions',
        location: 'Texas, US',
        time: '8 min ago'
      }
    ]
  };

  console.log('About to render QRCodeDatabase component');
  console.log('About to render ProjectCampaignHierarchy component');

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50" style={{ boxSizing: 'border-box' }}>
        <AppSidebar />
        <main className="flex-1 flex flex-col min-w-0 ml-0 md:ml-[240px] transition-all duration-300 max-w-full" style={{ boxSizing: 'border-box' }}>
          <DashboardTopbar />
          
          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
              {/* Header Section */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 text-white">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-white/5 rounded-full blur-lg"></div>
                
                <div className="relative z-10">
                  <h1 className="text-4xl font-bold mb-2">Enhanced QR Dashboard</h1>
                  <p className="text-blue-100 text-lg">Complete visibility into your QR code performance and database</p>
                </div>
              </div>

              {/* Enhanced Stats */}
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-gray-200 shadow-2xl p-6">
                <EnhancedDashboardStats {...dashboardData} />
              </div>

              {/* Tabs for different views */}
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-gray-200 shadow-2xl">
                <Tabs defaultValue="qr-codes" className="w-full">
                  <div className="px-6 pt-6 pb-0">
                    <TabsList className="grid grid-cols-2 w-full max-w-lg">
                      <TabsTrigger value="qr-codes" className="text-sm">QR Codes</TabsTrigger>
                      <TabsTrigger value="projects" className="text-sm">Projects</TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <div className="p-6">
                    <TabsContent value="qr-codes" className="space-y-6 m-0">
                      <QRCodeDatabase />
                    </TabsContent>
                    
                    <TabsContent value="projects" className="m-0">
                      <ProjectCampaignHierarchy />
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
