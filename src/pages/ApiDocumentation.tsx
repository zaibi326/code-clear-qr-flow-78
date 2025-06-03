
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Code, Database, Key, Globe, ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const ApiDocumentation = () => {
  const endpoints = [
    {
      method: 'POST',
      endpoint: '/api/qr/generate',
      description: 'Generate a new QR code',
      parameters: ['url', 'type', 'customization']
    },
    {
      method: 'GET',
      endpoint: '/api/qr/{id}',
      description: 'Retrieve QR code details',
      parameters: ['id']
    },
    {
      method: 'PUT',
      endpoint: '/api/qr/{id}',
      description: 'Update QR code destination',
      parameters: ['id', 'url', 'enabled']
    },
    {
      method: 'GET',
      endpoint: '/api/analytics/{id}',
      description: 'Get QR code analytics',
      parameters: ['id', 'date_range']
    }
  ];

  const handleGetApiKey = () => {
    toast.success('Redirecting to API key generation...');
    // In a real app, this would redirect to the API key generation page
    window.open('/settings', '_blank');
  };

  const handleViewExamples = () => {
    toast.success('Opening code examples...');
    // In a real app, this would open a documentation page with examples
    window.open('/help-center', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">API Documentation</h1>
          <p className="text-xl text-gray-600">Integrate ClearQR.io into your applications with our powerful API</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Authentication
                </CardTitle>
                <CardDescription>
                  All API requests require authentication using API keys
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                  <p>curl -H "Authorization: Bearer YOUR_API_KEY"</p>
                  <p>     -H "Content-Type: application/json"</p>
                  <p>     https://api.clearqr.io/v1/</p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  API Endpoints
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {endpoints.map((endpoint, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={endpoint.method === 'GET' ? 'secondary' : 'default'}>
                          {endpoint.method}
                        </Badge>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {endpoint.endpoint}
                        </code>
                      </div>
                      <p className="text-gray-600 mb-2">{endpoint.description}</p>
                      <div className="text-sm text-gray-500">
                        Parameters: {endpoint.parameters.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Quick Start
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    className="w-full" 
                    onClick={handleGetApiKey}
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Get API Key
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleViewExamples}
                  >
                    <Code className="h-4 w-4 mr-2" />
                    View Examples
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Rate Limits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Free Plan:</span>
                    <span>100 req/hour</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pro Plan:</span>
                    <span>1,000 req/hour</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Enterprise:</span>
                    <span>Unlimited</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocumentation;
