
import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { QRGeneratorStepper } from '@/components/qr/QRGeneratorStepper';

const Dashboard = () => {
  console.log('Dashboard: Rendering dashboard page with QR generator');
  
  return (
    <div className="min-h-screen bg-gray-50/50">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset>
            <DashboardTopbar />
            <main className="flex-1 p-6">
              <QRGeneratorStepper />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Dashboard;
