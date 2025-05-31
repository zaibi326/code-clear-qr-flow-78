
import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { SupportTicketSystem } from '@/components/support/SupportTicketSystem';

const Support = () => {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1 ml-60">
            <SidebarInset>
              <DashboardTopbar />
              <main className="flex-1 p-6 space-y-6 overflow-y-auto">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Center</h1>
                  <p className="text-gray-600">Get help with your QR code campaigns and account management</p>
                </div>
                
                <SupportTicketSystem />
              </main>
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Support;
