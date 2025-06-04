
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QrCode, FileSpreadsheet, Zap, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QRCreationModeSelectorProps {
  onModeSelect?: (mode: 'single' | 'bulk') => void;
}

export function QRCreationModeSelector({ onModeSelect }: QRCreationModeSelectorProps) {
  const navigate = useNavigate();

  const handleModeSelect = (mode: 'single' | 'bulk') => {
    console.log('Mode selected:', mode);
    
    if (mode === 'single') {
      // Navigate to single QR code creation with URL type pre-selected
      navigate('/create?type=url');
    } else {
      // Navigate to bulk data selector for bulk creation
      navigate('/bulk-data-selector');
    }
    
    onModeSelect?.(mode);
  };

  const modes = [
    {
      id: 'single',
      title: 'Single QR Code',
      description: 'Create one QR code at a time with custom settings',
      icon: QrCode,
      color: 'bg-blue-500',
      benefits: ['Quick setup', 'Custom design', 'Instant preview'],
      badge: 'Popular'
    },
    {
      id: 'bulk',
      title: 'Bulk QR Codes',
      description: 'Generate multiple QR codes from CSV or data templates',
      icon: FileSpreadsheet,
      color: 'bg-green-500',
      benefits: ['CSV upload', 'Batch processing', 'Time efficient'],
      badge: 'Pro'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Choose Creation Mode</h2>
        <p className="text-gray-600">Select how you'd like to create your QR codes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {modes.map((mode) => (
          <Card 
            key={mode.id}
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-gray-300 group bg-white border border-gray-200"
            onClick={() => handleModeSelect(mode.id as 'single' | 'bulk')}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${mode.color} text-white group-hover:scale-105 transition-transform duration-200`}>
                  <mode.icon className="h-6 w-6" />
                </div>
                {mode.badge && (
                  <Badge 
                    variant={mode.badge === 'Popular' ? 'default' : 'secondary'} 
                    className={`text-xs ${
                      mode.badge === 'Popular' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {mode.badge}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {mode.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                {mode.description}
              </p>
              
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  Key Benefits
                </h4>
                <ul className="space-y-1">
                  {mode.benefits.map((benefit, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Best for:</span>
                  <span className="font-medium text-blue-600 flex items-center gap-1">
                    {mode.id === 'single' ? (
                      <>
                        <QrCode className="h-4 w-4" />
                        Individual use
                      </>
                    ) : (
                      <>
                        <Users className="h-4 w-4" />
                        Teams & campaigns
                      </>
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-4xl mx-auto">
        <p className="text-blue-700 font-medium text-sm">
          💡 Tip: You can switch between modes anytime. Start with single QR codes to get familiar, then scale up with bulk creation.
        </p>
      </div>
    </div>
  );
}
