
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Users, Target, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const values = [
    {
      icon: Users,
      title: 'Customer First',
      description: 'We prioritize our customers needs and success above all else'
    },
    {
      icon: Target,
      title: 'Innovation',
      description: 'Constantly pushing the boundaries of what QR technology can achieve'
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'Making QR technology accessible and useful worldwide'
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About ClearQR.io</h1>
          <p className="text-xl text-gray-600">Empowering businesses worldwide with intelligent QR code solutions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              To bridge the gap between physical and digital experiences through innovative 
              QR code technology that drives real business results.
            </p>
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-600">
              Founded in 2020, ClearQR.io started with a simple idea: QR codes should be 
              more than just black and white squares. They should be powerful tools that 
              connect businesses with their customers in meaningful ways.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-8">
            <h3 className="text-xl font-bold mb-4">By the Numbers</h3>
            <div className="space-y-4">
              <div>
                <div className="text-3xl font-bold text-blue-600">50,000+</div>
                <div className="text-gray-600">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">5M+</div>
                <div className="text-gray-600">QR Codes Generated</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">150+</div>
                <div className="text-gray-600">Countries Served</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-8">Our Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold mb-2">{value.title}</h4>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
