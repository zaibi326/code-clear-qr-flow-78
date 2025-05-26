
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileImage, QrCode } from 'lucide-react';
import { Template } from '@/types/template';
import { QRData } from '@/pages/CampaignCreator';

interface CampaignPreviewProps {
  template: Template;
  qrCodes: QRData[];
  campaignName: string;
}

const CampaignPreview = ({ template, qrCodes, campaignName }: CampaignPreviewProps) => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Campaign Preview</h2>
        <p className="text-gray-600">Review your campaign before generation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Template Preview */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileImage className="w-5 h-5 mr-2" />
                Template Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {template.file?.type === 'application/pdf' ? (
                  <div className="w-full h-64 bg-red-100 rounded-lg flex items-center justify-center">
                    <FileImage className="w-16 h-16 text-red-600" />
                    <span className="ml-2 text-red-600 font-medium">PDF Template</span>
                  </div>
                ) : (
                  <img 
                    src={template.preview} 
                    alt={template.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}
                
                {/* QR Position Indicator */}
                {template.qrPosition && (
                  <div 
                    className="absolute border-2 border-blue-500 bg-blue-100/50 rounded flex items-center justify-center"
                    style={{
                      left: `${(template.qrPosition.x / 400) * 100}%`,
                      top: `${(template.qrPosition.y / 300) * 100}%`,
                      width: `${(template.qrPosition.width / 400) * 100}%`,
                      height: `${(template.qrPosition.height / 300) * 100}%`
                    }}
                  >
                    <QrCode className="w-6 h-6 text-blue-600" />
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <h3 className="font-medium">{template.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  QR Position: {template.qrPosition ? 'Configured' : 'Not set'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Details */}
        <div className="space-y-6">
          {/* Campaign Info */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Campaign Name</span>
                <p className="text-lg font-medium">{campaignName || 'Untitled Campaign'}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500">Template</span>
                <p className="font-medium">{template.name}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500">QR Codes</span>
                <p className="font-medium">{qrCodes.length} codes</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500">Status</span>
                <Badge variant="secondary">Ready to Generate</Badge>
              </div>
            </CardContent>
          </Card>

          {/* QR Codes List */}
          <Card>
            <CardHeader>
              <CardTitle>QR Codes ({qrCodes.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {qrCodes.slice(0, 5).map((qr, index) => (
                  <div key={qr.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <QrCode className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-sm font-medium">QR {index + 1}</span>
                    </div>
                    <span className="text-xs text-gray-500 truncate max-w-32">
                      {qr.content}
                    </span>
                  </div>
                ))}
                
                {qrCodes.length > 5 && (
                  <div className="text-center text-sm text-gray-500 py-2">
                    ... and {qrCodes.length - 5} more codes
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Generation Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Generation Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Output Format:</span>
                  <span className="font-medium">PDF with QR codes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Files to Generate:</span>
                  <span className="font-medium">{qrCodes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Estimated Time:</span>
                  <span className="font-medium">~{Math.ceil(qrCodes.length / 10)} min</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CampaignPreview;
