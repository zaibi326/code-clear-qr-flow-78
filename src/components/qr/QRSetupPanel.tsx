
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { QRCodeType } from './QRGeneratorStepper';
import { getQRForm } from './forms/QRFormRegistry';
import { validateQRForm } from './utils/qrValidation';

interface QRSetupPanelProps {
  qrType: QRCodeType;
  onComplete: (data: any) => void;
  onBack: () => void;
}

export function QRSetupPanel({ qrType, onComplete, onBack }: QRSetupPanelProps) {
  const [formData, setFormData] = useState<any>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    if (validateQRForm(qrType.id, formData)) {
      onComplete(formData);
    }
  };

  const isFormValid = () => validateQRForm(qrType.id, formData);

  const FormComponent = getQRForm(qrType.id);

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white/95 backdrop-blur-lg border border-indigo-100/50 shadow-xl shadow-indigo-500/10 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100/50">
          <CardTitle className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${qrType.color} text-white shadow-lg`}>
              <qrType.icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Setup {qrType.title}
              </h3>
              <p className="text-sm text-slate-600 font-medium mt-1">Configure your QR code content</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
          <FormComponent 
            formData={formData} 
            onInputChange={handleInputChange} 
          />
          
          <div className="flex justify-between pt-6 border-t border-indigo-100">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="flex items-center gap-2 border-indigo-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl px-6 py-3"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            <Button 
              onClick={handleContinue}
              disabled={!isFormValid()}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 rounded-xl px-6 py-3"
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
