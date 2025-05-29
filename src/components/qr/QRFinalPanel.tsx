
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, CheckCircle } from 'lucide-react';
import { QRCodeType } from './QRGeneratorStepper';
import { QRCodeDisplay } from './components/QRCodeDisplay';
import { QRActionButtons } from './components/QRActionButtons';
import { QRInfoPanel } from './components/QRInfoPanel';
import { generateQRContent } from './utils/qrContentGenerator';

interface QRFinalPanelProps {
  qrType: QRCodeType;
  setupData: any;
  customizeData: any;
  onBack: () => void;
}

export function QRFinalPanel({ qrType, setupData, customizeData, onBack }: QRFinalPanelProps) {
  const [generatedQR, setGeneratedQR] = useState<string | null>(null);

  const qrContent = generateQRContent(qrType.id, setupData);

  const handleQRGenerated = (dataURL: string) => {
    setGeneratedQR(dataURL);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500 text-white">
              <CheckCircle className="h-5 w-5" />
            </div>
            Your QR Code is Ready!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* QR Code Display */}
            <div>
              <QRCodeDisplay 
                content={qrContent}
                customizeData={customizeData}
                onQRGenerated={handleQRGenerated}
              />
              
              {/* Action Buttons */}
              <div className="mt-4">
                <QRActionButtons 
                  generatedQR={generatedQR}
                  qrTypeId={qrType.id}
                />
              </div>
            </div>

            {/* QR Code Information */}
            <QRInfoPanel 
              qrType={qrType}
              customizeData={customizeData}
              content={qrContent}
            />
          </div>
          
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Customize
            </Button>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-green-600 hover:bg-green-700"
            >
              Create Another QR Code
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
