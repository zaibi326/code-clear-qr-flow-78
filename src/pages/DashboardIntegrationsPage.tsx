
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
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Integrations</h1>
                <p className="text-gray-600">Connect your favorite tools and services</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm border">
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
