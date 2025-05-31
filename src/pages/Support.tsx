
import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { SupportTicketSystem } from '@/components/support/SupportTicketSystem';

const Support = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50" style={{ boxSizing: 'border-box' }}>
        <AppSidebar />
        <main className="flex-1 flex flex-col min-w-0 ml-0 lg:ml-64" style={{ boxSizing: 'border-box' }}>
          <DashboardTopbar />
          
          {/* Header Section */}
          <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Help Center</h1>
                  <p className="text-sm text-gray-600 mt-2">Get help with your QR code campaigns and account management</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <SupportTicketSystem />
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Support;
