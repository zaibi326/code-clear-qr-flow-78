
import React, { useState, useEffect } from 'react';
import { QRTypeSelector } from './QRTypeSelector';
import { QRSetupPanel } from './QRSetupPanel';
import { QRCustomizePanel } from './QRCustomizePanel';
import { QRFinalPanel } from './QRFinalPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

export interface QRCodeType {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  category: 'dynamic' | 'static';
  badge?: string;
}

interface QRGeneratorStepperProps {
  initialType?: string;
}

export function QRGeneratorStepper({ initialType }: QRGeneratorStepperProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<QRCodeType | null>(null);
  const [setupData, setSetupData] = useState<any>(null);
  const [customizeData, setCustomizeData] = useState<any>(null);

  console.log('QRGeneratorStepper: initialType received:', initialType);
  console.log('QRGeneratorStepper: currentStep:', currentStep);
  console.log('QRGeneratorStepper: selectedType:', selectedType);

  useEffect(() => {
    if (initialType && !selectedType) {
      console.log('QRGeneratorStepper: Auto-advancing to step 2 due to initialType');
      setCurrentStep(2);
    }
  }, [initialType, selectedType]);

  const steps = [
    { number: 1, title: 'Select type', description: 'Choose your QR code type' },
    { number: 2, title: 'Setup', description: 'Configure your content' },
    { number: 3, title: 'Customize', description: 'Design your QR code' },
    { number: 4, title: 'Done', description: 'Download and share' }
  ];

  const handleTypeSelect = (type: QRCodeType) => {
    console.log('QRGeneratorStepper: Type selected:', type);
    setSelectedType(type);
    setCurrentStep(2);
  };

  const handleSetupComplete = (data: any) => {
    setSetupData(data);
    setCurrentStep(3);
  };

  const handleCustomizeComplete = (data: any) => {
    setCustomizeData(data);
    setCurrentStep(4);
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Type Selection Header */}
      {currentStep === 1 && (
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">
            Select QR Code Type
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the type of QR code you want to create. Dynamic QR codes can be modified after creation, while static QR codes are permanent.
          </p>
        </div>
      )}

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    currentStep >= step.number 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    {currentStep > step.number ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="font-semibold">{step.number}</span>
                    )}
                  </div>
                  <div className="text-left">
                    <div className={`font-semibold ${currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'}`}>
                      {step.title}
                    </div>
                    <div className="text-sm text-gray-500">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <div>
        {currentStep === 1 && (
          <QRTypeSelector onTypeSelect={handleTypeSelect} initialType={initialType} />
        )}
        {currentStep === 2 && selectedType && (
          <QRSetupPanel 
            qrType={selectedType} 
            onComplete={handleSetupComplete} 
            onBack={prevStep}
          />
        )}
        {currentStep === 3 && selectedType && setupData && (
          <QRCustomizePanel 
            qrType={selectedType} 
            setupData={setupData}
            onComplete={handleCustomizeComplete} 
            onBack={prevStep}
          />
        )}
        {currentStep === 4 && selectedType && setupData && customizeData && (
          <QRFinalPanel 
            qrType={selectedType} 
            setupData={setupData}
            customizeData={customizeData}
            onBack={prevStep}
          />
        )}
      </div>
    </div>
  );
}
