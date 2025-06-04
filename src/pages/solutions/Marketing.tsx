
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  TrendingUp, 
  Users, 
  Share2, 
  BarChart3, 
  Megaphone,
  Globe,
  Smartphone
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';

const Marketing = () => {
  const benefits = [
    {
      icon: Target,
      title: 'Targeted Campaigns',
      description: 'Create personalized QR code campaigns that deliver the right message to the right audience at the right time.'
    },
    {
      icon: TrendingUp,
      title: 'Boost Engagement',
      description: 'Increase customer engagement with interactive QR codes that bridge offline and online experiences.'
    },
    {
      icon: Users,
      title: 'Customer Insights',
      description: 'Gain valuable insights into customer behavior and preferences through detailed scan analytics.'
    },
    {
      icon: Share2,
      title: 'Social Integration',
      description: 'Seamlessly integrate with social media platforms to amplify your marketing reach.'
    }
  ];

  const useCases = [
    {
      title: 'Print Advertising',
      description: 'Add QR codes to flyers, posters, and magazine ads to drive traffic to landing pages.',
      image: '/lovable-uploads/02a40581-58f3-4a8f-9289-addc9f13cab0.png'
    },
    {
      title: 'Product Packaging',
      description: 'Include QR codes on packaging for product information, reviews, and promotions.',
      image: '/lovable-uploads/5a18dce6-2917-4c31-af16-17e4c3ac2cf1.png'
    },
    {
      title: 'Event Marketing',
      description: 'Use QR codes for event check-ins, schedules, and attendee networking.',
      image: '/lovable-uploads/7044a335-27b6-407a-8043-23c1c5995404.png'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Badge className="mb-4 bg-white/20 text-white">Marketing Solutions</Badge>
            <h1 className="text-4xl font-bold mb-4">
              Supercharge Your Marketing with QR Codes
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Transform your marketing campaigns with dynamic QR codes that connect offline and online experiences
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Link to="/register">Start Free Trial</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Link to="/quick-generate">Try QR Generator</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose QR Codes for Marketing?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            QR codes provide a seamless bridge between your physical and digital marketing efforts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Marketing Use Cases
            </h2>
            <p className="text-xl text-gray-600">
              Discover how businesses use QR codes to enhance their marketing
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200">
                  <img 
                    src={useCase.image} 
                    alt={useCase.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{useCase.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{useCase.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">85%</div>
              <div className="text-gray-300">Increase in engagement</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">3x</div>
              <div className="text-gray-300">Higher conversion rates</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">60%</div>
              <div className="text-gray-300">Reduction in print costs</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-400 mb-2">24/7</div>
              <div className="text-gray-300">Campaign tracking</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Marketing?</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of marketers using QR codes to create engaging campaigns
          </p>
          <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-100">
            <Link to="/register">Get Started Today</Link>
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Marketing;
