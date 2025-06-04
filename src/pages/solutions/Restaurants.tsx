
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  ShoppingCart, 
  Star, 
  Wifi, 
  Clock, 
  Users,
  Smartphone,
  DollarSign
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';

const Restaurants = () => {
  const features = [
    {
      icon: Menu,
      title: 'Digital Menus',
      description: 'Replace physical menus with QR codes that link to digital menus customers can view on their phones.'
    },
    {
      icon: ShoppingCart,
      title: 'Contactless Ordering',
      description: 'Enable customers to order and pay directly from their phones without staff interaction.'
    },
    {
      icon: Star,
      title: 'Review Collection',
      description: 'Easily collect customer reviews and feedback to improve your restaurant\'s reputation.'
    },
    {
      icon: Wifi,
      title: 'WiFi Sharing',
      description: 'Share WiFi credentials instantly with QR codes, enhancing customer experience.'
    },
    {
      icon: Clock,
      title: 'Table Management',
      description: 'Optimize table turnover with QR codes for reservations and waitlist management.'
    },
    {
      icon: Users,
      title: 'Loyalty Programs',
      description: 'Implement loyalty programs and promotions through QR code campaigns.'
    }
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: 'Reduce Costs',
      description: 'Save on printing costs and reduce staff workload with digital solutions.',
      stat: '30% Cost Reduction'
    },
    {
      icon: Clock,
      title: 'Faster Service',
      description: 'Speed up ordering and service with streamlined digital processes.',
      stat: '50% Faster Orders'
    },
    {
      icon: Smartphone,
      title: 'Better Experience',
      description: 'Provide modern, contactless dining experience customers expect.',
      stat: '95% Satisfaction'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Badge className="mb-4 bg-white/20 text-white">Restaurant Solutions</Badge>
            <h1 className="text-4xl font-bold mb-4">
              Transform Your Restaurant with QR Codes
            </h1>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto mb-8">
              Create contactless dining experiences that customers love while reducing costs and improving efficiency
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                <Link to="/register">Start Free Trial</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-orange-600">
                <Link to="/quick-generate">Create Menu QR</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Complete Restaurant QR Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to modernize your restaurant operations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-orange-600" />
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

      {/* Benefits Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Restaurants Choose QR Codes
            </h2>
            <p className="text-xl text-gray-600">
              Real benefits that impact your bottom line
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-8 w-8 text-orange-600" />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{benefit.description}</p>
                  <div className="text-2xl font-bold text-orange-600">{benefit.stat}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Get Started in Minutes
            </h2>
            <p className="text-xl text-gray-600">
              Simple setup process for immediate results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Upload Menu</h3>
              <p className="text-gray-600">Upload your menu or create a digital version</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Generate QR</h3>
              <p className="text-gray-600">Create branded QR codes for your tables</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Print & Place</h3>
              <p className="text-gray-600">Print QR codes and place them on tables</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Track Results</h3>
              <p className="text-gray-600">Monitor usage and customer engagement</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="bg-gray-50 p-8 rounded-lg">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-xl text-gray-700 mb-4">
              "QR codes have completely transformed our restaurant. We've reduced menu printing costs by 90% and our customers love the contactless experience. Order accuracy has improved significantly."
            </blockquote>
            <cite className="text-gray-600">
              - Maria Rodriguez, Owner of Bistro Del Sol
            </cite>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Modernize Your Restaurant?</h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Join thousands of restaurants using QR codes for better customer experiences
          </p>
          <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
            <Link to="/register">Start Your Free Trial</Link>
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Restaurants;
