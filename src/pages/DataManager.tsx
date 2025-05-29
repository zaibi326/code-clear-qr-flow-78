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
    <div className="min-h-screen bg-gray-50/50">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset>
            <DashboardTopbar />
            <main className="flex-1 p-6 space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Manager</h1>
                <p className="text-gray-600">Upload, manage, and organize your campaign data with CSV files</p>
              </div>

              <DataManagerTabs activeTab={activeTab} setActiveTab={setActiveTab} />

              {activeTab === 'upload' && <DataUploadTab />}
              {activeTab === 'manage' && <DataManageTab mockDataSets={mockDataSets} />}
              {activeTab === 'templates' && <DataTemplatesTab />}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default DataManager;
