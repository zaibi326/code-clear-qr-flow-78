
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { QRCodeStats } from '@/components/dashboard/QRCodeStats';
import { QRCreationModeSelector } from '@/components/dashboard/QRCreationModeSelector';
import { QRCodeFilters } from '@/components/dashboard/QRCodeFilters';
import { QRCodeGrid } from '@/components/dashboard/QRCodeGrid';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardTopbar />
          
          {/* Main Dashboard Content */}
          <main className="flex-1 p-8 overflow-auto max-w-7xl mx-auto w-full">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">QR Code Dashboard</h1>
              <p className="text-gray-600">Manage your dynamic and static QR codes with advanced analytics</p>
            </div>

            {/* Stats Grid */}
            <div className="mb-10">
              <QRCodeStats />
            </div>

            {/* QR Creation Mode Selector */}
            <div className="mb-10">
              <QRCreationModeSelector />
            </div>

            {/* QR Codes Management Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <QRCodeFilters
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                viewMode={viewMode}
                setViewMode={setViewMode}
                onSearch={handleSearch}
              />
              <div className="mt-6">
                <QRCodeGrid
                  activeTab={activeTab}
                  viewMode={viewMode}
                  searchQuery={searchQuery}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
