
import React, { useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { DataManagerTabs } from '@/components/data/DataManagerTabs';
import { DataUploadTab } from '@/components/data/DataUploadTab';
import { DataManageTab } from '@/components/data/DataManageTab';
import { DataTemplatesTab } from '@/components/data/DataTemplatesTab';

const DataManager = () => {
  const [activeTab, setActiveTab] = useState('upload');

  const mockDataSets = [
    {
      id: 1,
      name: 'Summer Campaign 2024',
      rows: 2847,
      uploadDate: '2024-01-15',
      status: 'active'
    },
    {
      id: 2,
      name: 'Product Launch List',
      rows: 1203,
      uploadDate: '2024-01-10',
      status: 'processed'
    },
    {
      id: 3,
      name: 'Customer Database',
      rows: 5621,
      uploadDate: '2024-01-08',
      status: 'active'
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <DashboardTopbar />
          <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto">
            <div className="max-w-full mx-auto space-y-4 lg:space-y-6">
              <div className="mb-4 lg:mb-6">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Data Manager</h1>
                <p className="text-sm sm:text-base text-gray-600">Upload, manage, and organize your campaign data with CSV files</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-4 lg:p-6">
                <DataManagerTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                <div className="mt-4 lg:mt-6">
                  {activeTab === 'upload' && <DataUploadTab />}
                  {activeTab === 'manage' && <DataManageTab mockDataSets={mockDataSets} />}
                  {activeTab === 'templates' && <DataTemplatesTab />}
                </div>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DataManager;
