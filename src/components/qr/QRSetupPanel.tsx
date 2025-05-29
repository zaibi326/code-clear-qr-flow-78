
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${qrType.color} text-white`}>
              <qrType.icon className="h-5 w-5" />
            </div>
            Setup {qrType.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormComponent 
            formData={formData} 
            onInputChange={handleInputChange} 
          />
          
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            <Button 
              onClick={handleContinue}
              disabled={!isFormValid()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
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
