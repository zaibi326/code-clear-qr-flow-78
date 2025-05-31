
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, Globe, Database, Mail, Settings, Plus, CheckCircle, Clock } from 'lucide-react';

export const DashboardIntegrations = () => {
  const integrations = [
    {
      name: 'Zapier',
      icon: Zap,
      description: 'Connect with 5,000+ apps through Zapier automation',
      category: 'Automation',
      status: 'Available',
      connected: false
    },
    {
      name: 'Webhooks',
      icon: Globe,
      description: 'Real-time notifications for QR code scans and events',
      category: 'Developer',
      status: 'Available',
      connected: true
    },
    {
      name: 'Google Analytics',
      icon: Database,
      description: 'Track QR code performance in your analytics dashboard',
      category: 'Analytics',
      status: 'Available',
      connected: false
    },
    {
      name: 'Mailchimp',
      icon: Mail,
      description: 'Add QR code scanners to your email marketing lists',
      category: 'Marketing',
      status: 'Coming Soon',
      connected: false
    }
  ];

  const connectedIntegrations = integrations.filter(integration => integration.connected);
  const availableIntegrations = integrations.filter(integration => !integration.connected && integration.status === 'Available');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
          <p className="text-muted-foreground">
            Connect ClearQR.io with your favorite tools and platforms
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Integration
        </Button>
      </div>

      <Tabs defaultValue="connected" className="space-y-4">
        <TabsList>
          <TabsTrigger value="connected">Connected ({connectedIntegrations.length})</TabsTrigger>
          <TabsTrigger value="available">Available ({availableIntegrations.length})</TabsTrigger>
          <TabsTrigger value="all">All Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="connected" className="space-y-4">
          {connectedIntegrations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connectedIntegrations.map((integration, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <integration.icon className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                          <p className="text-sm text-gray-500">{integration.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          Connected
                        </Badge>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{integration.description}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                      <Button size="sm" variant="ghost">
                        Disconnect
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Connected Integrations</h3>
                <p className="text-gray-600 mb-4">
                  Connect your first integration to start automating your QR code workflows
                </p>
                <Button>Browse Available Integrations</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableIntegrations.map((integration, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <integration.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                        <p className="text-sm text-gray-500">{integration.category}</p>
                      </div>
                    </div>
                    <Badge variant="default">
                      Available
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-4">{integration.description}</p>
                  <Button size="sm" className="w-full">
                    Connect
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((integration, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        integration.connected ? 'bg-green-100' : 
                        integration.status === 'Available' ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <integration.icon className={`h-6 w-6 ${
                          integration.connected ? 'text-green-600' : 
                          integration.status === 'Available' ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                        <p className="text-sm text-gray-500">{integration.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {integration.connected && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {integration.status === 'Coming Soon' && <Clock className="h-4 w-4 text-gray-400" />}
                      <Badge variant={
                        integration.connected ? 'secondary' : 
                        integration.status === 'Available' ? 'default' : 'secondary'
                      } className={
                        integration.connected ? 'bg-green-100 text-green-700' : ''
                      }>
                        {integration.connected ? 'Connected' : integration.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{integration.description}</p>
                  <Button 
                    size="sm" 
                    variant={integration.connected ? 'outline' : 'default'}
                    disabled={integration.status === 'Coming Soon'}
                    className="w-full"
                  >
                    {integration.connected ? 'Manage' : 
                     integration.status === 'Available' ? 'Connect' : 'Coming Soon'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Need a Custom Integration?</CardTitle>
          <CardDescription>
            Our team can help you build custom integrations for your specific needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button>Contact Sales</Button>
            <Button variant="outline">View API Docs</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
