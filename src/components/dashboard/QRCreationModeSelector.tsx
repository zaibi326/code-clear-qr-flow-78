
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
    if (mode === 'single') {
      navigate('/create-qr-code');
    } else {
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
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Choose Creation Mode
        </h2>
        <p className="text-slate-600 font-medium">
          Select how you'd like to create your QR codes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {modes.map((mode) => (
          <Card 
            key={mode.id}
            className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:border-indigo-300 hover:scale-105 group bg-white/95 backdrop-blur-lg border border-indigo-100/50 shadow-lg shadow-indigo-500/10"
            onClick={() => handleModeSelect(mode.id as 'single' | 'bulk')}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-4 rounded-xl ${mode.color} text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <mode.icon className="h-8 w-8" />
                </div>
                {mode.badge && (
                  <Badge 
                    variant={mode.badge === 'Popular' ? 'default' : 'secondary'} 
                    className={`text-xs ${
                      mode.badge === 'Popular' 
                        ? 'bg-blue-100 text-blue-700 border-blue-200' 
                        : 'bg-green-100 text-green-700 border-green-200'
                    }`}
                  >
                    {mode.badge}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {mode.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600 leading-relaxed">
                {mode.description}
              </p>
              
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  Key Benefits
                </h4>
                <ul className="space-y-1">
                  {mode.benefits.map((benefit, index) => (
                    <li key={index} className="text-sm text-slate-600 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-indigo-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Best for:</span>
                  <span className="font-medium text-indigo-600 flex items-center gap-1">
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

      <div className="text-center p-4 bg-indigo-50 rounded-lg border border-indigo-200">
        <p className="text-indigo-700 font-medium text-sm">
          💡 Tip: You can switch between modes anytime. Start with single QR codes to get familiar, then scale up with bulk creation.
        </p>
      </div>
    </div>
  );
}
