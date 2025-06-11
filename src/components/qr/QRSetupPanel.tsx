
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { QRCodeType } from './QRGeneratorStepper';
import { getQRForm } from './forms/QRFormRegistry';
import { qrValidation } from './utils/qrValidation';

interface QRSetupPanelProps {
  qrType: QRCodeType;
  onComplete: (data: any) => void;
  onBack: () => void;
}

export function QRSetupPanel({ qrType, onComplete, onBack }: QRSetupPanelProps) {
  const [formData, setFormData] = useState<any>({
    url: qrType.id === 'url' ? 'https://www.example.com' : '',
    qrName: qrType.id === 'url' ? 'My Website QR Code' : '',
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF',
    logoUrl: ''
  });

  console.log('Validating form for QR type:', qrType.id, formData);

  const handleInputChange = (field: string, value: string) => {
    console.log(`QR Setup Panel - Input change: ${field} = ${value}`);
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    const validation = qrValidation.validateForm(qrType.id, formData);
    
    if (!validation.isValid) {
      console.error('Form validation failed:', validation.errors);
      // You could show validation errors here
      return;
    }

    console.log('Form validation passed, proceeding to customize step');
    onComplete(formData);
  };

  // Get the appropriate form component for this QR type
  const FormComponent = getQRForm(qrType.id);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-indigo-100/50 shadow-lg shadow-indigo-500/10">
      <CardHeader className="border-b border-indigo-100/30 bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
        <CardTitle className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg ${qrType.color} flex items-center justify-center shadow-lg`}>
            <qrType.icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{qrType.title}</h3>
            <p className="text-sm text-gray-600 font-medium">{qrType.description}</p>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <h4 className="font-semibold text-gray-900 mb-2">Configure Your {qrType.title}</h4>
            <p className="text-sm text-gray-600">Set up the content and basic settings for your QR code below.</p>
          </div>
          
          <FormComponent 
            formData={formData}
            onInputChange={handleInputChange}
          />
        </div>

        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          
          <Button 
            onClick={handleNext}
            className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            <span>Next: Customize</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
