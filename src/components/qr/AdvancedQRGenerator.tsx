
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
      console.log(`Setting initial QR type: ${initialType}`);
      
      // Map QR types to their base configuration
      const typeMap: Record<string, { type: string; defaultContent: string }> = {
        'url': { type: 'url', defaultContent: 'https://example.com' },
        'multi-link': { type: 'url', defaultContent: 'https://linktr.ee/yourname' },
        'pdf': { type: 'url', defaultContent: 'https://example.com/document.pdf' },
        'location': { type: 'url', defaultContent: 'https://maps.google.com/?q=New+York+NY' },
        'email': { type: 'email', defaultContent: 'contact@example.com' },
        'call': { type: 'phone', defaultContent: '+1234567890' },
        'sms': { type: 'phone', defaultContent: '+1234567890' },
        'form': { type: 'url', defaultContent: 'https://forms.google.com/your-form' },
        'social-media': { type: 'url', defaultContent: 'https://instagram.com/yourprofile' },
        'landing-page': { type: 'url', defaultContent: 'https://yourlandingpage.com' },
        'mobile-app': { type: 'url', defaultContent: 'https://apps.apple.com/app/yourapp' },
        'restaurant-menu': { type: 'url', defaultContent: 'https://yourrestaurant.com/menu' },
        'business-page': { type: 'url', defaultContent: 'https://yourbusiness.com' },
        'facebook-page': { type: 'url', defaultContent: 'https://facebook.com/yourpage' },
        'coupon-code': { type: 'url', defaultContent: 'https://yourstore.com/coupon/SAVE20' },
        'image': { type: 'url', defaultContent: 'https://example.com/image.jpg' },
        'mp3': { type: 'url', defaultContent: 'https://example.com/audio.mp3' },
        'smart-rules': { type: 'url', defaultContent: 'https://smartrules.example.com' },
        'geolocation-redirect': { type: 'url', defaultContent: 'https://geo-redirect.example.com' }
      };
      
      const mappedType = typeMap[initialType] || { type: 'url', defaultContent: 'https://example.com' };
      
      setConfig(prev => ({ 
        ...prev, 
        type: mappedType.type as any,
        content: mappedType.defaultContent
      }));
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
