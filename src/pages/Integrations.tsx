
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Zap, Globe, Database, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Integrations = () => {
  const integrations = [
    {
      name: 'Zapier',
      icon: Zap,
      description: 'Connect with 5,000+ apps through Zapier automation',
      category: 'Automation',
      status: 'Available'
    },
    {
      name: 'Webhooks',
      icon: Globe,
      description: 'Real-time notifications for QR code scans and events',
      category: 'Developer',
      status: 'Available'
    },
    {
      name: 'Google Analytics',
      icon: Database,
      description: 'Track QR code performance in your analytics dashboard',
      category: 'Analytics',
      status: 'Available'
    },
    {
      name: 'Mailchimp',
      icon: Mail,
      description: 'Add QR code scanners to your email marketing lists',
      category: 'Marketing',
      status: 'Coming Soon'
    }
  ];

  const useCases = [
    {
      title: 'Marketing Automation',
      description: 'Trigger email campaigns when QR codes are scanned',
      integrations: ['Zapier', 'Mailchimp', 'HubSpot']
    },
    {
      title: 'E-commerce',
      description: 'Add customers to your store when they scan product QR codes',
      integrations: ['Shopify', 'WooCommerce', 'BigCommerce']
    },
    {
      title: 'Event Management',
      description: 'Track attendee check-ins and engagement',
      integrations: ['Eventbrite', 'Zoom', 'Google Calendar']
    },
    {
      title: 'Customer Support',
      description: 'Create support tickets from QR code interactions',
      integrations: ['Zendesk', 'Intercom', 'Freshdesk']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Integrations</h1>
          <p className="text-xl text-gray-600">Connect ClearQR.io with your favorite tools and platforms</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Integrations</h2>
            <div className="space-y-4">
              {integrations.map((integration, index) => (
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
                      <Badge variant={integration.status === 'Available' ? 'default' : 'secondary'}>
                        {integration.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-4">{integration.description}</p>
                    <Button size="sm" variant={integration.status === 'Available' ? 'default' : 'outline'}>
                      {integration.status === 'Available' ? 'Connect' : 'Coming Soon'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Use Cases</h2>
            <div className="space-y-4">
              {useCases.map((useCase, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{useCase.title}</CardTitle>
                    <CardDescription>{useCase.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {useCase.integrations.map((integration, idx) => (
                        <Badge key={idx} variant="outline">
                          {integration}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Need a Custom Integration?</CardTitle>
            <CardDescription>
              Our team can help you build custom integrations for your specific needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button asChild>
                <Link to="/support">Contact Sales</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/api-documentation">View API Docs</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Integrations;
