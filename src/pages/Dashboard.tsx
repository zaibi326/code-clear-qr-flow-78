
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
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar 
          isCollapsed={isSidebarCollapsed} 
          setIsCollapsed={setIsSidebarCollapsed} 
        />
        <SidebarInset className="flex-1 flex flex-col min-w-0">
          <DashboardTopbar toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
          
          {/* Header Section */}
          <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">QR Codes</h1>
                <p className="text-sm text-gray-600 mt-1">Manage your dynamic and static QR codes</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
              {/* Stats Section */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <QRCodeStats />
              </div>

              {/* Filters Section */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
                <QRCodeFilters 
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                />
              </div>

              {/* QR Codes Grid */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
                <QRCodeGrid 
                  activeTab={activeTab}
                  viewMode={viewMode}
                />
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
