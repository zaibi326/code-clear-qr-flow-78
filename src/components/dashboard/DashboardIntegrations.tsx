
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Zap, Globe, Database, Mail, Settings, Plus, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

export const DashboardIntegrations = () => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookDialogOpen, setWebhookDialogOpen] = useState(false);
  const [zapierUrl, setZapierUrl] = useState('');
  const [zapierDialogOpen, setZapierDialogOpen] = useState(false);
  const [analyticsId, setAnalyticsId] = useState('');
  const [analyticsDialogOpen, setAnalyticsDialogOpen] = useState(false);

  const [integrations, setIntegrations] = useState([
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
  ]);

  const connectedIntegrations = integrations.filter(integration => integration.connected);
  const availableIntegrations = integrations.filter(integration => !integration.connected && integration.status === 'Available');

  const handleConnect = async (integrationName: string) => {
    if (integrationName === 'Zapier') {
      setZapierDialogOpen(true);
      return;
    }
    
    if (integrationName === 'Google Analytics') {
      setAnalyticsDialogOpen(true);
      return;
    }

    if (integrationName === 'Mailchimp') {
      toast({
        title: "Coming Soon",
        description: "Mailchimp integration is coming soon. Stay tuned!",
        variant: "default",
      });
      return;
    }

    setIsConnecting(integrationName);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIntegrations(prev => 
        prev.map(integration => 
          integration.name === integrationName 
            ? { ...integration, connected: true }
            : integration
        )
      );

      toast({
        title: "Integration Connected",
        description: `${integrationName} has been successfully connected to your account.`,
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: `Failed to connect ${integrationName}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsConnecting(null);
    }
  };

  const handleDisconnect = (integrationName: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.name === integrationName 
          ? { ...integration, connected: false }
          : integration
      )
    );

    toast({
      title: "Integration Disconnected",
      description: `${integrationName} has been disconnected from your account.`,
    });
  };

  const handleWebhookConfigure = () => {
    if (!webhookUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a webhook URL",
        variant: "destructive",
      });
      return;
    }

    // Simulate webhook configuration
    toast({
      title: "Webhook Configured",
      description: "Your webhook has been successfully configured.",
    });
    setWebhookDialogOpen(false);
    setWebhookUrl('');
  };

  const handleZapierConnect = () => {
    if (!zapierUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter your Zapier webhook URL",
        variant: "destructive",
      });
      return;
    }

    setIntegrations(prev => 
      prev.map(integration => 
        integration.name === 'Zapier' 
          ? { ...integration, connected: true }
          : integration
      )
    );

    toast({
      title: "Zapier Connected",
      description: "Zapier integration has been successfully configured.",
    });
    setZapierDialogOpen(false);
    setZapierUrl('');
  };

  const handleAnalyticsConnect = () => {
    if (!analyticsId.trim()) {
      toast({
        title: "Error",
        description: "Please enter your Google Analytics tracking ID",
        variant: "destructive",
      });
      return;
    }

    setIntegrations(prev => 
      prev.map(integration => 
        integration.name === 'Google Analytics' 
          ? { ...integration, connected: true }
          : integration
      )
    );

    toast({
      title: "Google Analytics Connected",
      description: "Google Analytics integration has been successfully configured.",
    });
    setAnalyticsDialogOpen(false);
    setAnalyticsId('');
  };

  const handleAddIntegration = () => {
    toast({
      title: "Add Integration",
      description: "Browse available integrations in the 'Available' tab or contact sales for custom integrations.",
    });
  };

  const handleContactSales = () => {
    toast({
      title: "Contact Sales",
      description: "Redirecting to sales contact form...",
    });
    // In a real app, this would redirect to a contact form or open a chat
  };

  const handleViewApiDocs = () => {
    toast({
      title: "API Documentation",
      description: "Opening API documentation...",
    });
    // In a real app, this would redirect to API docs
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
          <p className="text-muted-foreground">
            Connect ClearQR.io with your favorite tools and platforms
          </p>
        </div>
        <Button onClick={handleAddIntegration}>
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
                      {integration.name === 'Webhooks' && (
                        <Dialog open={webhookDialogOpen} onOpenChange={setWebhookDialogOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Settings className="h-4 w-4 mr-2" />
                              Configure
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Configure Webhook</DialogTitle>
                              <DialogDescription>
                                Enter your webhook URL to receive real-time notifications.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="webhook-url">Webhook URL</Label>
                                <Input
                                  id="webhook-url"
                                  value={webhookUrl}
                                  onChange={(e) => setWebhookUrl(e.target.value)}
                                  placeholder="https://your-server.com/webhook"
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button onClick={handleWebhookConfigure}>Save Configuration</Button>
                                <Button variant="outline" onClick={() => setWebhookDialogOpen(false)}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                      {integration.name !== 'Webhooks' && (
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleDisconnect(integration.name)}
                      >
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
                <Button onClick={() => document.querySelector('[value="available"]')?.click()}>
                  Browse Available Integrations
                </Button>
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
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleConnect(integration.name)}
                    disabled={isConnecting === integration.name}
                  >
                    {isConnecting === integration.name ? 'Connecting...' : 'Connect'}
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
                    disabled={integration.status === 'Coming Soon' || isConnecting === integration.name}
                    className="w-full"
                    onClick={() => integration.connected ? 
                      handleDisconnect(integration.name) : 
                      handleConnect(integration.name)
                    }
                  >
                    {isConnecting === integration.name ? 'Connecting...' :
                     integration.connected ? 'Disconnect' : 
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
            <Button onClick={handleContactSales}>
              Contact Sales
            </Button>
            <Button variant="outline" onClick={handleViewApiDocs}>
              <ExternalLink className="h-4 w-4 mr-2" />
              View API Docs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Zapier Connection Dialog */}
      <Dialog open={zapierDialogOpen} onOpenChange={setZapierDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect Zapier</DialogTitle>
            <DialogDescription>
              Enter your Zapier webhook URL to connect with thousands of apps.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="zapier-url">Zapier Webhook URL</Label>
              <Input
                id="zapier-url"
                value={zapierUrl}
                onChange={(e) => setZapierUrl(e.target.value)}
                placeholder="https://hooks.zapier.com/hooks/catch/..."
              />
            </div>
            <div className="text-sm text-gray-600">
              <p>To get your webhook URL:</p>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Create a new Zap in Zapier</li>
                <li>Choose "Webhooks by Zapier" as the trigger</li>
                <li>Select "Catch Hook" and copy the webhook URL</li>
              </ol>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleZapierConnect}>Connect Zapier</Button>
              <Button variant="outline" onClick={() => setZapierDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Google Analytics Connection Dialog */}
      <Dialog open={analyticsDialogOpen} onOpenChange={setAnalyticsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect Google Analytics</DialogTitle>
            <DialogDescription>
              Enter your Google Analytics tracking ID to track QR code performance.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="analytics-id">Google Analytics Tracking ID</Label>
              <Input
                id="analytics-id"
                value={analyticsId}
                onChange={(e) => setAnalyticsId(e.target.value)}
                placeholder="GA-XXXXXXXXX-X or G-XXXXXXXXXX"
              />
            </div>
            <div className="text-sm text-gray-600">
              <p>Find your tracking ID in Google Analytics:</p>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Go to Admin → Property Settings</li>
                <li>Copy the Tracking ID or Measurement ID</li>
              </ol>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAnalyticsConnect}>Connect Analytics</Button>
              <Button variant="outline" onClick={() => setAnalyticsDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
