
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingBag, 
  Tag, 
  Gift, 
  CreditCard, 
  Truck, 
  Star,
  Smartphone,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';

const Retail = () => {
  const solutions = [
    {
      icon: ShoppingBag,
      title: 'Product Information',
      description: 'Provide detailed product specs, reviews, and videos with a simple scan.'
    },
    {
      icon: Tag,
      title: 'Price Comparisons',
      description: 'Enable customers to compare prices and find the best deals instantly.'
    },
    {
      icon: Gift,
      title: 'Loyalty Programs',
      description: 'Implement digital loyalty cards and reward programs through QR codes.'
    },
    {
      icon: CreditCard,
      title: 'Mobile Payments',
      description: 'Accept payments quickly and securely with QR code payment systems.'
    },
    {
      icon: Truck,
      title: 'Inventory Tracking',
      description: 'Streamline inventory management with QR code tracking systems.'
    },
    {
      icon: Star,
      title: 'Customer Reviews',
      description: 'Collect authentic customer reviews to build trust and improve products.'
    }
  ];

  const useCases = [
    {
      title: 'In-Store Experience',
      description: 'Enhance shopping with product info, promotions, and digital assistance.',
      icon: ShoppingBag,
      stats: ['40% more engagement', '25% higher sales']
    },
    {
      title: 'Omnichannel Integration',
      description: 'Connect physical and digital shopping experiences seamlessly.',
      icon: Smartphone,
      stats: ['60% better customer journey', '35% more conversions']
    },
    {
      title: 'Analytics & Insights',
      description: 'Track customer behavior and optimize store layout and inventory.',
      icon: BarChart3,
      stats: ['Real-time insights', '30% better decisions']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Badge className="mb-4 bg-white/20 text-white">Retail Solutions</Badge>
            <h1 className="text-4xl font-bold mb-4">
              Revolutionize Retail with QR Codes
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
              Bridge the gap between physical and digital retail to create exceptional shopping experiences
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                <Link to="/register">Start Free Trial</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-green-600">
                <Link to="/quick-generate">Create Product QR</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Solutions Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Complete Retail QR Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform every aspect of your retail business with intelligent QR code solutions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <solution.icon className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">{solution.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{solution.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Use Cases */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Retail Use Cases
            </h2>
            <p className="text-xl text-gray-600">
              See how retailers are using QR codes to drive growth
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <useCase.icon className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-xl text-center">{useCase.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">{useCase.description}</p>
                  <div className="space-y-2">
                    {useCase.stats.map((stat, statIndex) => (
                      <div key={statIndex} className="bg-green-50 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {stat}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Retail Success Stories
              </h2>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">Fashion Retailer</h3>
                  <p className="text-gray-600 mb-2">Increased customer engagement by 65% with product info QR codes</p>
                  <div className="text-green-600 font-medium">+65% Engagement</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">Electronics Store</h3>
                  <p className="text-gray-600 mb-2">Reduced checkout time by 40% with QR payment integration</p>
                  <div className="text-blue-600 font-medium">-40% Checkout Time</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">Home Goods Chain</h3>
                  <p className="text-gray-600 mb-2">Improved inventory accuracy by 85% with QR tracking</p>
                  <div className="text-purple-600 font-medium">+85% Accuracy</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Industry Impact</h3>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">73%</div>
                  <div className="text-gray-600">of shoppers prefer QR code product info</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">45%</div>
                  <div className="text-gray-600">increase in mobile commerce with QR codes</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">82%</div>
                  <div className="text-gray-600">of retailers plan to expand QR usage</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Implementation Guide */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Getting Started is Easy
            </h2>
            <p className="text-xl text-gray-600">
              Implement QR codes in your retail business in just a few steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Plan Your Strategy</h3>
              <p className="text-gray-600">Identify where QR codes will add the most value in your store</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Create & Deploy</h3>
              <p className="text-gray-600">Generate QR codes and place them strategically throughout your store</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Measure & Optimize</h3>
              <p className="text-gray-600">Track performance and optimize placement for maximum impact</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Transform Your Retail Experience Today</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join leading retailers using QR codes to create exceptional customer experiences
          </p>
          <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-100">
            <Link to="/register">Start Your Retail Revolution</Link>
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Retail;
