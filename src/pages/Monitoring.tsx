
import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { PerformanceMonitor } from '@/components/monitoring/PerformanceMonitor';

const Monitoring = () => {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1 ml-60">
            <SidebarInset>
              <DashboardTopbar />
              <main className="flex-1 overflow-y-auto">
                <PerformanceMonitor />
              </main>
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Monitoring;
