
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QrCode, Eye } from 'lucide-react';

interface QRSamplePreviewProps {
  type: string;
  sampleContent: string;
  title: string;
}

export function QRSamplePreview({ type, sampleContent, title }: QRSamplePreviewProps) {
  const getSampleQRCode = () => {
    // Generate a simple QR code pattern for preview
    return (
      <div className="w-32 h-32 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center relative">
        <div className="w-28 h-28 bg-black relative">
          {/* Simple QR code pattern */}
          <div className="absolute inset-2 bg-white"></div>
          <div className="absolute top-2 left-2 w-6 h-6 bg-black"></div>
          <div className="absolute top-2 right-2 w-6 h-6 bg-black"></div>
          <div className="absolute bottom-2 left-2 w-6 h-6 bg-black"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-black"></div>
          
          {/* Random pattern dots */}
          <div className="absolute top-4 left-8 w-1 h-1 bg-black"></div>
          <div className="absolute top-6 left-6 w-1 h-1 bg-black"></div>
          <div className="absolute top-8 left-10 w-1 h-1 bg-black"></div>
          <div className="absolute top-10 left-4 w-1 h-1 bg-black"></div>
          <div className="absolute top-12 left-12 w-1 h-1 bg-black"></div>
          <div className="absolute top-14 left-8 w-1 h-1 bg-black"></div>
          <div className="absolute top-16 left-14 w-1 h-1 bg-black"></div>
          <div className="absolute top-18 left-6 w-1 h-1 bg-black"></div>
        </div>
      </div>
    );
  };

  const getPreviewContent = () => {
    switch (type) {
      case 'url':
      case 'multi-link':
      case 'pdf':
      case 'landing-page':
      case 'mobile-app':
      case 'social-media':
      case 'business-page':
      case 'facebook-page':
        return (
          <div className="bg-gray-50 border rounded-lg p-4 min-h-[200px] flex flex-col items-center justify-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full mb-3 flex items-center justify-center">
              <Eye className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-center">{title}</h3>
            <p className="text-sm text-gray-600 text-center mb-4">
              Preview of your {title.toLowerCase()}
            </p>
            <div className="w-full max-w-xs bg-white border rounded-lg p-3 shadow-sm">
              <div className="text-xs text-blue-600 font-medium mb-1">
                {sampleContent.replace('https://', '').replace('http://', '')}
              </div>
              <div className="h-2 bg-gray-200 rounded mb-2"></div>
              <div className="h-1 bg-gray-100 rounded mb-1"></div>
              <div className="h-1 bg-gray-100 rounded w-3/4"></div>
            </div>
          </div>
        );
      case 'location':
        return (
          <div className="bg-gray-50 border rounded-lg p-4 min-h-[200px] flex flex-col items-center justify-center">
            <div className="w-8 h-8 bg-green-500 rounded-full mb-3 flex items-center justify-center">
              <Eye className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Location Preview</h3>
            <div className="w-full max-w-xs bg-white border rounded-lg p-3 shadow-sm">
              <div className="w-full h-24 bg-green-100 rounded-lg mb-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-green-300"></div>
                <div className="absolute top-2 left-2 w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="absolute bottom-2 right-2 text-xs text-green-800">Maps</div>
              </div>
              <div className="text-xs font-medium text-gray-800">New York, NY</div>
              <div className="text-xs text-gray-500">Open in Google Maps</div>
            </div>
          </div>
        );
      case 'email':
        return (
          <div className="bg-gray-50 border rounded-lg p-4 min-h-[200px] flex flex-col items-center justify-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full mb-3 flex items-center justify-center">
              <Eye className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Email Preview</h3>
            <div className="w-full max-w-xs bg-white border rounded-lg p-3 shadow-sm">
              <div className="text-xs font-medium text-gray-800 mb-1">New Email</div>
              <div className="text-xs text-gray-600 mb-2">To: contact@example.com</div>
              <div className="h-1 bg-gray-100 rounded mb-1"></div>
              <div className="h-1 bg-gray-100 rounded w-3/4 mb-1"></div>
              <div className="h-1 bg-gray-100 rounded w-1/2"></div>
            </div>
          </div>
        );
      case 'call':
      case 'sms':
        return (
          <div className="bg-gray-50 border rounded-lg p-4 min-h-[200px] flex flex-col items-center justify-center">
            <div className="w-8 h-8 bg-green-500 rounded-full mb-3 flex items-center justify-center">
              <Eye className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{type === 'call' ? 'Call' : 'SMS'} Preview</h3>
            <div className="w-full max-w-xs bg-white border rounded-lg p-3 shadow-sm">
              <div className="text-xs font-medium text-gray-800 mb-2">+1 (234) 567-8900</div>
              <div className="flex gap-2">
                <div className="flex-1 bg-green-500 text-white text-xs py-1 px-2 rounded text-center">
                  {type === 'call' ? 'Call' : 'Message'}
                </div>
                <div className="flex-1 bg-gray-200 text-gray-700 text-xs py-1 px-2 rounded text-center">
                  Cancel
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-gray-50 border rounded-lg p-4 min-h-[200px] flex flex-col items-center justify-center">
            <QrCode className="h-12 w-12 text-gray-400 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Content Preview</h3>
            <p className="text-sm text-gray-600 text-center">
              Preview will appear here once content is added
            </p>
          </div>
        );
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* QR Code Preview */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Badge variant="outline" className="mb-2">QR Code Preview</Badge>
            </div>
            {getSampleQRCode()}
            <p className="text-xs text-gray-500 mt-2">Sample QR Code</p>
          </div>

          {/* Content Preview */}
          <div>
            <div className="flex items-center justify-center mb-4">
              <Badge variant="outline" className="mb-2">Live Preview</Badge>
            </div>
            {getPreviewContent()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
