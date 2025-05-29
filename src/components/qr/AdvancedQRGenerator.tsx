
import React, { useEffect } from 'react';
import { useQRGenerator } from '@/hooks/useQRGenerator';
import { QRConfigurationPanel } from './QRConfigurationPanel';
import { QRPreviewPanel } from './QRPreviewPanel';
import { QRCodeDetails } from './QRCodeDetails';

interface AdvancedQRGeneratorProps {
  initialType?: string;
}

export function AdvancedQRGenerator({ initialType = 'url' }: AdvancedQRGeneratorProps) {
  const {
    config,
    setConfig,
    generatedQR,
    isGenerating,
    canvasRef,
    handleContentChange
  } = useQRGenerator();

  useEffect(() => {
    if (initialType) {
      const typeMap: Record<string, string> = {
        'url': 'url',
        'multi-link': 'url',
        'pdf': 'url',
        'location': 'url',
        'email': 'email',
        'call': 'phone',
        'sms': 'phone',
        'form': 'url',
        'social-media': 'url',
        'landing-page': 'url',
        'mobile-app': 'url',
        'restaurant-menu': 'url',
        'business-page': 'url',
        'facebook-page': 'url',
        'coupon-code': 'url',
        'image': 'url',
        'mp3': 'url'
      };
      
      const qrType = typeMap[initialType] || 'url';
      setConfig(prev => ({ ...prev, type: qrType as any }));
    }
  }, [initialType, setConfig]);

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
          selectedQRType={initialType}
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
