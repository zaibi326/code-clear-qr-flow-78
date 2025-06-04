
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { DataManagerTabs } from '@/components/data/DataManagerTabs';
import { DataUploadTab } from '@/components/data/DataUploadTab';
import { DataManageTab } from '@/components/data/DataManageTab';
import { DataTemplatesTab } from '@/components/data/DataTemplatesTab';
import { Card, CardContent } from '@/components/ui/card';
import { Database, Upload, FileSpreadsheet, Users } from 'lucide-react';

const DataManager = () => {
  const [activeTab, setActiveTab] = useState('upload');

  const dataStats = [
    {
      title: 'Total Projects',
      value: '24',
      icon: Database,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Data Records',
      value: '12,847',
      icon: FileSpreadsheet,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Active Campaigns',
      value: '8',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Recent Uploads',
      value: '15',
      icon: Upload,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

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
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 via-green-50 to-blue-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0 ml-[240px]">
          <DashboardTopbar />
          
          <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
              {/* Header Section */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Data Manager
                </h1>
                <p className="text-gray-600">Upload, manage, and organize your campaign data with CSV files</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {dataStats.map((stat, index) => (
                  <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                          <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Data Management */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg">
                <div className="px-6 pt-6 pb-0">
                  <DataManagerTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
                <div className="p-6">
                  {activeTab === 'upload' && <DataUploadTab />}
                  {activeTab === 'manage' && <DataManageTab mockDataSets={mockDataSets} />}
                  {activeTab === 'templates' && <DataTemplatesTab />}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DataManager;
