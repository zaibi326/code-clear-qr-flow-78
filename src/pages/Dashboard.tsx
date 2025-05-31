
import React, { useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { QRCodeGrid } from '@/components/dashboard/QRCodeGrid';
import { QRCodeFilters } from '@/components/dashboard/QRCodeFilters';
import { QRCodeStats } from '@/components/dashboard/QRCodeStats';

const Dashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar 
          isCollapsed={isSidebarCollapsed} 
          setIsCollapsed={setIsSidebarCollapsed} 
        />
        <SidebarInset className="flex-1">
          <DashboardTopbar toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
          <div className="flex flex-col h-[calc(100vh-4rem)]">
            <div className="flex-none bg-white border-b px-8 py-6">
              <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-semibold text-gray-900">QR Codes</h1>
                <p className="text-sm text-gray-600 mt-1">Manage your dynamic and static QR codes</p>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto bg-gray-50">
              <div className="max-w-7xl mx-auto px-8 py-6 space-y-6">
                <QRCodeStats />

                <div className="bg-white rounded-lg border shadow-sm p-6">
                  <QRCodeFilters 
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                  />
                </div>

                <div className="bg-white rounded-lg border shadow-sm p-6">
                  <QRCodeGrid 
                    activeTab={activeTab}
                    viewMode={viewMode}
                  />
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
