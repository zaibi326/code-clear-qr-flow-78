
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { QRCodeStats } from '@/components/dashboard/QRCodeStats';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { ScanActivityChart } from '@/components/dashboard/ScanActivityChart';

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

            {/* QR Code Stats */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">QR Code Overview</h2>
              <QRCodeStats />
            </div>

            {/* Charts and Activity */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
              <ScanActivityChart />
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    { action: 'New QR code created', time: '2 minutes ago', type: 'create' },
                    { action: 'Campaign "Summer Sale" updated', time: '1 hour ago', type: 'update' },
                    { action: 'Analytics report generated', time: '3 hours ago', type: 'report' },
                    { action: '50 new scans recorded', time: '5 hours ago', type: 'scan' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'create' ? 'bg-green-500' :
                        activity.type === 'update' ? 'bg-blue-500' :
                        activity.type === 'report' ? 'bg-purple-500' : 'bg-orange-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
