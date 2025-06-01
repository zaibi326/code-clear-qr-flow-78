
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Megaphone, Target, BarChart3, Users, Zap, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Marketing = () => {
  const features = [
    {
      icon: Target,
      title: 'Campaign Targeting',
      description: 'Create targeted QR campaigns for specific demographics and locations'
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Track engagement, conversion rates, and ROI in real-time'
    },
    {
      icon: Users,
      title: 'Audience Insights',
      description: 'Understand your audience behavior and preferences'
    },
    {
      icon: Zap,
      title: 'A/B Testing',
      description: 'Test different QR designs and destinations for optimal results'
    }
  ];

  const useCases = [
    'Print advertising campaigns',
    'Product packaging',
    'Event marketing',
    'Social media integration',
    'Email marketing',
    'Direct mail campaigns',
    'Outdoor advertising',
    'In-store promotions'
  ];

  const results = [
    { metric: '300%', description: 'Increase in engagement rates' },
    { metric: '150%', description: 'Higher conversion rates' },
    { metric: '60%', description: 'Reduction in marketing costs' },
    { metric: '24/7', description: 'Real-time campaign monitoring' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <Megaphone className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Marketing Solutions</h1>
          </div>
          <p className="text-xl text-gray-600">Transform your marketing campaigns with intelligent QR codes that track, analyze, and optimize performance</p>
        </div>

        {/* Hero Section */}
        <Card className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50 border-0">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Bridge Digital and Physical Marketing</h2>
                <p className="text-gray-600 mb-6">
                  Connect your offline campaigns to digital experiences with QR codes that provide 
                  detailed analytics and insights into customer behavior.
                </p>
                <div className="flex gap-4">
                  <Button size="lg">Start Free Trial</Button>
                  <Button size="lg" variant="outline">View Demo</Button>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Campaign Performance</span>
                    <Badge>Live</Badge>
                  </div>
                  <div className="space-y-3">
                    {results.map((result, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-gray-600">{result.description}</span>
                        <span className="font-bold text-blue-600">{result.metric}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-8">Powerful Marketing Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Use Cases */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Use Cases</CardTitle>
              <CardDescription>
                Discover how QR codes can enhance your marketing strategy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {useCases.map((useCase, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{useCase}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Case Study: Retail Campaign</CardTitle>
              <CardDescription>
                Fashion retailer increases engagement by 300%
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  A major fashion retailer used ClearQR.io to connect print ads to 
                  personalized landing pages, resulting in unprecedented engagement rates.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">300%</div>
                      <div className="text-xs text-gray-600">Engagement Increase</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">45%</div>
                      <div className="text-xs text-gray-600">Conversion Rate</div>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">Read Full Case Study</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Marketing?</h3>
            <p className="mb-6 opacity-90">
              Join thousands of marketers who are already using ClearQR.io to drive better results
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" variant="secondary">Get Started Free</Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Schedule Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Marketing;
