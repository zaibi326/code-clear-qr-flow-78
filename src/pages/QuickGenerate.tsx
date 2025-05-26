
import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { AdvancedQRGenerator } from '@/components/qr/AdvancedQRGenerator';

const QuickGenerate = () => {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset>
            <DashboardTopbar />
            <main className="flex-1 p-6 space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Quick QR Generator</h1>
                <p className="text-gray-600">Generate custom QR codes instantly with advanced styling options</p>
              </div>
              
              <AdvancedQRGenerator />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default QuickGenerate;
