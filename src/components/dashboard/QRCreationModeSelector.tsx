
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Upload, Zap, Users } from 'lucide-react';

export function QRCreationModeSelector() {
  const navigate = useNavigate();

  const handleSingleQRClick = () => {
    console.log('Mode selected: single');
    navigate('/create?type=url');
  };

  const handleBulkQRClick = () => {
    console.log('Mode selected: bulk'); 
    navigate('/create-bulk');
  };

  const handleQuickGenerateClick = () => {
    console.log('Mode selected: quick');
    navigate('/quick-generate');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create QR Codes</h2>
        <p className="text-gray-600">Choose how you want to create your QR codes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Single QR Code */}
        <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group" onClick={handleSingleQRClick}>
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
              <QrCode className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Single QR Code</h3>
            <p className="text-gray-600 mb-4">Create one QR code with custom styling and content</p>
            <Button className="w-full" variant="outline">
              <QrCode className="h-4 w-4 mr-2" />
              Create Single
            </Button>
          </CardContent>
        </Card>

        {/* Bulk QR Codes */}
        <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group" onClick={handleBulkQRClick}>
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
              <Upload className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Bulk QR Codes</h3>
            <p className="text-gray-600 mb-4">Generate multiple QR codes from CSV data</p>
            <Button className="w-full" variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Create Bulk
            </Button>
          </CardContent>
        </Card>

        {/* Quick Generate */}
        <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group" onClick={handleQuickGenerateClick}>
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
              <Zap className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Generate</h3>
            <p className="text-gray-600 mb-4">Fast QR code generation with templates</p>
            <Button className="w-full" variant="outline">
              <Zap className="h-4 w-4 mr-2" />
              Quick Generate
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
