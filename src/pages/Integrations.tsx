
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Database, 
  Mail, 
  MessageSquare, 
  BarChart3, 
  CreditCard,
  Calendar,
  Users,
  Webhook,
  Api
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';

const Integrations = () => {
  const integrations = [
    {
      name: 'Zapier',
      description: 'Connect with 5,000+ apps to automate your QR code workflows',
      icon: Zap,
      category: 'Automation',
      status: 'Available',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      name: 'Google Analytics',
      description: 'Track QR code performance with detailed analytics and insights',
      icon: BarChart3,
      category: 'Analytics',
      status: 'Available',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Mailchimp',
      description: 'Integrate QR codes into your email marketing campaigns',
      icon: Mail,
      category: 'Marketing',
      status: 'Available',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      name: 'Slack',
      description: 'Get real-time notifications about QR code scans and campaigns',
      icon: MessageSquare,
      category: 'Communication',
      status: 'Available',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      name: 'Stripe',
      description: 'Accept payments through QR codes with secure payment processing',
      icon: CreditCard,
      category: 'Payments',
      status: 'Available',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      name: 'Salesforce',
      description: 'Sync QR code data with your CRM for better customer insights',
      icon: Database,
      category: 'CRM',
      status: 'Available',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Calendly',
      description: 'Enable appointment booking through QR codes',
      icon: Calendar,
      category: 'Scheduling',
      status: 'Available',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: 'HubSpot',
      description: 'Integrate QR codes with your marketing automation platform',
      icon: Users,
      category: 'Marketing',
      status: 'Available',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      name: 'Webhooks',
      description: 'Real-time data sync with custom webhook integrations',
      icon: Webhook,
      category: 'Developer',
      status: 'Available',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    },
    {
      name: 'REST API',
      description: 'Full API access for custom integrations and development',
      icon: Api,
      category: 'Developer',
      status: 'Available',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  const categories = ['All', 'Automation', 'Analytics', 'Marketing', 'Communication', 'Payments', 'CRM', 'Scheduling', 'Developer'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Badge className="mb-4 bg-purple-100 text-purple-800">Integrations</Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Connect with Your Favorite Tools
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Seamlessly integrate ClearQR with the tools you already use to streamline your workflow
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/register">Get Started Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/api-documentation">View API Docs</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {integrations.map((integration, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${integration.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <integration.icon className={`h-6 w-6 ${integration.color}`} />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {integration.status}
                  </Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                  {integration.name}
                </CardTitle>
                <Badge variant="outline" className="w-fit">
                  {integration.category}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{integration.description}</p>
                <Button variant="outline" size="sm" className="w-full group-hover:bg-blue-50 group-hover:border-blue-300 transition-colors">
                  Connect
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* API Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful API for Developers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Build custom integrations with our comprehensive REST API
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">What You Can Build</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Automated QR Generation</h4>
                    <p className="text-gray-600">Generate QR codes programmatically in your applications</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Real-time Analytics</h4>
                    <p className="text-gray-600">Access scan data and analytics in real-time</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Webhook className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Webhook Notifications</h4>
                    <p className="text-gray-600">Get instant notifications when QR codes are scanned</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Database className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Data Management</h4>
                    <p className="text-gray-600">Manage QR codes and campaigns programmatically</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-900 p-8 rounded-lg">
              <h4 className="text-white font-semibold mb-4">Quick Example</h4>
              <pre className="text-green-400 text-sm overflow-x-auto">
                <code>{`curl -X POST https://api.clearqr.io/v1/qr \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": "https://example.com",
    "type": "url",
    "customization": {
      "color": "#1f2937",
      "logo": "https://example.com/logo.png"
    }
  }'`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Integrations?</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Built for scale, security, and simplicity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Setup</h3>
              <p className="text-blue-100">Connect your tools in minutes with our simple setup process</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Reliable Sync</h3>
              <p className="text-blue-100">99.9% uptime ensures your data is always in sync</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Expert Support</h3>
              <p className="text-blue-100">Dedicated support team to help with custom integrations</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Connect?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Start integrating ClearQR with your favorite tools today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/register">Get Started Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/support">Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Integrations;
