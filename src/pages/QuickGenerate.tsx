
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { QRTypeSelector } from '@/components/qr/QRTypeSelector';
import { QRGeneratorStepper, QRCodeType } from '@/components/qr/QRGeneratorStepper';
import { ComprehensiveQRForm } from '@/components/qr/forms/ComprehensiveQRForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const QuickGenerate = () => {
  const [selectedType, setSelectedType] = useState<QRCodeType | null>(null);
  const [formData, setFormData] = useState<any>({
    url: '',
    qrName: '',
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF',
    logoUrl: ''
  });

  const handleTypeSelect = (type: QRCodeType) => {
    setSelectedType(type);
    console.log('QR Type selected:', type);
    
    // Reset form data when type changes
    setFormData({
      url: type.id === 'url' ? 'https://www.example.com' : '',
      qrName: type.id === 'url' ? 'My Website QR Code' : '',
      foregroundColor: '#000000',
      backgroundColor: '#FFFFFF',
      logoUrl: ''
    });
  };

  const handleBack = () => {
    setSelectedType(null);
  };

  const handleInputChange = (field: string, value: string) => {
    console.log(`Quick Generate - Input change: ${field} = ${value}`);
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  // Check if this is a URL/Link type that should use comprehensive form
  const shouldUseComprehensiveForm = selectedType && (
    selectedType.id === 'url' || 
    selectedType.id === 'website' || 
    selectedType.id === 'website-static'
  );

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
                      Quick QR Generator
                    </h1>
                    <p className="text-lg text-gray-600">Create QR codes instantly with single record or bulk generation options</p>
                  </div>
                </div>
              </div>

              {!selectedType ? (
                <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-gray-200 shadow-2xl p-8 animate-fade-in">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your QR Code Type</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">Select from our collection of QR code types for instant generation with single or bulk options</p>
                  </div>
                  <QRTypeSelector onTypeSelect={handleTypeSelect} />
                </div>
              ) : shouldUseComprehensiveForm ? (
                <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-gray-200 shadow-2xl p-8 animate-fade-in">
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-lg ${selectedType.color} flex items-center justify-center shadow-lg`}>
                        <selectedType.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{selectedType.title}</h2>
                        <p className="text-gray-600">{selectedType.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <ComprehensiveQRForm 
                    formData={formData}
                    onInputChange={handleInputChange}
                    mode="both"
                  />
                </div>
              ) : (
                <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-gray-200 shadow-2xl animate-fade-in">
                  <QRGeneratorStepper 
                    initialType={selectedType.id}
                    mode="quick"
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
