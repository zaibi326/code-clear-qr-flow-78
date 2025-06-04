
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { QRTypeSelector } from '@/components/qr/QRTypeSelector';
import { QRGeneratorStepper, QRCodeType } from '@/components/qr/QRGeneratorStepper';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode, Zap, FileText, Smartphone } from 'lucide-react';

const QuickGenerate = () => {
  const [selectedType, setSelectedType] = useState<QRCodeType | null>(null);

  const quickActions = [
    {
      id: 'url',
      title: 'Website URL',
      description: 'Create QR code for any website or landing page',
      icon: QrCode,
      color: 'bg-blue-500',
      count: '1,234'
    },
    {
      id: 'vcard',
      title: 'Business Card',
      description: 'Share contact information instantly',
      icon: FileText,
      color: 'bg-green-500',
      count: '856'
    },
    {
      id: 'wifi',
      title: 'Wi-Fi Network',
      description: 'Allow easy WiFi connection',
      icon: Zap,
      color: 'bg-purple-500',
      count: '542'
    },
    {
      id: 'sms',
      title: 'SMS Message',
      description: 'Pre-fill SMS message for quick sending',
      icon: Smartphone,
      color: 'bg-orange-500',
      count: '398'
    }
  ];

  const handleTypeSelect = (type: QRCodeType) => {
    setSelectedType(type);
  };

  const handleQuickActionClick = (actionId: string) => {
    // Create a basic QRCodeType object for quick actions
    const qrType: QRCodeType = {
      id: actionId,
      title: quickActions.find(a => a.id === actionId)?.title || '',
      description: quickActions.find(a => a.id === actionId)?.description || '',
      icon: quickActions.find(a => a.id === actionId)?.icon || QrCode,
      color: quickActions.find(a => a.id === actionId)?.color || 'bg-blue-500',
      category: 'dynamic'
    };
    setSelectedType(qrType);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0 ml-[240px]">
          <DashboardTopbar />
          
          <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
              {/* Header Section */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  QR Code Generator
                </h1>
                <p className="text-gray-600">Create dynamic and static QR codes for any purpose</p>
              </div>

              {!selectedType ? (
                <>
                  {/* Quick Actions */}
                  <div className="mb-10">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Popular QR Types</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {quickActions.map((action) => (
                        <Card 
                          key={action.id}
                          className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white/80 backdrop-blur-sm"
                          onClick={() => handleQuickActionClick(action.id)}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className={`p-3 rounded-xl ${action.color} text-white group-hover:scale-110 transition-transform`}>
                                <action.icon className="h-6 w-6" />
                              </div>
                              <span className="text-sm font-medium text-gray-500">{action.count}</span>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                              {action.title}
                            </h3>
                            <p className="text-sm text-gray-600">{action.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Full QR Type Selector */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">All QR Code Types</h2>
                    <QRTypeSelector onTypeSelect={handleTypeSelect} />
                  </div>
                </>
              ) : (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg">
                  <QRGeneratorStepper 
                    initialType={selectedType.id}
                  />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default QuickGenerate;
