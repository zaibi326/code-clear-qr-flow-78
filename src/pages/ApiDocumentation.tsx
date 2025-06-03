
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Code, Database, Key, Globe, ArrowLeft, ExternalLink, Smartphone, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const ApiDocumentation = () => {
  const endpoints = [
    {
      method: 'POST',
      endpoint: '/api/qr/generate',
      description: 'Generate a new QR code for mobile apps',
      parameters: ['url', 'type', 'customization', 'app_metadata']
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
      description: 'Get QR code analytics for mobile tracking',
      parameters: ['id', 'date_range', 'device_type']
    },
    {
      method: 'POST',
      endpoint: '/api/mobile/register',
      description: 'Register mobile app for API access',
      parameters: ['app_name', 'package_name', 'platform']
    }
  ];

  const handleGetApiKey = () => {
    toast.success('Redirecting to API key generation...');
    // Navigate to settings with API key section
    window.open('/settings?tab=api', '_blank');
  };

  const handleViewExamples = () => {
    toast.success('Opening mobile SDK examples...');
    // In a real app, this would open mobile-specific documentation
    window.open('/help-center?section=mobile-sdk', '_blank');
  };

  const handleDownloadSDK = () => {
    toast.success('Downloading Android SDK...');
    // Mock download for Android SDK
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'clearqr-android-sdk.zip';
    link.click();
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
          <p className="text-xl text-gray-600">Build APK applications with ClearQR.io's powerful mobile API</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Authentication for Mobile Apps
                </CardTitle>
                <CardDescription>
                  Secure your APK with API key authentication
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Android Implementation</h4>
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                      <p>// Add to your build.gradle</p>
                      <p>implementation 'io.clearqr:android-sdk:1.0.0'</p>
                      <br />
                      <p>// Initialize in your Application class</p>
                      <p>ClearQR.initialize(this, "YOUR_API_KEY");</p>
                      <br />
                      <p>// Generate QR code</p>
                      <p>ClearQR.generateQR(url, callback);</p>
                    </div>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 mb-2">🔐 Security Best Practices</h4>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      <li>• Store API keys in BuildConfig or encrypted preferences</li>
                      <li>• Use ProGuard to obfuscate your API key</li>
                      <li>• Implement certificate pinning for production apps</li>
                      <li>• Rotate API keys regularly for security</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Mobile API Endpoints
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
                  <Smartphone className="h-5 w-5" />
                  Mobile Development
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
                    View SDK Examples
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleDownloadSDK}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Android SDK
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
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

            <Card>
              <CardHeader>
                <CardTitle>APK Integration Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Step 1: Get API Key</h4>
                    <p className="text-gray-600">Generate your API key from the settings page</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Step 2: Add SDK</h4>
                    <p className="text-gray-600">Include our Android SDK in your project</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Step 3: Initialize</h4>
                    <p className="text-gray-600">Configure the SDK with your API key</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Step 4: Generate QR</h4>
                    <p className="text-gray-600">Start generating QR codes in your app</p>
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
