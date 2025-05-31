
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
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Dashboard search query:', query);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" style={{ boxSizing: 'border-box' }}>
        <AppSidebar 
          isCollapsed={isSidebarCollapsed} 
          setIsCollapsed={setIsSidebarCollapsed} 
        />
        <main 
          className="flex-1 flex flex-col min-w-0 transition-all duration-300 ml-0 md:ml-[240px] max-w-full"
          style={{ boxSizing: 'border-box' }}
        >
          <DashboardTopbar toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
          
          {/* Header Section */}
          <div className="bg-white/80 backdrop-blur-sm border-b border-indigo-100 px-4 sm:px-6 lg:px-8 py-8 shadow-sm">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">QR Codes</h1>
                  <p className="text-base text-slate-600 mt-3 font-medium">Manage your dynamic and static QR codes with advanced analytics</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
              {/* Stats Section */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-indigo-100 shadow-lg shadow-indigo-500/10 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300">
                <QRCodeStats />
              </div>

              {/* Filters Section */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-indigo-100 shadow-lg shadow-indigo-500/10 p-8 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300">
                <QRCodeFilters 
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                  onSearch={handleSearch}
                />
              </div>

              {/* QR Codes Grid */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-indigo-100 shadow-lg shadow-indigo-500/10 p-8 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300">
                <QRCodeGrid 
                  activeTab={activeTab}
                  viewMode={viewMode}
                  searchQuery={searchQuery}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
