
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { QRTypeSelector } from './QRTypeSelector';
import { QRSetupPanel } from './QRSetupPanel';
import { QRCustomizePanel } from './QRCustomizePanel';
import { QRFinalPanel } from './QRFinalPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { dynamicQRTypes, staticQRTypes } from './qrTypeData';

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
  mode?: 'single' | 'quick' | 'both';
}

export function QRGeneratorStepper({ initialType, mode }: QRGeneratorStepperProps) {
  const location = useLocation();
  // Start at step 2 if initialType is provided, otherwise start at step 1
  const [currentStep, setCurrentStep] = useState(initialType ? 2 : 1);
  const [selectedType, setSelectedType] = useState<QRCodeType | null>(null);
  const [setupData, setSetupData] = useState<any>(null);
  const [customizeData, setCustomizeData] = useState<any>(null);

  // Determine mode based on route if not explicitly provided
  const effectiveMode = mode || (() => {
    if (location.pathname === '/quick-generate') return 'quick';
    if (location.pathname === '/create' && new URLSearchParams(location.search).get('type')) return 'single';
    return 'both';
  })();

  console.log('QRGeneratorStepper: initialType received:', initialType);
  console.log('QRGeneratorStepper: currentStep:', currentStep);
  console.log('QRGeneratorStepper: selectedType:', selectedType);
  console.log('QRGeneratorStepper: effectiveMode:', effectiveMode);

  // Set the selected type based on initialType
  useEffect(() => {
    if (initialType && !selectedType) {
      const allTypes = [...dynamicQRTypes, ...staticQRTypes];
      const foundType = allTypes.find(type => type.id === initialType);
      if (foundType) {
        console.log('QRGeneratorStepper: Setting type from initialType:', foundType);
        setSelectedType(foundType);
      }
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
    console.log('QRGeneratorStepper: Setup completed with data:', data);
    setSetupData(data);
    setCurrentStep(3);
  };

  const handleCustomizeComplete = (data: any) => {
    console.log('QRGeneratorStepper: Customize completed with data:', data);
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
      {/* Progress Steps */}
      <Card className="bg-white/80 backdrop-blur-sm border border-indigo-100/50 shadow-lg shadow-indigo-500/10">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    currentStep >= step.number 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/25' 
                      : 'border-indigo-200 text-indigo-400 bg-white'
                  }`}>
                    {currentStep > step.number ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <span className="font-bold text-lg">{step.number}</span>
                    )}
                  </div>
                  <div className="text-left">
                    <div className={`font-bold text-lg ${currentStep >= step.number ? 'bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent' : 'text-slate-400'}`}>
                      {step.title}
                    </div>
                    <div className="text-sm text-slate-500 font-medium">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-6 rounded-full transition-all duration-300 ${
                    currentStep > step.number ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-indigo-100'
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
            mode={effectiveMode}
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
