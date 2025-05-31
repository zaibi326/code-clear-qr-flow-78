
import React, { useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { DashboardIntegrations } from '@/components/dashboard/DashboardIntegrations';

const DashboardIntegrationsPage = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar 
          isCollapsed={isSidebarCollapsed} 
          setIsCollapsed={setIsSidebarCollapsed} 
        />
        <SidebarInset className="flex-1">
          <DashboardTopbar toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
          <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto">
            <div className="max-w-full mx-auto space-y-4 lg:space-y-6">
              <div className="mb-4 lg:mb-6">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Integrations</h1>
                <p className="text-sm sm:text-base text-gray-600">Connect your favorite tools and services</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-4 lg:p-6">
                <DashboardIntegrations />
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardIntegrationsPage;
