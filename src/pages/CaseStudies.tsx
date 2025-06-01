
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, Users, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const CaseStudies = () => {
  const caseStudies = [
    {
      id: 1,
      title: 'TechCorp Increases Event Engagement by 300%',
      excerpt: 'How TechCorp used dynamic QR codes to revolutionize their conference experience and boost attendee engagement.',
      industry: 'Technology',
      metric: '300% increase',
      metricLabel: 'Engagement',
      featured: true
    },
    {
      id: 2,
      title: 'Bistro Moderne Reduces Costs by 90%',
      excerpt: 'Digital menu implementation that transformed customer experience while dramatically reducing printing costs.',
      industry: 'Restaurant',
      metric: '90% reduction',
      metricLabel: 'Printing Costs',
      featured: false
    },
    {
      id: 3,
      title: 'EventPro Streamlines Check-ins for 10,000+ Attendees',
      excerpt: 'Large-scale event management made simple with bulk QR code generation and real-time tracking.',
      industry: 'Events',
      metric: '10,000+',
      metricLabel: 'Attendees',
      featured: false
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h1>
          <p className="text-xl text-gray-600">Real businesses achieving real results with ClearQR.io</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caseStudies.map((study) => (
            <Card key={study.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600"></div>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{study.industry}</Badge>
                  {study.featured && <Badge>Featured</Badge>}
                </div>
                <CardTitle className="text-lg">{study.title}</CardTitle>
                <CardDescription>{study.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{study.metric}</div>
                    <div className="text-sm text-gray-600">{study.metricLabel}</div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
                <Button className="w-full" variant="outline">
                  Read Case Study
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CaseStudies;
