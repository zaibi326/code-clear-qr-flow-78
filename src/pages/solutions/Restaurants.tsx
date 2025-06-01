
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UtensilsCrossed, Smartphone, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Restaurants = () => {
  const benefits = [
    {
      icon: Smartphone,
      title: 'Contactless Menus',
      description: 'Digital menus accessible via QR codes - update instantly, no reprinting needed'
    },
    {
      icon: Clock,
      title: 'Faster Service',
      description: 'Reduce wait times with instant menu access and streamlined ordering'
    },
    {
      icon: Star,
      title: 'Enhanced Safety',
      description: 'Minimize physical contact while maintaining excellent customer experience'
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
          <div className="flex items-center gap-3 mb-4">
            <UtensilsCrossed className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Restaurant Solutions</h1>
          </div>
          <p className="text-xl text-gray-600">Revolutionize your restaurant experience with contactless QR code menus and ordering systems</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <Card key={index}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Go Digital?</h3>
            <p className="mb-6">Join thousands of restaurants already using QR code solutions</p>
            <Button size="lg" variant="secondary">Get Started</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Restaurants;
