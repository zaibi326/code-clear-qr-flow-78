
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
}

export function ComprehensiveQRForm({ formData, onInputChange }: ComprehensiveQRFormProps) {
  const { config, setConfig, generatedQR, canvasRef } = useQRGenerator();
  const [activeTab, setActiveTab] = useState('single');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const { toast } = useToast();

  // Update QR config when form data changes
  useEffect(() => {
    if (formData.url) {
      setConfig(prev => ({
        ...prev,
        content: formData.url,
        foregroundColor: formData.foregroundColor || '#000000',
        backgroundColor: formData.backgroundColor || '#FFFFFF'
      }));
    }
  }, [formData.url, formData.foregroundColor, formData.backgroundColor, setConfig]);

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
    
    // Validate required fields
    if (!formData.url) {
      toast({
        title: "Validation Error",
        description: "Website URL is required",
        variant: "destructive"
      });
      return;
    }

    if (!formData.qrName) {
      toast({
        title: "Validation Error", 
        description: "QR Code Name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      // Here you would typically save to your backend/database
      // For now, we'll just show a success message
      toast({
        title: "Success",
        description: "QR Code saved successfully!",
      });
      
      console.log('QR Code data to save:', {
        ...formData,
        qrImageData: generatedQR
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

  const handleInputChangeWithColorUpdate = (field: string, value: string) => {
    onInputChange(field, value);
    if (field === 'foregroundColor' || field === 'backgroundColor') {
      handleColorChange(field, value);
    }
    if (field === 'url') {
      setConfig(prev => ({ ...prev, content: value }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Selection */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single" className="text-sm font-medium">Single Record</TabsTrigger>
          <TabsTrigger value="bulk" className="text-sm font-medium text-blue-600">Bulk Records</TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form Fields */}
            <div className="space-y-6">
              <SingleRecordForm
                formData={formData}
                logoFile={logoFile}
                onInputChange={handleInputChangeWithColorUpdate}
                onLogoFileChange={setLogoFile}
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
        </TabsContent>

        <TabsContent value="bulk" className="space-y-6 mt-6">
          <CSVUploadSection
            csvFile={csvFile}
            csvData={csvData}
            onCSVDataChange={setCsvData}
            onCSVFileChange={setCsvFile}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
