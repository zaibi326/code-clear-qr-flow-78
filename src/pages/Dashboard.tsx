
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
        <SidebarInset className="flex-1 flex flex-col min-w-0 ml-0">
          <DashboardTopbar toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
          
          {/* Header Section */}
          <div className="bg-white border-b border-gray-200 px-6 lg:px-8 py-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">QR Codes</h1>
                  <p className="text-sm text-gray-600 mt-2">Manage your dynamic and static QR codes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 space-y-6">
              {/* Stats Section */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <QRCodeStats />
              </div>

              {/* Filters Section */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <QRCodeFilters 
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                />
              </div>

              {/* QR Codes Grid */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
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
