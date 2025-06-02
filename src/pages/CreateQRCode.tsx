
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { ComprehensiveQRForm } from '@/components/qr/forms/ComprehensiveQRForm';

const CreateQRCode = () => {
  const [formData, setFormData] = React.useState<any>({
    url: 'https://www.simplestreethomes.com',
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-white to-blue-50/50" style={{ boxSizing: 'border-box' }}>
        <AppSidebar />
        <main className="flex-1 flex flex-col min-w-0 ml-0 md:ml-[240px] transition-all duration-300 max-w-full" style={{ boxSizing: 'border-box' }}>
          <DashboardTopbar />
          
          {/* Enhanced Header Section */}
          <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200/50 px-4 sm:px-6 lg:px-8 py-6 shadow-sm">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">Create QR Code</h1>
                  <p className="text-base text-slate-600 font-medium">Design and generate professional QR codes with custom styling</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content with improved spacing and layout */}
          <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50/50 via-white to-blue-50/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="bg-white/98 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg shadow-slate-900/5 hover:shadow-xl hover:shadow-slate-900/10 transition-all duration-500">
                <div className="p-6 lg:p-8">
                  {/* Form Header */}
                  <div className="mb-8 pb-6 border-b border-slate-100">
                    <h2 className="text-xl font-semibold text-slate-900 mb-2">QR Code Configuration</h2>
                    <p className="text-slate-600">Configure your QR code content, styling, and additional settings below.</p>
                  </div>
                  
                  <ComprehensiveQRForm 
                    formData={formData}
                    onInputChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default CreateQRCode;
