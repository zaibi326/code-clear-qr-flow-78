
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plug, Check, ExternalLink, Settings, Zap, Globe, Mail, Database, TrendingUp, Plus } from 'lucide-react';

const Integrations = () => {
  const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>(['google-analytics']);

  const integrationStats = [
    {
      title: 'Connected Apps',
      value: '4',
      icon: Plug,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
      lightBg: 'bg-blue-50',
      change: '+2'
    },
    {
      title: 'API Calls',
      value: '1.2K',
      icon: Zap,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
      lightBg: 'bg-green-50',
      change: '+24%'
    },
    {
      title: 'Active Webhooks',
      value: '3',
      icon: Globe,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-r from-purple-500 to-purple-600',
      lightBg: 'bg-purple-50',
      change: '+1'
    },
    {
      title: 'Data Synced',
      value: '98%',
      icon: Database,
      color: 'text-orange-600',
      bgColor: 'bg-gradient-to-r from-orange-500 to-orange-600',
      lightBg: 'bg-orange-50',
      change: '+2%'
    }
  ];

  const availableIntegrations = [
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      description: 'Track QR code performance with detailed analytics and insights',
      icon: '📊',
      category: 'Analytics',
      features: ['Real-time tracking', 'Custom events', 'Goal conversion', 'Advanced reports'],
      rating: 4.8,
      popularity: 'Very Popular'
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      description: 'Sync QR code scans with your email marketing campaigns',
      icon: '📧',
      category: 'Marketing',
      features: ['Audience sync', 'Campaign tracking', 'Automation triggers', 'Segmentation'],
      rating: 4.6,
      popularity: 'Popular'
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Get real-time notifications about QR code activity in your workspace',
      icon: '💬',
      category: 'Communication',
      features: ['Real-time alerts', 'Custom channels', 'Team notifications', 'Bot integration'],
      rating: 4.7,
      popularity: 'Popular'
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Connect with 3000+ apps through automated workflows',
      icon: '⚡',
      category: 'Automation',
      features: ['3000+ app connections', 'Custom workflows', 'Trigger actions', 'Multi-step zaps'],
      rating: 4.9,
      popularity: 'Very Popular'
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      description: 'Sync leads and track customer interactions seamlessly',
      icon: '🎯',
      category: 'CRM',
      features: ['Lead tracking', 'Contact sync', 'Pipeline management', 'Deal automation'],
      rating: 4.5,
      popularity: 'Growing'
    },
    {
      id: 'shopify',
      name: 'Shopify',
      description: 'Integrate QR codes with your e-commerce store',
      icon: '🛒',
      category: 'E-commerce',
      features: ['Product links', 'Order tracking', 'Customer insights', 'Inventory sync'],
      rating: 4.4,
      popularity: 'Popular'
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
      <div className="min-h-screen flex w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0 ml-[240px]">
          <DashboardTopbar />
          
          <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
              {/* Header Section */}
              <div className="mb-8 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                      Integrations
                    </h1>
                    <p className="text-lg text-gray-600">Connect your favorite tools and automate your QR code workflows</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex items-center gap-2 hover:bg-gray-100">
                      <ExternalLink className="h-4 w-4" />
                      Browse All
                    </Button>
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Request Integration
                    </Button>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
                {integrationStats.map((stat, index) => (
                  <Card key={index} className="group border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl hover:scale-105 transition-all duration-500">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-4 rounded-2xl ${stat.bgColor} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                          <stat.icon className="h-6 w-6" />
                        </div>
                        <div className="flex items-center gap-1 text-green-600">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm font-medium">{stat.change}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Available Integrations */}
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-gray-200 shadow-2xl p-8 animate-fade-in">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Integrations</h2>
                    <p className="text-gray-600">Connect with the tools you already use to supercharge your workflow</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableIntegrations.map((integration) => {
                    const isConnected = connectedIntegrations.includes(integration.id);
                    
                    return (
                      <Card key={integration.id} className="group hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 bg-white/80 backdrop-blur-sm hover:bg-white">
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <div className="text-3xl bg-gray-50 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                                {integration.icon}
                              </div>
                              <div>
                                <CardTitle className="text-xl font-bold text-gray-900 mb-1">{integration.name}</CardTitle>
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary" className="text-xs">{integration.category}</Badge>
                                  <Badge variant="outline" className="text-xs text-blue-600">{integration.popularity}</Badge>
                                </div>
                              </div>
                            </div>
                            {isConnected && (
                              <div className="flex items-center text-green-600 bg-green-50 rounded-full p-2">
                                <Check className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">{integration.description}</p>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <Zap className="h-4 w-4 text-blue-500" />
                                Key Features
                              </h4>
                              <div className="grid grid-cols-2 gap-2">
                                {integration.features.map((feature, index) => (
                                  <div key={index} className="text-xs text-gray-600 flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-lg">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                    {feature}
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                              <div className="flex items-center gap-1">
                                <span className="text-sm font-medium text-gray-700">★ {integration.rating}</span>
                                <span className="text-xs text-gray-500">rating</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant={isConnected ? "outline" : "default"}
                                  size="sm"
                                  onClick={() => toggleIntegration(integration.id)}
                                  className={isConnected ? "text-red-600 hover:text-red-700 hover:bg-red-50" : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"}
                                >
                                  {isConnected ? "Disconnect" : "Connect"}
                                </Button>
                                {isConnected && (
                                  <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                                    <Settings className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
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
