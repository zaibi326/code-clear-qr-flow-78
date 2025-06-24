
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { RealTimeDashboard } from '@/components/dashboard/RealTimeDashboard';
import { QRCodePreviewGrid } from '@/components/dashboard/QRCodePreviewGrid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Grid3X3, Activity } from 'lucide-react';

const EnhancedDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-w-0 ml-0 md:ml-[240px] transition-all duration-300 max-w-full">
          <DashboardTopbar />
          
          <div className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {/* Enhanced Header */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 text-white mb-6">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-white/5 rounded-full blur-lg"></div>
                
                <div className="relative z-10">
                  <h1 className="text-4xl font-bold mb-2">Enhanced Analytics Dashboard</h1>
                  <p className="text-blue-100 text-lg">
                    Real-time insights, visual QR previews, and comprehensive scan analytics
                  </p>
                </div>
              </div>

              {/* Main Dashboard Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 w-full max-w-lg mb-8">
                  <TabsTrigger value="analytics" className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger value="gallery" className="flex items-center gap-2">
                    <Grid3X3 className="w-4 h-4" />
                    QR Gallery
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Live Activity
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="analytics" className="space-y-6">
                  <RealTimeDashboard />
                </TabsContent>
                
                <TabsContent value="gallery" className="space-y-6">
                  <QRCodePreviewGrid />
                </TabsContent>
                
                <TabsContent value="activity" className="space-y-6">
                  <RealTimeDashboard />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default EnhancedDashboard;
