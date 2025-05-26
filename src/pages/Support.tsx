
import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { SupportTabs } from '@/components/support/SupportTabs';

const Support = () => {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset>
            <DashboardTopbar />
            <main className="flex-1 p-6">
              <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Support & Help</h1>
                  <p className="text-gray-600">Get help with your account and submit support tickets</p>
                </div>
                <SupportTabs />
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Support;
