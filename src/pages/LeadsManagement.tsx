
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { LeadListManager } from '@/components/leads/LeadListManager';

const LeadsManagement = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0 ml-[240px]">
          <DashboardTopbar />
          
          <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  Leads Management
                </h1>
                <p className="text-lg text-gray-600">
                  Import, organize, and manage your lead data with CSV/Excel support
                </p>
              </div>
              
              <LeadListManager />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default LeadsManagement;
