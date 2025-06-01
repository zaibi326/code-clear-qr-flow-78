
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const BestPractices = () => {
  const practices = [
    {
      category: 'Design',
      title: 'QR Code Design Guidelines',
      description: 'Essential design principles for creating scannable and branded QR codes',
      tips: ['Maintain sufficient contrast', 'Add your logo properly', 'Test scan distance']
    },
    {
      category: 'Placement',
      title: 'Strategic QR Code Placement',
      description: 'Where and how to place QR codes for maximum scan rates',
      tips: ['Eye-level positioning', 'Good lighting areas', 'Clear call-to-action']
    },
    {
      category: 'Analytics',
      title: 'Tracking and Optimization',
      description: 'How to measure success and optimize your QR code campaigns',
      tips: ['Monitor scan rates', 'Track conversion funnel', 'A/B test designs']
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">QR Code Best Practices</h1>
          <p className="text-xl text-gray-600">Expert tips and guidelines for maximizing your QR code success</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {practices.map((practice, index) => (
            <Card key={index}>
              <CardHeader>
                <Badge className="w-fit mb-2">{practice.category}</Badge>
                <CardTitle>{practice.title}</CardTitle>
                <CardDescription>{practice.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {practice.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestPractices;
