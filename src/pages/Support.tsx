
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
          <SidebarInset className="flex-1 overflow-hidden">
            <DashboardTopbar />
            <main className="flex-1 overflow-auto">
              <div className="container-responsive py-6 sm:py-8">
                <div className="max-w-4xl mx-auto">
                  <header className="mb-6 sm:mb-8">
                    <h1 className="text-balance mb-2 sm:mb-3">Support & Help</h1>
                    <p className="text-base sm:text-lg text-gray-600 text-balance">
                      Get help with your account and submit support tickets
                    </p>
                  </header>
                  <SupportTabs />
                </div>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Support;
