
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  QrCode, 
  BarChart3, 
  Palette, 
  Shield, 
  Zap, 
  Globe, 
  Users, 
  Download,
  Smartphone,
  Monitor,
  Target,
  Link2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';

const Features = () => {
  const features = [
    {
      icon: QrCode,
      title: 'Dynamic QR Codes',
      description: 'Create QR codes that can be updated after printing without changing the code itself.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Track scans, user behavior, and campaign performance with detailed insights.',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Palette,
      title: 'Custom Design',
      description: 'Customize colors, add logos, and create branded QR codes that match your style.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level security with SSL encryption and secure data handling.',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      icon: Zap,
      title: 'Bulk Generation',
      description: 'Generate thousands of QR codes at once with CSV import functionality.',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      icon: Globe,
      title: 'Global CDN',
      description: 'Fast loading times worldwide with our global content delivery network.',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together with team members on campaigns and projects.',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
    {
      icon: Download,
      title: 'Multiple Formats',
      description: 'Download QR codes in PNG, SVG, PDF formats in various resolutions.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      icon: Smartphone,
      title: 'Mobile Optimized',
      description: 'Perfect scanning experience across all mobile devices and platforms.',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50'
    },
    {
      icon: Monitor,
      title: 'Campaign Management',
      description: 'Organize and manage multiple QR code campaigns from one dashboard.',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    },
    {
      icon: Target,
      title: 'Smart Targeting',
      description: 'Show different content based on device, location, or time.',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      icon: Link2,
      title: 'API Integration',
      description: 'Integrate QR code generation into your existing applications.',
      color: 'text-violet-600',
      bgColor: 'bg-violet-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-800">Features</Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for QR Code Success
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to help you create, manage, and track QR codes like a pro
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link to="/register">Get Started Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
              <CardHeader>
                <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses using ClearQR to create powerful QR code campaigns
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link to="/register">Start Free Trial</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link to="/api-documentation">View API Docs</Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Features;
