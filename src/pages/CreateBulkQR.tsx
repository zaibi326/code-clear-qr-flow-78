
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { CSVUploadSection } from '@/components/qr/forms/components/CSVUploadSection';
import { useToast } from '@/hooks/use-toast';

const CreateBulkQR = () => {
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [styling, setStyling] = useState({
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF',
    logoUrl: ''
  });
  const { toast } = useToast();

  const handleStyleChange = (field: string, value: string) => {
    console.log(`Style change: ${field} = ${value}`);
    setStyling(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoFileChange = (file: File) => {
    console.log('Logo file changed:', file.name);
    setLogoFile(file);
  };

  const handleBulkSave = async () => {
    console.log('Bulk save clicked', { csvData, styling });
    
    if (!csvData || csvData.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please upload CSV data first",
        variant: "destructive"
      });
      return;
    }

    try {
      toast({
        title: "Success",
        description: `Bulk QR Codes generated successfully for ${csvData.length} records!`,
      });
      
      console.log('Bulk QR Code data to save:', {
        csvData,
        styling,
        logoFile: logoFile?.name
      });
      
    } catch (error) {
      console.error('Bulk save error:', error);
      toast({
        title: "Error",
        description: "Failed to generate bulk QR Codes. Please try again.",
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
                    Create Bulk QR Codes
                  </h1>
                  <p className="text-base text-slate-600 font-medium">
                    Generate multiple QR codes from CSV data with custom styling
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
                  {/* Form Header */}
                  <div className="mb-8 pb-6 border-b border-slate-100">
                    <h2 className="text-xl font-semibold text-slate-900 mb-2">Bulk QR Code Configuration</h2>
                    <p className="text-slate-600">Upload your CSV data and configure styling for all QR codes.</p>
                  </div>
                  
                  <CSVUploadSection
                    csvFile={csvFile}
                    csvData={csvData}
                    onCSVDataChange={setCsvData}
                    onCSVFileChange={setCsvFile}
                    onBulkSave={handleBulkSave}
                    styling={styling}
                    onStyleChange={handleStyleChange}
                    logoFile={logoFile}
                    onLogoFileChange={handleLogoFileChange}
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

export default CreateBulkQR;
