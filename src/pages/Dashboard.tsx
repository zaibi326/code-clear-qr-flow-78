
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { ScanActivityChart } from '@/components/dashboard/ScanActivityChart';
import { QRCodeTypeSelector } from '@/components/dashboard/QRCodeTypeSelector';
import { DashboardIntegrations } from '@/components/dashboard/DashboardIntegrations';

const Dashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
            <div className="max-w-7xl mx-auto p-6 space-y-8">
              {/* Header Section */}
              <div className="bg-white rounded-lg shadow-sm p-6 border">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-600 mt-1">Monitor your QR code performance and campaigns</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Last 30 days</option>
                      <option>Last 7 days</option>
                      <option>Last 90 days</option>
                    </select>
                  </div>
                </div>
                
                {/* Stats Grid */}
                <DashboardStats />
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Charts and Analytics */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Activity Chart */}
                  <div className="bg-white rounded-lg shadow-sm border">
                    <ScanActivityChart />
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <QuickActions />
                  </div>
                </div>

                {/* Right Column - QR Types and Quick Info */}
                <div className="space-y-6">
                  {/* QR Code Type Selector */}
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Create QR Code</h3>
                    <QRCodeTypeSelector />
                  </div>

                  {/* Recent Activity Card */}
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">New QR code created</span>
                        </div>
                        <span className="text-xs text-gray-500">2h ago</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">Campaign updated</span>
                        </div>
                        <span className="text-xs text-gray-500">4h ago</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">Template uploaded</span>
                        </div>
                        <span className="text-xs text-gray-500">1d ago</span>
                      </div>
                    </div>
                  </div>

                  {/* Usage Summary Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">Plan Usage</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700">QR Codes</span>
                        <span className="text-blue-900 font-medium">234 / ∞</span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full w-[45%]"></div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-blue-600">Monthly Scans</span>
                        <span className="text-blue-800">12.3K / 50K</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Section - Additional Widgets */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Top Performing QR Codes */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing</h3>
                  <div className="space-y-3">
                    {[
                      { name: "Summer Sale Campaign", scans: "2,456", percentage: "+15%" },
                      { name: "Product Launch", scans: "1,892", percentage: "+8%" },
                      { name: "Social Media QR", scans: "1,234", percentage: "+12%" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.scans} scans</p>
                        </div>
                        <span className="text-xs font-medium text-green-600">{item.percentage}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Device Breakdown */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Breakdown</h3>
                  <div className="space-y-3">
                    {[
                      { device: "Mobile", percentage: "68%", color: "bg-blue-500" },
                      { device: "Desktop", percentage: "24%", color: "bg-green-500" },
                      { device: "Tablet", percentage: "8%", color: "bg-purple-500" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                          <span className="text-sm text-gray-700">{item.device}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{item.percentage}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Integration Status */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Integrations</h3>
                  <div className="space-y-3">
                    {[
                      { name: "Google Analytics", status: "Connected", color: "text-green-600" },
                      { name: "Webhooks", status: "Active", color: "text-green-600" },
                      { name: "Zapier", status: "Not Connected", color: "text-gray-500" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-700">{item.name}</span>
                        <span className={`text-xs font-medium ${item.color}`}>{item.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
