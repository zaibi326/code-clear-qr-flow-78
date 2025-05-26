
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TemplateSelection from './TemplateSelection';
import QRAssignment from './QRAssignment';
import CampaignPreview from './CampaignPreview';
import CampaignGeneration from './CampaignGeneration';
import { Template } from '@/types/template';
import { Campaign, QRData } from '@/types/campaign';

interface CampaignWizardProps {
  onCampaignCreate: (campaign: Campaign) => void;
}

const steps = [
  { id: 1, title: 'Choose Template', description: 'Select your marketing template' },
  { id: 2, title: 'Assign QR Code', description: 'Configure QR codes and data' },
  { id: 3, title: 'Preview', description: 'Review your campaign' },
  { id: 4, title: 'Generate', description: 'Create your campaign' }
];

const CampaignWizard = ({ onCampaignCreate }: CampaignWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [qrCodes, setQrCodes] = useState<QRData[]>([]);
  const [campaignName, setCampaignName] = useState('');

  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
  };

  const handleQRAssignment = (qrData: QRData[], name: string) => {
    setQrCodes(qrData);
    setCampaignName(name);
  };

  const handleGenerate = () => {
    if (selectedTemplate && qrCodes.length > 0) {
      const campaign: Campaign = {
        id: `campaign-${Date.now()}`,
        name: campaignName || 'Untitled Campaign',
        template: selectedTemplate,
        qrCodes,
        createdAt: new Date(),
        status: 'generating'
      };
      onCampaignCreate(campaign);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedTemplate !== null;
      case 2:
        return qrCodes.length > 0 && campaignName.trim() !== '';
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.id 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'border-gray-300 text-gray-500'
              }`}>
                {step.id}
              </div>
              <div className="ml-3 hidden sm:block">
                <p className={`text-sm font-medium ${
                  currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Content */}
      <Card className="mb-8">
        <CardContent className="p-8">
          {currentStep === 1 && (
            <TemplateSelection 
              selectedTemplate={selectedTemplate}
              onTemplateSelect={handleTemplateSelect}
            />
          )}
          
          {currentStep === 2 && selectedTemplate && (
            <QRAssignment 
              template={selectedTemplate}
              onQRAssignment={handleQRAssignment}
              initialQRCodes={qrCodes}
              initialCampaignName={campaignName}
            />
          )}
          
          {currentStep === 3 && selectedTemplate && (
            <CampaignPreview 
              template={selectedTemplate}
              qrCodes={qrCodes}
              campaignName={campaignName}
            />
          )}
          
          {currentStep === 4 && (
            <CampaignGeneration 
              onGenerate={handleGenerate}
              campaignName={campaignName}
              qrCount={qrCodes.length}
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        {currentStep < steps.length ? (
          <Button 
            onClick={handleNext}
            disabled={!canProceed()}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button 
            onClick={handleGenerate}
            disabled={!canProceed()}
            className="bg-green-600 hover:bg-green-700"
          >
            Generate Campaign
          </Button>
        )}
      </div>
    </div>
  );
};

export default CampaignWizard;
