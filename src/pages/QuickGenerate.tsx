
import React, { useEffect, useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { QRGeneratorStepper } from '@/components/qr/QRGeneratorStepper';
import { useSearchParams } from 'react-router-dom';

const QuickGenerate = () => {
  const [searchParams] = useSearchParams();
  const [selectedType, setSelectedType] = useState<string>('');

  useEffect(() => {
    const type = searchParams.get('type');
    console.log('QuickGenerate: URL type parameter:', type);
    if (type) {
      setSelectedType(type);
    }
  }, [searchParams]);

  console.log('QuickGenerate: Rendering with selectedType:', selectedType);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col min-w-0">
          <DashboardTopbar />
          
          {/* Header Section */}
          <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Create QR Code</h1>
                <p className="text-sm text-gray-600 mt-1">Generate custom QR codes with advanced styling options and analytics tracking</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-4 sm:p-6 lg:p-8">
                  <QRGeneratorStepper initialType={selectedType} />
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default QuickGenerate;
