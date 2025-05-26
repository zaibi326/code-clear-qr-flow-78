
import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { AnalyticsFilters } from '@/components/analytics/AnalyticsFilters';
import { ScanActivityChart } from '@/components/analytics/ScanActivityChart';
import { CampaignPerformanceChart } from '@/components/analytics/CampaignPerformanceChart';
import { QRCodeTable } from '@/components/analytics/QRCodeTable';
import { AnalyticsStats } from '@/components/analytics/AnalyticsStats';

const Analytics = () => {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset>
            <DashboardTopbar />
            <main className="flex-1 p-6 space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
                <p className="text-gray-600">Track your QR code performance and scan analytics</p>
              </div>
              
              <AnalyticsFilters />
              <AnalyticsStats />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ScanActivityChart />
                <CampaignPerformanceChart />
              </div>
              
              <QRCodeTable />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Analytics;
