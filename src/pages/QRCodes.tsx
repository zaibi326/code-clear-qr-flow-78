
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { QRTypeSelector } from '@/components/qr/QRTypeSelector';
import { QRGeneratorStepper, QRCodeType } from '@/components/qr/QRGeneratorStepper';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Zap, FileText, Smartphone, ArrowLeft } from 'lucide-react';

const QRCodes = () => {
  const [selectedType, setSelectedType] = useState<QRCodeType | null>(null);

  const quickActions = [
    {
      id: 'url',
      title: 'Website URL',
      description: 'Create QR code for any website or landing page',
      icon: QrCode,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      count: '1,234'
    },
    {
      id: 'vcard',
      title: 'Business Card',
      description: 'Share contact information instantly',
      icon: FileText,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      count: '856'
    },
    {
      id: 'wifi',
      title: 'Wi-Fi Network',
      description: 'Allow easy WiFi connection',
      icon: Zap,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      count: '542'
    },
    {
      id: 'sms',
      title: 'SMS Message',
      description: 'Pre-fill SMS message for quick sending',
      icon: Smartphone,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      count: '398'
    }
  ];

  const handleTypeSelect = (type: QRCodeType) => {
    setSelectedType(type);
    console.log('QR Type selected:', type);
  };

  const handleQuickActionClick = (actionId: string) => {
    // Create a QRCodeType object from the actionId
    const qrType: QRCodeType = {
      id: actionId,
      title: quickActions.find(a => a.id === actionId)?.title || '',
      description: quickActions.find(a => a.id === actionId)?.description || '',
      icon: quickActions.find(a => a.id === actionId)?.icon || QrCode,
      color: 'bg-blue-500',
      category: 'dynamic'
    };
    setSelectedType(qrType);
    console.log('Quick action selected:', actionId);
  };

  const handleBack = () => {
    setSelectedType(null);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0 ml-[240px]">
          <DashboardTopbar />
          
          <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
              {/* Header Section */}
              <div className="mb-8 animate-fade-in">
                <div className="flex items-center gap-4 mb-4">
                  {selectedType && (
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="flex items-center gap-2 hover:bg-gray-100"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button>
                  )}
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                      QR Code Generator
                    </h1>
                    <p className="text-lg text-gray-600">Create dynamic and static QR codes for any purpose</p>
                  </div>
                </div>
              </div>

              {!selectedType ? (
                <>
                  {/* Quick Actions */}
                  <div className="mb-12 animate-fade-in">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Popular QR Types</h2>
                    <p className="text-gray-600 mb-8">Get started quickly with our most popular QR code types</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {quickActions.map((action) => (
                        <Card 
                          key={action.id}
                          className="group hover:shadow-2xl transition-all duration-500 cursor-pointer border-0 bg-white/80 backdrop-blur-sm hover:scale-105 hover:bg-white"
                          onClick={() => handleQuickActionClick(action.id)}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className={`p-4 rounded-2xl bg-gradient-to-r ${action.color} text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                <action.icon className="h-7 w-7" />
                              </div>
                              <div className="text-right">
                                <span className="text-2xl font-bold text-gray-900">{action.count}</span>
                                <p className="text-xs text-gray-500">created</p>
                              </div>
                            </div>
                            <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                              {action.title}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{action.description}</p>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium">
                                Create Now
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Full QR Type Selector */}
                  <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-gray-200 shadow-2xl p-8 animate-fade-in">
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore All QR Code Types</h2>
                      <p className="text-lg text-gray-600 max-w-2xl mx-auto">Choose from our comprehensive collection of QR code types to create the perfect solution for your needs</p>
                    </div>
                    <QRTypeSelector onTypeSelect={handleTypeSelect} />
                  </div>
                </>
              ) : (
                <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-gray-200 shadow-2xl animate-fade-in">
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

export default QRCodes;
