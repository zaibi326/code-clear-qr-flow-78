
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
        <SidebarInset className="flex-1 flex flex-col min-w-0">
          <DashboardTopbar />
          
          {/* Header Section */}
          <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Projects</h1>
                <p className="text-sm text-gray-600 mt-1">Upload, manage, and organize your campaign data with CSV files</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-0">
                  <DataManagerTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
                <div className="p-4 sm:p-6">
                  {activeTab === 'upload' && <DataUploadTab />}
                  {activeTab === 'manage' && <DataManageTab mockDataSets={mockDataSets} />}
                  {activeTab === 'templates' && <DataTemplatesTab />}
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DataManager;
