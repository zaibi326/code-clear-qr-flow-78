
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
      <div className="min-h-screen flex w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50" style={{ boxSizing: 'border-box' }}>
        <AppSidebar />
        <main className="flex-1 flex flex-col min-w-0 ml-0 md:ml-[240px] transition-all duration-300 max-w-full" style={{ boxSizing: 'border-box' }}>
          <DashboardTopbar />
          
          {/* Header Section */}
          <div className="bg-white/90 backdrop-blur-lg border-b border-indigo-100/50 px-4 sm:px-6 lg:px-8 py-8 shadow-lg shadow-indigo-500/5">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Quick Generate</h1>
                  <p className="text-base text-slate-600 mt-3 font-medium">Generate custom QR codes with advanced styling options and analytics tracking</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="bg-white/95 backdrop-blur-lg rounded-3xl border border-indigo-100/50 shadow-xl shadow-indigo-500/10 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500">
                <div className="p-8 lg:p-12">
                  <QRGeneratorStepper initialType={selectedType} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default QuickGenerate;
