
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Rocket, FileText, QrCode, BarChart3 } from 'lucide-react';

interface CreateCampaignTabProps {
  onStartCampaign?: () => void;
}

export const CreateCampaignTab = ({ onStartCampaign }: CreateCampaignTabProps) => {
  const features = [
    {
      icon: FileText,
      title: 'Template Selection',
      description: 'Choose from your uploaded templates or library templates'
    },
    {
      icon: QrCode,
      title: 'QR Code Assignment',
      description: 'Assign unique QR codes with custom data to each material'
    },
    {
      icon: Rocket,
      title: 'Bulk Generation',
      description: 'Generate hundreds of personalized materials at once'
    },
    {
      icon: BarChart3,
      title: 'Analytics Tracking',
      description: 'Track scans and engagement for each generated material'
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create New Campaign</CardTitle>
          <p className="text-gray-600">Generate personalized marketing materials with QR codes</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <feature.icon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Button 
              onClick={onStartCampaign}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Start New Campaign
            </Button>
            <p className="text-sm text-gray-500 mt-3">
              Create campaigns with custom QR codes and bulk generation
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Process</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-medium">1</div>
              <h4 className="font-medium mb-1">Choose Template</h4>
              <p className="text-xs text-gray-600">Select your marketing template</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-medium">2</div>
              <h4 className="font-medium mb-1">Assign QR Codes</h4>
              <p className="text-xs text-gray-600">Configure QR codes and data</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-medium">3</div>
              <h4 className="font-medium mb-1">Preview Campaign</h4>
              <p className="text-xs text-gray-600">Review before generation</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-medium">4</div>
              <h4 className="font-medium mb-1">Generate & Download</h4>
              <p className="text-xs text-gray-600">Create all materials</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
