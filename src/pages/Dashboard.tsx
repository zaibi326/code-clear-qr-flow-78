
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { QRCodeStats } from '@/components/dashboard/QRCodeStats';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { ScanActivityChart } from '@/components/dashboard/ScanActivityChart';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QRCodeGrid } from '@/components/dashboard/QRCodeGrid';
import { PerformanceMetrics } from '@/components/dashboard/PerformanceMetrics';

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardTopbar />
          
          {/* Main Dashboard Content */}
          <main className="flex-1 p-6 space-y-6 overflow-auto">
            {/* Welcome Section */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
              <p className="text-gray-600">Here's what's happening with your QR codes today.</p>
            </div>

            {/* Stats Grid */}
            <DashboardStats />

            {/* QR Code Overview */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">QR Code Overview</h2>
              <QRCodeStats />
            </div>

            {/* Charts and Analytics Row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
              <div className="xl:col-span-2">
                <ScanActivityChart />
              </div>
              <div className="xl:col-span-1">
                <PerformanceMetrics />
              </div>
            </div>

            {/* Activity and QR Codes Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
              <RecentActivity />
              <QRCodeGrid />
            </div>

            {/* Quick Actions */}
            <QuickActions />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
