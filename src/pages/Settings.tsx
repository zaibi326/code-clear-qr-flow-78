
import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { SettingsTabs } from '@/components/settings/SettingsTabs';

const Settings = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 ml-60">
          <SidebarInset>
            <DashboardTopbar />
            <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50">
              <div className="max-w-6xl mx-auto space-y-6">
                <div className="mb-6">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Settings</h1>
                  <p className="text-gray-600">Manage your account settings and preferences</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
                  <SettingsTabs />
                </div>
              </div>
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
