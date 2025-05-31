
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
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
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar 
          isCollapsed={isSidebarCollapsed} 
          setIsCollapsed={setIsSidebarCollapsed} 
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardTopbar toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
              {/* Header Section */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">QR Codes</h1>
                  <p className="text-gray-600 mt-1">Manage your dynamic and static QR codes</p>
                </div>
              </div>

              {/* Stats Cards */}
              <QRCodeStats />

              {/* Filters and Controls */}
              <QRCodeFilters 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                viewMode={viewMode}
                setViewMode={setViewMode}
              />

              {/* QR Codes Grid */}
              <QRCodeGrid 
                activeTab={activeTab}
                viewMode={viewMode}
              />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
