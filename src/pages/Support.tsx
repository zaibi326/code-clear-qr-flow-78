
import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { SupportTicketSystem } from '@/components/support/SupportTicketSystem';

const Support = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <DashboardTopbar />
          <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto">
            <div className="max-w-full mx-auto space-y-4 lg:space-y-6">
              <div className="mb-4 lg:mb-6">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Support Center</h1>
                <p className="text-sm sm:text-base text-gray-600">Get help with your QR code campaigns and account management</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-4 lg:p-6">
                <SupportTicketSystem />
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Support;
