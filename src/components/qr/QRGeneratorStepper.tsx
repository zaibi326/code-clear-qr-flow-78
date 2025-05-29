
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Check } from 'lucide-react';
import { QRTypeSelector } from './QRTypeSelector';
import { QRSetupPanel } from './QRSetupPanel';
import { QRCustomizePanel } from './QRCustomizePanel';
import { QRFinalPanel } from './QRFinalPanel';

export type QRCodeType = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  category: 'dynamic' | 'static';
  badge?: string;
};

interface QRGeneratorStepperProps {
  initialType?: string;
}

export function QRGeneratorStepper({ initialType }: QRGeneratorStepperProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<QRCodeType | null>(null);
  const [setupData, setSetupData] = useState<any>(null);
  const [customizeData, setCustomizeData] = useState<any>(null);

  const steps = [
    { number: 1, title: 'Select type', completed: currentStep > 1 },
    { number: 2, title: 'Setup', completed: currentStep > 2 },
    { number: 3, title: 'Customize', completed: currentStep > 3 },
    { number: 4, title: 'Done', completed: currentStep > 4 },
  ];

  const handleTypeSelect = (type: QRCodeType) => {
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

  const handleBackToStep = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Step Indicator */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div 
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                step.completed 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : currentStep === step.number
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-gray-300 text-gray-400 bg-white'
              }`}
            >
              {step.completed ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="text-sm font-semibold">{step.number}</span>
              )}
            </div>
            <span className={`ml-2 text-sm font-medium ${
              currentStep >= step.number ? 'text-gray-900' : 'text-gray-400'
            }`}>
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <ChevronRight className="w-4 h-4 text-gray-300 mx-4" />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="min-h-[600px]">
        {currentStep === 1 && (
          <QRTypeSelector 
            onTypeSelect={handleTypeSelect}
            initialType={initialType}
          />
        )}
        
        {currentStep === 2 && selectedType && (
          <QRSetupPanel 
            qrType={selectedType}
            onComplete={handleSetupComplete}
            onBack={() => handleBackToStep(1)}
          />
        )}
        
        {currentStep === 3 && selectedType && setupData && (
          <QRCustomizePanel 
            qrType={selectedType}
            setupData={setupData}
            onComplete={handleCustomizeComplete}
            onBack={() => handleBackToStep(2)}
          />
        )}
        
        {currentStep === 4 && selectedType && setupData && customizeData && (
          <QRFinalPanel 
            qrType={selectedType}
            setupData={setupData}
            customizeData={customizeData}
            onBack={() => handleBackToStep(3)}
          />
        )}
      </div>
    </div>
  );
}
