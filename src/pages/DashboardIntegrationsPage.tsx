
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { DashboardIntegrations } from '@/components/dashboard/DashboardIntegrations';

const DashboardIntegrationsPage = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar 
          isCollapsed={isSidebarCollapsed} 
          setIsCollapsed={setIsSidebarCollapsed} 
        />
        <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-60'}`}>
          <DashboardTopbar toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
          <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50">
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Integrations</h1>
                <p className="text-gray-600">Connect your favorite tools and services</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
                <DashboardIntegrations />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardIntegrationsPage;
