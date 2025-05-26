
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Rocket, 
  CheckCircle, 
  Download, 
  FileImage, 
  QrCode,
  Clock,
  AlertCircle
} from 'lucide-react';

interface CampaignGenerationProps {
  onGenerate: () => void;
  campaignName: string;
  qrCount: number;
}

const CampaignGeneration = ({ onGenerate, campaignName, qrCount }: CampaignGenerationProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState<any[]>([]);

  const estimatedTime = Math.ceil(qrCount / 10); // ~10 QR codes per second

  const simulateGeneration = async () => {
    setIsGenerating(true);
    setProgress(0);
    
    const steps = [
      { step: 'Preparing templates...', duration: 1000, progress: 20 },
      { step: 'Generating QR codes...', duration: qrCount * 100, progress: 60 },
      { step: 'Creating PDF materials...', duration: qrCount * 50, progress: 80 },
      { step: 'Finalizing campaign...', duration: 500, progress: 100 }
    ];

    for (const { step, duration, progress: stepProgress } of steps) {
      setCurrentStep(step);
      
      // Simulate gradual progress within each step
      const interval = setInterval(() => {
        setProgress(prev => {
          const increment = (stepProgress - prev) / 10;
          return Math.min(prev + increment, stepProgress);
        });
      }, duration / 10);

      await new Promise(resolve => setTimeout(resolve, duration));
      clearInterval(interval);
      setProgress(stepProgress);
    }

    // Simulate generated files
    const files = Array.from({ length: Math.min(qrCount, 5) }, (_, i) => ({
      id: `file-${i}`,
      name: `${campaignName}-batch-${i + 1}.pdf`,
      size: '2.4 MB',
      items: Math.min(qrCount - (i * Math.ceil(qrCount / 5)), Math.ceil(qrCount / 5))
    }));

    setGeneratedFiles(files);
    setIsGenerating(false);
    setIsComplete(true);
    onGenerate();
  };

  if (isComplete) {
    return (
      <div>
        <div className="mb-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Campaign Generated Successfully!</h2>
          <p className="text-gray-600">Your {qrCount} marketing materials are ready for download</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Download Options */}
          <Card>
            <CardHeader>
              <CardTitle>Download Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {generatedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <FileImage className="w-5 h-5 text-blue-600 mr-3" />
                      <div>
                        <div className="font-medium">{file.name}</div>
                        <div className="text-sm text-gray-500">{file.items} items • {file.size}</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
                
                <div className="pt-3 border-t">
                  <Button className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download All Files (ZIP)
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <QrCode className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">{qrCount}</div>
                    <div className="text-sm text-gray-600">QR Codes Generated</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <FileImage className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">{generatedFiles.length}</div>
                    <div className="text-sm text-gray-600">PDF Files Created</div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Campaign Name:</span>
                    <span className="font-medium">{campaignName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Generated At:</span>
                    <span className="font-medium">{new Date().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Size:</span>
                    <span className="font-medium">~{(qrCount * 2.5 / 1024).toFixed(1)} GB</span>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <Button variant="outline" className="w-full">
                    Create New Campaign
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div>
        <div className="mb-6 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Rocket className="w-8 h-8 text-blue-600 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Campaign</h2>
          <p className="text-gray-600">Creating {qrCount} marketing materials...</p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{currentStep}</span>
                <Badge variant="outline">
                  {Math.round(progress)}% Complete
                </Badge>
              </div>
              <Progress value={progress} className="h-3" />
              <div className="text-center text-sm text-gray-500">
                Estimated time remaining: {Math.max(0, estimatedTime - Math.round(progress * estimatedTime / 100))} seconds
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generation Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <QrCode className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <div className="text-sm text-gray-600">QR Codes</div>
                <div className="font-medium">
                  {Math.round(progress * qrCount / 100)} / {qrCount}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <FileImage className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <div className="text-sm text-gray-600">PDF Files</div>
                <div className="font-medium">
                  {Math.round(progress * generatedFiles.length / 100)} / {Math.ceil(qrCount / 20)}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Processing</div>
                <div className="font-medium">{Math.round(progress)}%</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <Rocket className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Generate</h2>
        <p className="text-gray-600">Generate {qrCount} unique marketing materials for your campaign</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Generation Preview */}
        <Card>
          <CardHeader>
            <CardTitle>What Will Be Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <QrCode className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="font-medium">Unique QR Codes</span>
                </div>
                <Badge>{qrCount}</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <FileImage className="w-5 h-5 text-green-600 mr-3" />
                  <span className="font-medium">PDF Marketing Materials</span>
                </div>
                <Badge>{qrCount}</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center">
                  <Download className="w-5 h-5 text-purple-600 mr-3" />
                  <span className="font-medium">Downloadable Files</span>
                </div>
                <Badge>{Math.ceil(qrCount / 20)} ZIP files</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generation Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Generation Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Campaign Name:</span>
                <span className="font-medium">{campaignName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Materials:</span>
                <span className="font-medium">{qrCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Time:</span>
                <span className="font-medium">{estimatedTime} seconds</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Output Format:</span>
                <span className="font-medium">PDF + PNG</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">File Size:</span>
                <span className="font-medium">~{(qrCount * 2.5).toFixed(1)} MB</span>
              </div>
            </div>

            <div className="mt-6">
              <Button 
                onClick={simulateGeneration}
                className="w-full"
                size="lg"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Generate Campaign
              </Button>
            </div>

            {qrCount > 500 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center text-yellow-800">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">Large campaign detected. Generation may take up to {Math.ceil(qrCount / 100)} minutes.</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CampaignGeneration;
