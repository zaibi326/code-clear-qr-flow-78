
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { SingleRecordForm } from '@/components/qr/forms/components/SingleRecordForm';
import { QRPreviewDisplay } from '@/components/qr/forms/components/QRPreviewDisplay';
import { useQRGenerator } from '@/hooks/useQRGenerator';
import { useToast } from '@/hooks/use-toast';

const CreateSingleQR = () => {
  const [formData, setFormData] = useState({
    url: 'https://www.example.com',
    qrName: 'My Website QR Code',
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF',
    logoUrl: ''
  });
  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const { config, setConfig, generatedQR, canvasRef } = useQRGenerator();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    console.log(`Input change: ${field} = ${value}`);
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Update QR config
    if (field === 'url') {
      setConfig(prev => ({ ...prev, content: value }));
    } else if (field === 'foregroundColor') {
      setConfig(prev => ({ ...prev, foregroundColor: value }));
    } else if (field === 'backgroundColor') {
      setConfig(prev => ({ ...prev, backgroundColor: value }));
    } else if (field === 'logoUrl') {
      setConfig(prev => ({ ...prev, logo: value || undefined }));
    }
  };

  const handleLogoFileChange = (file: File) => {
    console.log('Logo file changed:', file.name);
    setLogoFile(file);
  };

  const handleSave = async () => {
    console.log('Save button clicked', formData);
    
    // Enhanced validation
    if (!formData.url || formData.url.trim() === '') {
      toast({
        title: "Validation Error",
        description: "Website URL is required",
        variant: "destructive"
      });
      return;
    }

    // URL validation
    try {
      new URL(formData.url);
    } catch {
      toast({
        title: "Validation Error",
        description: "Please enter a valid URL (e.g., https://example.com)",
        variant: "destructive"
      });
      return;
    }

    if (!formData.qrName || formData.qrName.trim() === '') {
      toast({
        title: "Validation Error", 
        description: "QR Code Name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      toast({
        title: "Success",
        description: "Single QR Code saved successfully!",
      });
      
      console.log('QR Code data to save:', {
        ...formData,
        qrImageData: generatedQR,
        logoFile: logoFile?.name
      });
      
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: "Failed to save QR Code. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-white to-blue-50/50">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-w-0 ml-0 md:ml-[240px] transition-all duration-300 max-w-full">
          <DashboardTopbar />
          
          {/* Header Section */}
          <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200/50 px-4 sm:px-6 lg:px-8 py-6 shadow-sm">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
                    Create Single QR Code
                  </h1>
                  <p className="text-base text-slate-600 font-medium">
                    Design and generate a professional QR code with custom styling
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50/50 via-white to-blue-50/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="bg-white/98 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg shadow-slate-900/5">
                <div className="p-6 lg:p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Form Fields */}
                    <div className="space-y-6">
                      <div className="mb-6 pb-4 border-b border-slate-100">
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">QR Code Configuration</h2>
                        <p className="text-slate-600">Configure your single QR code content and styling below.</p>
                      </div>
                      <SingleRecordForm
                        formData={formData}
                        logoFile={logoFile}
                        onInputChange={handleInputChange}
                        onLogoFileChange={handleLogoFileChange}
                        onSave={handleSave}
                      />
                    </div>

                    {/* Right Column - QR Code Preview */}
                    <QRPreviewDisplay
                      generatedQR={generatedQR}
                      canvasRef={canvasRef}
                      foregroundColor={formData.foregroundColor}
                      backgroundColor={formData.backgroundColor}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default CreateSingleQR;
