
import React from 'react';
import { useQRGenerator } from '@/hooks/useQRGenerator';
import { QRConfigurationPanel } from './QRConfigurationPanel';
import { QRPreviewPanel } from './QRPreviewPanel';
import { QRCodeDetails } from './QRCodeDetails';

export function AdvancedQRGenerator() {
  const {
    config,
    setConfig,
    generatedQR,
    isGenerating,
    canvasRef,
    handleContentChange
  } = useQRGenerator();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Hidden canvas for QR generation */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      {/* Configuration Panel */}
      <div className="space-y-6">
        <QRConfigurationPanel 
          config={config}
          onConfigChange={setConfig}
          onContentChange={handleContentChange}
        />
      </div>

      {/* Preview Panel */}
      <div className="space-y-6">
        <QRPreviewPanel 
          config={config}
          generatedQR={generatedQR}
          isGenerating={isGenerating}
        />
        <QRCodeDetails config={config} />
      </div>
    </div>
  );
}
