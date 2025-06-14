
import React from 'react';
import { useQRFormManager } from '@/hooks/useQRFormManager';
import { FormTabsManager } from './components/FormTabsManager';
import { SingleRecordContent } from './components/SingleRecordContent';
import { BulkRecordContent } from './components/BulkRecordContent';

interface ComprehensiveQRFormProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
  mode?: 'single' | 'quick' | 'both';
}

export function ComprehensiveQRForm({ formData, onInputChange, mode = 'both' }: ComprehensiveQRFormProps) {
  const {
    activeTab,
    setActiveTab,
    logoFile,
    csvData,
    setCsvData,
    csvFile,
    setCsvFile,
    showTabs,
    showBulkTab,
    generatedQR,
    canvasRef,
    handleInputChangeWithColorUpdate,
    handleLogoFileChange,
    handleSave,
    handleBulkSave
  } = useQRFormManager({ formData, onInputChange, mode });

  // For quick mode, render without tabs but show single form
  if (mode === 'quick') {
    return (
      <SingleRecordContent
        formData={formData}
        logoFile={logoFile}
        onInputChange={handleInputChangeWithColorUpdate}
        onLogoFileChange={handleLogoFileChange}
        onSave={handleSave}
        generatedQR={generatedQR}
        canvasRef={canvasRef}
        showAsTab={false}
      />
    );
  }

  // For single mode, render without tabs
  if (mode === 'single') {
    return (
      <SingleRecordContent
        formData={formData}
        logoFile={logoFile}
        onInputChange={handleInputChangeWithColorUpdate}
        onLogoFileChange={handleLogoFileChange}
        onSave={handleSave}
        generatedQR={generatedQR}
        canvasRef={canvasRef}
        showAsTab={false}
      />
    );
  }

  // For both mode, show tabs with single and bulk options
  return (
    <FormTabsManager
      activeTab={activeTab}
      onTabChange={setActiveTab}
      showBulkTab={true}
    >
      <SingleRecordContent
        formData={formData}
        logoFile={logoFile}
        onInputChange={handleInputChangeWithColorUpdate}
        onLogoFileChange={handleLogoFileChange}
        onSave={handleSave}
        generatedQR={generatedQR}
        canvasRef={canvasRef}
        showAsTab={true}
      />

      <BulkRecordContent
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
    </FormTabsManager>
  );
}
