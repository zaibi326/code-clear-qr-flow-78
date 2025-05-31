
import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { PerformanceMonitor } from '@/components/monitoring/PerformanceMonitor';

const Monitoring = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <DashboardTopbar />
          <div className="flex flex-col h-[calc(100vh-4rem)]">
            <div className="flex-none bg-white border-b px-8 py-6">
              <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-semibold text-gray-900">Activity Monitor</h1>
                <p className="text-sm text-gray-600 mt-1">Monitor system performance and activity logs</p>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto bg-gray-50">
              <div className="max-w-7xl mx-auto px-8 py-6">
                <div className="bg-white rounded-lg border shadow-sm">
                  <PerformanceMonitor />
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Monitoring;
