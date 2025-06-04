
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, Copy, ExternalLink, Key, Book, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';

const ApiDocumentation = () => {
  const apiEndpoints = [
    {
      method: 'POST',
      endpoint: '/api/qr/create',
      description: 'Create a new QR code',
      params: ['content', 'type', 'color', 'logo']
    },
    {
      method: 'GET',
      endpoint: '/api/qr/{id}',
      description: 'Get QR code details',
      params: ['id']
    },
    {
      method: 'PUT',
      endpoint: '/api/qr/{id}',
      description: 'Update QR code',
      params: ['id', 'content', 'color']
    },
    {
      method: 'DELETE',
      endpoint: '/api/qr/{id}',
      description: 'Delete QR code',
      params: ['id']
    },
    {
      method: 'GET',
      endpoint: '/api/analytics/{id}',
      description: 'Get QR code analytics',
      params: ['id', 'timeframe']
    }
  ];

  const codeExamples = {
    javascript: `// Create QR Code
fetch('https://api.clearqr.io/v1/qr/create', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    content: 'https://example.com',
    type: 'url',
    color: '#000000'
  })
})
.then(response => response.json())
.then(data => console.log(data));`,
    python: `import requests

# Create QR Code
response = requests.post(
    'https://api.clearqr.io/v1/qr/create',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    json={
        'content': 'https://example.com',
        'type': 'url',
        'color': '#000000'
    }
)
print(response.json())`,
    curl: `curl -X POST https://api.clearqr.io/v1/qr/create \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": "https://example.com",
    "type": "url",
    "color": "#000000"
  }'`
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">API Documentation</h1>
              <p className="text-gray-600 mt-2">Complete guide to integrate ClearQR API into your applications</p>
            </div>
            <Button asChild>
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <a href="#getting-started" className="block p-2 rounded hover:bg-gray-100 transition-colors">
                  Getting Started
                </a>
                <a href="#authentication" className="block p-2 rounded hover:bg-gray-100 transition-colors">
                  Authentication
                </a>
                <a href="#endpoints" className="block p-2 rounded hover:bg-gray-100 transition-colors">
                  API Endpoints
                </a>
                <a href="#examples" className="block p-2 rounded hover:bg-gray-100 transition-colors">
                  Code Examples
                </a>
                <a href="#rate-limits" className="block p-2 rounded hover:bg-gray-100 transition-colors">
                  Rate Limits
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Getting Started */}
            <Card id="getting-started">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5 text-blue-600" />
                  Getting Started
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  The ClearQR API allows you to programmatically create, manage, and track QR codes. 
                  Get started by obtaining your API key from the dashboard.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Base URL</h4>
                  <code className="text-blue-800">https://api.clearqr.io/v1</code>
                </div>
              </CardContent>
            </Card>

            {/* Authentication */}
            <Card id="authentication">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-green-600" />
                  Authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  All API requests require authentication using your API key in the Authorization header.
                </p>
                <div className="bg-gray-900 p-4 rounded-lg">
                  <code className="text-green-400">
                    Authorization: Bearer YOUR_API_KEY
                  </code>
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Get API Key
                </Button>
              </CardContent>
            </Card>

            {/* API Endpoints */}
            <Card id="endpoints">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  API Endpoints
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiEndpoints.map((endpoint, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center gap-4 mb-2">
                        <Badge variant={endpoint.method === 'GET' ? 'secondary' : 
                                      endpoint.method === 'POST' ? 'default' : 
                                      endpoint.method === 'PUT' ? 'secondary' : 'destructive'}>
                          {endpoint.method}
                        </Badge>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {endpoint.endpoint}
                        </code>
                      </div>
                      <p className="text-gray-600 mb-2">{endpoint.description}</p>
                      <div className="text-sm text-gray-500">
                        Parameters: {endpoint.params.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Code Examples */}
            <Card id="examples">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-orange-600" />
                  Code Examples
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(codeExamples).map(([language, code]) => (
                    <div key={language}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold capitalize">{language}</h4>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Copy className="h-4 w-4" />
                          Copy
                        </Button>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                        <pre className="text-sm text-gray-100">
                          <code>{code}</code>
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Rate Limits */}
            <Card id="rate-limits">
              <CardHeader>
                <CardTitle>Rate Limits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">1,000</div>
                    <div className="text-sm text-gray-600">requests/hour</div>
                    <div className="text-xs text-gray-500 mt-1">Free Plan</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">10,000</div>
                    <div className="text-sm text-gray-600">requests/hour</div>
                    <div className="text-xs text-gray-500 mt-1">Pro Plan</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">Unlimited</div>
                    <div className="text-sm text-gray-600">requests/hour</div>
                    <div className="text-xs text-gray-500 mt-1">Enterprise Plan</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ApiDocumentation;
