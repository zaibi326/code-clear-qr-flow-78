
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Download, 
  FileText, 
  Loader2,
  Rocket,
  AlertCircle 
} from 'lucide-react';

interface CampaignGenerationProps {
  onGenerate: () => void;
  campaignName: string;
  qrCount: number;
}

const CampaignGeneration = ({ onGenerate, campaignName, qrCount }: CampaignGenerationProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate generation process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setProgress(i);
    }
    
    setIsGenerating(false);
    setIsComplete(true);
    onGenerate();
  };

  if (isComplete) {
    return (
      <div className="text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Campaign Generated Successfully!</h2>
          <p className="text-gray-600">Your QR campaign is ready for download</p>
        </div>

        <Card className="max-w-md mx-auto mb-6">
          <CardHeader>
            <CardTitle className="text-lg">{campaignName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">QR Codes Generated:</span>
                <span className="font-medium">{qrCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Format:</span>
                <span className="font-medium">PDF</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status:</span>
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Complete
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-center">
          <Button size="lg" className="bg-green-600 hover:bg-green-700">
            <Download className="w-5 h-5 mr-2" />
            Download Campaign
          </Button>
          <Button variant="outline" size="lg">
            <FileText className="w-5 h-5 mr-2" />
            View Details
          </Button>
        </div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="text-center">
        <div className="mb-6">
          <Loader2 className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Campaign...</h2>
          <p className="text-gray-600">Please wait while we create your QR codes</p>
        </div>

        <Card className="max-w-md mx-auto">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Progress:</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-3" />
              <div className="text-xs text-gray-500 text-center">
                Processing {qrCount} QR codes...
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mb-6">
        <Rocket className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Generate</h2>
        <p className="text-gray-600">Your campaign is configured and ready to be created</p>
      </div>

      <Card className="max-w-md mx-auto mb-6">
        <CardHeader>
          <CardTitle className="text-lg">{campaignName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">QR Codes to Generate:</span>
              <span className="font-medium">{qrCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Output Format:</span>
              <span className="font-medium">PDF with embedded QR codes</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Estimated Time:</span>
              <span className="font-medium">~{Math.ceil(qrCount / 10)} minutes</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6">
        <div className="flex items-center justify-center text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
          <AlertCircle className="w-4 h-4 mr-2" />
          Generation may take a few minutes for large campaigns
        </div>
      </div>

      <Button 
        onClick={handleGenerate}
        size="lg"
        className="bg-blue-600 hover:bg-blue-700"
      >
        <Rocket className="w-5 h-5 mr-2" />
        Generate Campaign
      </Button>
    </div>
  );
};

export default CampaignGeneration;
