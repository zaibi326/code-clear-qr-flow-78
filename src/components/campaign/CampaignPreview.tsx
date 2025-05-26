
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileImage, QrCode, Users, Calendar } from 'lucide-react';
import { Template } from '@/types/template';
import { QRData } from '@/pages/CampaignCreator';

interface CampaignPreviewProps {
  template: Template;
  qrCodes: QRData[];
  campaignName: string;
}

const CampaignPreview = ({ template, qrCodes, campaignName }: CampaignPreviewProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Campaign Preview</h2>
        <p className="text-gray-600">Review your campaign before generation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Campaign Overview */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{campaignName}</CardTitle>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Ready to Generate
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <FileImage className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-sm font-medium">Template</div>
                  <div className="text-xs text-gray-600">{template.name}</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <QrCode className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-sm font-medium">QR Codes</div>
                  <div className="text-xs text-gray-600">{qrCodes.length} codes</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <Users className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <div className="text-sm font-medium">Recipients</div>
                  <div className="text-xs text-gray-600">{qrCodes.length} unique</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <Calendar className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-sm font-medium">Created</div>
                  <div className="text-xs text-gray-600">{formatDate(new Date())}</div>
                </div>
              </div>

              {/* Template Preview */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium mb-3">Template Preview</h4>
                <div className="relative bg-white border rounded-lg overflow-hidden" style={{ maxHeight: '300px' }}>
                  {template.file?.type === 'application/pdf' ? (
                    <div className="w-full h-48 bg-red-100 flex items-center justify-center">
                      <FileImage className="w-12 h-12 text-red-600" />
                      <span className="ml-2 text-red-600 font-medium">PDF Template</span>
                    </div>
                  ) : (
                    <img 
                      src={template.preview} 
                      alt={template.name}
                      className="w-full h-auto object-contain"
                    />
                  )}
                  
                  {/* QR Position Indicator */}
                  {template.qrPosition && (
                    <div 
                      className="absolute border-2 border-blue-500 bg-blue-100/50 flex items-center justify-center"
                      style={{
                        left: `${template.qrPosition.x}%`,
                        top: `${template.qrPosition.y}%`,
                        width: `${template.qrPosition.width}px`,
                        height: `${template.qrPosition.height}px`
                      }}
                    >
                      <QrCode className="w-6 h-6 text-blue-600" />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* QR Codes List */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">QR Codes ({qrCodes.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {qrCodes.slice(0, 10).map((qr, index) => (
                  <div key={qr.id} className="p-3 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">QR {index + 1}</span>
                      <QrCode className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="text-xs text-gray-600 break-all">
                      {qr.content.length > 40 ? `${qr.content.substring(0, 40)}...` : qr.content}
                    </div>
                    {qr.customData && Object.keys(qr.customData).length > 0 && (
                      <div className="mt-2">
                        <Badge variant="secondary" className="text-xs">
                          +{Object.keys(qr.customData).length} custom fields
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
                {qrCodes.length > 10 && (
                  <div className="text-center py-2 text-sm text-gray-500">
                    ... and {qrCodes.length - 10} more QR codes
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Generation Summary */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Generation Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Materials:</span>
                  <span className="font-medium">{qrCodes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Template Format:</span>
                  <span className="font-medium">
                    {template.file?.type === 'application/pdf' ? 'PDF' : 'Image'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Output Format:</span>
                  <span className="font-medium">PNG + PDF</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Size:</span>
                  <span className="font-medium">
                    ~{(qrCodes.length * 2.5).toFixed(1)} MB
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Warning Messages */}
      {qrCodes.length > 100 && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <div className="text-yellow-600 mr-2">⚠️</div>
            <div>
              <div className="font-medium text-yellow-800">Large Campaign Detected</div>
              <div className="text-sm text-yellow-700">
                This campaign has {qrCodes.length} materials. Generation may take several minutes.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignPreview;
