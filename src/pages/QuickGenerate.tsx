
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
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 ml-60">
          <SidebarInset>
            <DashboardTopbar />
            <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50">
              <div className="max-w-6xl mx-auto space-y-6">
                <div className="mb-6">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Create QR Code</h1>
                  <p className="text-gray-600">Generate custom QR codes with advanced styling options and analytics tracking.</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
                  <QRGeneratorStepper initialType={selectedType} />
                </div>
              </div>
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default QuickGenerate;
