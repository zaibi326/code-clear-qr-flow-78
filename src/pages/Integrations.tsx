
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plug, Check, ExternalLink, Settings, Zap, Globe, Mail, Database } from 'lucide-react';

const Integrations = () => {
  const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>(['google-analytics']);

  const integrationStats = [
    {
      title: 'Connected Apps',
      value: '4',
      icon: Plug,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'API Calls',
      value: '1.2K',
      icon: Zap,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Active Webhooks',
      value: '3',
      icon: Globe,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Data Synced',
      value: '98%',
      icon: Database,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const availableIntegrations = [
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      description: 'Track QR code performance with detailed analytics',
      icon: '📊',
      category: 'Analytics',
      features: ['Real-time tracking', 'Custom events', 'Goal conversion']
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      description: 'Sync QR code scans with your email marketing campaigns',
      icon: '📧',
      category: 'Marketing',
      features: ['Audience sync', 'Campaign tracking', 'Automation triggers']
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Get notifications about QR code activity in your workspace',
      icon: '💬',
      category: 'Communication',
      features: ['Real-time alerts', 'Custom channels', 'Team notifications']
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Connect with 3000+ apps through automated workflows',
      icon: '⚡',
      category: 'Automation',
      features: ['1000+ app connections', 'Custom workflows', 'Trigger actions']
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      description: 'Sync leads and track customer interactions',
      icon: '🎯',
      category: 'CRM',
      features: ['Lead tracking', 'Contact sync', 'Pipeline management']
    },
    {
      id: 'shopify',
      name: 'Shopify',
      description: 'Integrate QR codes with your e-commerce store',
      icon: '🛒',
      category: 'E-commerce',
      features: ['Product links', 'Order tracking', 'Customer insights']
    }
  ];

  const toggleIntegration = (integrationId: string) => {
    setConnectedIntegrations(prev => 
      prev.includes(integrationId) 
        ? prev.filter(id => id !== integrationId)
        : [...prev, integrationId]
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0 ml-[240px]">
          <DashboardTopbar />
          
          <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
              {/* Header Section */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  Integrations
                </h1>
                <p className="text-gray-600">Connect your favorite tools and automate your QR code workflows</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {integrationStats.map((stat, index) => (
                  <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                          <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Available Integrations */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Available Integrations</h2>
                  <Button variant="outline" className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Browse All
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableIntegrations.map((integration) => {
                    const isConnected = connectedIntegrations.includes(integration.id);
                    
                    return (
                      <Card key={integration.id} className="group hover:shadow-lg transition-all duration-200 border border-gray-200">
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="text-2xl">{integration.icon}</div>
                              <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">{integration.name}</CardTitle>
                                <Badge variant="secondary" className="text-xs">{integration.category}</Badge>
                              </div>
                            </div>
                            {isConnected && (
                              <div className="flex items-center text-green-600">
                                <Check className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{integration.description}</p>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Features:</h4>
                              <ul className="space-y-1">
                                {integration.features.map((feature, index) => (
                                  <li key={index} className="text-xs text-gray-600 flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-blue-400" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="flex items-center justify-between pt-2">
                              <Button
                                variant={isConnected ? "outline" : "default"}
                                size="sm"
                                onClick={() => toggleIntegration(integration.id)}
                                className={isConnected ? "text-red-600 hover:text-red-700" : ""}
                              >
                                {isConnected ? "Disconnect" : "Connect"}
                              </Button>
                              {isConnected && (
                                <Button variant="ghost" size="sm">
                                  <Settings className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Integrations;
