
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { SingleRecordForm } from './SingleRecordForm';
import { QRPreviewDisplay } from './QRPreviewDisplay';

interface SingleRecordContentProps {
  formData: any;
  logoFile: File | null;
  onInputChange: (field: string, value: string) => void;
  onLogoFileChange: (file: File) => void;
  onSave: () => void;
  generatedQR: string | null;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  showAsTab?: boolean;
}

export function SingleRecordContent({
  formData,
  logoFile,
  onInputChange,
  onLogoFileChange,
  onSave,
  generatedQR,
  canvasRef,
  showAsTab = true
}: SingleRecordContentProps) {
  const content = (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Form Fields */}
      <div className="space-y-6">
        <div className="mb-6 pb-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            {showAsTab ? 'Single QR Code Configuration' : 'QR Code Configuration'}
          </h3>
          <p className="text-slate-600">
            Configure your {showAsTab ? 'single ' : ''}QR code content and styling below.
          </p>
        </div>
        <SingleRecordForm
          formData={formData}
          logoFile={logoFile}
          onInputChange={onInputChange}
          onLogoFileChange={onLogoFileChange}
          onSave={onSave}
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
  );

  if (!showAsTab) {
    return <div className="space-y-6">{content}</div>;
  }

  return (
    <TabsContent value="single" className="space-y-6 mt-6">
      {content}
    </TabsContent>
  );
}
