
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { QRTypeSelector } from '@/components/qr/QRTypeSelector';
import { QRGeneratorStepper, QRCodeType } from '@/components/qr/QRGeneratorStepper';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const QuickGenerate = () => {
  const [selectedType, setSelectedType] = useState<QRCodeType | null>(null);

  const handleTypeSelect = (type: QRCodeType) => {
    setSelectedType(type);
    console.log('QR Type selected:', type);
  };

  const handleBack = () => {
    setSelectedType(null);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0 ml-[240px]">
          <DashboardTopbar />
          
          <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
              {/* Header Section */}
              <div className="mb-8 animate-fade-in">
                <div className="flex items-center gap-4 mb-4">
                  {selectedType && (
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="flex items-center gap-2 hover:bg-gray-100"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button>
                  )}
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                      QR Code Generator
                    </h1>
                    <p className="text-lg text-gray-600">Create dynamic and static QR codes for any purpose</p>
                  </div>
                </div>
              </div>

              {!selectedType ? (
                <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-gray-200 shadow-2xl p-8 animate-fade-in">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore All QR Code Types</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">Choose from our comprehensive collection of QR code types to create the perfect solution for your needs</p>
                  </div>
                  <QRTypeSelector onTypeSelect={handleTypeSelect} />
                </div>
              ) : (
                <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-gray-200 shadow-2xl animate-fade-in">
                  <QRGeneratorStepper 
                    initialType={selectedType.id}
                  />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default QuickGenerate;
