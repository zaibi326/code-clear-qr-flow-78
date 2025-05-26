
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Target, Users, Clock, MapPin } from 'lucide-react';

export function CampaignInsights() {
  const insights = [
    {
      title: 'Peak Scanning Hours',
      description: 'Most QR codes are scanned between 2-4 PM',
      icon: Clock,
      value: '2-4 PM',
      trend: '+15%',
      trendDirection: 'up' as const,
      color: 'text-blue-600'
    },
    {
      title: 'Top Performing Location',
      description: 'New York generates 35% of all scans',
      icon: MapPin,
      value: 'New York',
      trend: '+8%',
      trendDirection: 'up' as const,
      color: 'text-green-600'
    },
    {
      title: 'Conversion Rate',
      description: 'Users completing desired actions',
      icon: Target,
      value: '4.7%',
      trend: '-2%',
      trendDirection: 'down' as const,
      color: 'text-purple-600'
    },
    {
      title: 'Average Session Duration',
      description: 'Time spent after QR scan',
      icon: Users,
      value: '2m 34s',
      trend: '+12%',
      trendDirection: 'up' as const,
      color: 'text-orange-600'
    }
  ];

  const campaignPerformance = [
    { name: 'Summer Sale', scans: 2547, conversions: 127, rate: 4.9, trend: 'up' },
    { name: 'Product Launch', scans: 1876, conversions: 89, rate: 4.7, trend: 'up' },
    { name: 'Holiday Promo', scans: 1654, conversions: 71, rate: 4.3, trend: 'down' },
    { name: 'Brand Awareness', scans: 987, conversions: 38, rate: 3.8, trend: 'down' }
  ];

  const recommendations = [
    {
      type: 'optimization',
      title: 'Optimize for Mobile',
      description: '78% of scans come from mobile devices. Consider mobile-first design.',
      priority: 'high'
    },
    {
      type: 'timing',
      title: 'Schedule Content Updates',
      description: 'Post new content during peak hours (2-4 PM) for maximum engagement.',
      priority: 'medium'
    },
    {
      type: 'location',
      title: 'Expand to Los Angeles',
      description: 'Similar demographics to NYC with untapped potential.',
      priority: 'low'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((insight) => (
          <Card key={insight.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <insight.icon className={`h-8 w-8 ${insight.color}`} />
                <div className="flex items-center gap-1 text-sm">
                  {insight.trendDirection === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={insight.trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}>
                    {insight.trend}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{insight.value}</h3>
                <p className="text-sm font-medium text-gray-900">{insight.title}</p>
                <p className="text-xs text-gray-600">{insight.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Campaign Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance Breakdown</CardTitle>
          <CardDescription>Detailed performance metrics for your active campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaignPerformance.map((campaign) => (
              <div key={campaign.name} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">{campaign.name}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant={campaign.trend === 'up' ? 'default' : 'secondary'}>
                      {campaign.rate}% conversion
                    </Badge>
                    {campaign.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Total Scans</p>
                    <p className="font-semibold text-lg">{campaign.scans.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Conversions</p>
                    <p className="font-semibold text-lg">{campaign.conversions}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Progress</p>
                    <Progress value={campaign.rate * 20} className="mt-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Recommendations</CardTitle>
          <CardDescription>Actionable insights to improve your campaign performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-3 ${
                  rec.priority === 'high' ? 'bg-red-500' : 
                  rec.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{rec.title}</h4>
                    <Badge variant="outline" className={
                      rec.priority === 'high' ? 'text-red-600 border-red-200' : 
                      rec.priority === 'medium' ? 'text-yellow-600 border-yellow-200' : 'text-green-600 border-green-200'
                    }>
                      {rec.priority} priority
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{rec.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
