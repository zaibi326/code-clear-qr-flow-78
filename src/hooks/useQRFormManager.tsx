
import { useState, useEffect } from 'react';
import { useQRGenerator } from './useQRGenerator';
import { useToast } from './use-toast';

interface UseQRFormManagerProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
  mode?: 'single' | 'quick' | 'both';
}

export function useQRFormManager({ formData, onInputChange, mode = 'both' }: UseQRFormManagerProps) {
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

  return {
    // State
    activeTab,
    setActiveTab,
    logoFile,
    csvData,
    setCsvData,
    csvFile,
    setCsvFile,
    showTabs,
    showBulkTab,
    
    // QR Generator
    generatedQR,
    canvasRef,
    
    // Handlers
    handleInputChangeWithColorUpdate,
    handleLogoFileChange,
    handleSave,
    handleBulkSave
  };
}
