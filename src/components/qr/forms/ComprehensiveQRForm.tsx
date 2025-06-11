import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQRGenerator } from '@/hooks/useQRGenerator';
import { useToast } from '@/hooks/use-toast';
import { SingleRecordForm } from './components/SingleRecordForm';
import { QRPreviewDisplay } from './components/QRPreviewDisplay';
import { CSVUploadSection } from './components/CSVUploadSection';

interface ComprehensiveQRFormProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
  mode?: 'single' | 'quick' | 'both';
}

export function ComprehensiveQRForm({ formData, onInputChange, mode = 'both' }: ComprehensiveQRFormProps) {
  const { config, setConfig, generatedQR, canvasRef } = useQRGenerator();
  const [activeTab, setActiveTab] = useState('single');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const { toast } = useToast();

  // For quick mode, don't show tabs at all
  const showTabs = mode === 'both';
  const showBulkTab = mode === 'both';

  // Update QR config when form data changes
  useEffect(() => {
    console.log('Form data changed:', formData);
    if (formData.url) {
      setConfig(prev => ({
        ...prev,
        content: formData.url,
        foregroundColor: formData.foregroundColor || '#000000',
        backgroundColor: formData.backgroundColor || '#FFFFFF',
        logo: formData.logoUrl || undefined
      }));
    }
  }, [formData.url, formData.foregroundColor, formData.backgroundColor, formData.logoUrl, setConfig]);

  const handleColorChange = (field: string, color: string) => {
    console.log(`Color change: ${field} = ${color}`);
    onInputChange(field, color);
    if (field === 'foregroundColor') {
      setConfig(prev => ({ ...prev, foregroundColor: color }));
    } else if (field === 'backgroundColor') {
      setConfig(prev => ({ ...prev, backgroundColor: color }));
    }
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
        description: `${activeTab === 'single' ? 'Single' : 'Bulk'} QR Code saved successfully!`,
      });
      
      console.log('QR Code data to save:', {
        ...formData,
        qrImageData: generatedQR,
        logoFile: logoFile?.name,
        mode: activeTab
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

  const handleBulkSave = async () => {
    console.log('Bulk save clicked', { csvData, formData });
    
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
        styling: {
          foregroundColor: formData.foregroundColor,
          backgroundColor: formData.backgroundColor,
          logoUrl: formData.logoUrl
        },
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

  const handleInputChangeWithColorUpdate = (field: string, value: string) => {
    console.log(`Input change: ${field} = ${value}`);
    onInputChange(field, value);
    if (field === 'foregroundColor' || field === 'backgroundColor') {
      handleColorChange(field, value);
    }
    if (field === 'url') {
      setConfig(prev => ({ ...prev, content: value }));
    }
    if (field === 'logoUrl') {
      setConfig(prev => ({ ...prev, logo: value || undefined }));
    }
  };

  const handleLogoFileChange = (file: File) => {
    console.log('Logo file changed in main form:', file.name);
    setLogoFile(file);
  };

  // For quick mode or single mode, render without tabs
  if (!showTabs) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form Fields */}
          <div className="space-y-6">
            <div className="mb-6 pb-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">QR Code Configuration</h3>
              <p className="text-slate-600">Configure your QR code content and styling below.</p>
            </div>
            <SingleRecordForm
              formData={formData}
              logoFile={logoFile}
              onInputChange={handleInputChangeWithColorUpdate}
              onLogoFileChange={handleLogoFileChange}
              onSave={handleSave}
            />
          </div>

          {/* Right Column - QR Code Preview */}
          <div className="space-y-6">
            <div className="mb-6 pb-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Live Preview & Download</h3>
              <p className="text-slate-600">See your QR code update in real-time and download in multiple formats.</p>
            </div>
            <QRPreviewDisplay
              generatedQR={generatedQR}
              canvasRef={canvasRef}
              foregroundColor={formData.foregroundColor}
              backgroundColor={formData.backgroundColor}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Selection */}
      <div className="mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger 
              value="single" 
              className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
            >
              Single Record
            </TabsTrigger>
            {showBulkTab && (
              <TabsTrigger 
                value="bulk" 
                className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
              >
                Bulk Records
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="single" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Form Fields */}
              <div className="space-y-6">
                <div className="mb-6 pb-4 border-b border-slate-100">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Single QR Code Configuration</h3>
                  <p className="text-slate-600">Configure your single QR code content and styling below.</p>
                </div>
                <SingleRecordForm
                  formData={formData}
                  logoFile={logoFile}
                  onInputChange={handleInputChangeWithColorUpdate}
                  onLogoFileChange={handleLogoFileChange}
                  onSave={handleSave}
                />
              </div>

              {/* Right Column - QR Code Preview */}
              <div className="space-y-6">
                <div className="mb-6 pb-4 border-b border-slate-100">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Live Preview & Download</h3>
                  <p className="text-slate-600">See your QR code update in real-time and download in multiple formats.</p>
                </div>
                <QRPreviewDisplay
                  generatedQR={generatedQR}
                  canvasRef={canvasRef}
                  foregroundColor={formData.foregroundColor}
                  backgroundColor={formData.backgroundColor}
                />
              </div>
            </div>
          </TabsContent>

          {showBulkTab && (
            <TabsContent value="bulk" className="space-y-6 mt-6">
              <div className="mb-6 pb-4 border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Bulk QR Code Generation</h3>
                <p className="text-slate-600">Upload CSV data to generate multiple QR codes with consistent styling.</p>
              </div>
              <CSVUploadSection
                csvFile={csvFile}
                csvData={csvData}
                onCSVDataChange={setCsvData}
                onCSVFileChange={setCsvFile}
                onBulkSave={handleBulkSave}
                styling={{
                  foregroundColor: formData.foregroundColor,
                  backgroundColor: formData.backgroundColor,
                  logoUrl: formData.logoUrl
                }}
                onStyleChange={handleInputChangeWithColorUpdate}
                logoFile={logoFile}
                onLogoFileChange={handleLogoFileChange}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
