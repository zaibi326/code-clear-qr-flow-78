
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Users, 
  Globe, 
  Smartphone,
  Monitor,
  Tablet,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Download
} from 'lucide-react';

const mockData = {
  totalScans: 45623,
  uniqueUsers: 32145,
  conversionRate: 12.8,
  topCountries: [
    { name: 'United States', scans: 15234, percentage: 33.4 },
    { name: 'United Kingdom', scans: 8765, percentage: 19.2 },
    { name: 'Germany', scans: 6543, percentage: 14.3 },
    { name: 'France', scans: 4321, percentage: 9.5 },
    { name: 'Canada', scans: 3210, percentage: 7.0 }
  ],
  deviceBreakdown: {
    mobile: 68.5,
    desktop: 23.8,
    tablet: 7.7
  },
  recentActivity: [
    { time: '2 mins ago', action: 'QR Code scanned', campaign: 'Summer Sale 2024', location: 'New York, US' },
    { time: '5 mins ago', action: 'Campaign created', campaign: 'Product Launch', location: 'London, UK' },
    { time: '8 mins ago', action: 'QR Code scanned', campaign: 'Restaurant Menu', location: 'Paris, FR' },
    { time: '12 mins ago', action: 'QR Code scanned', campaign: 'Event Tickets', location: 'Berlin, DE' },
    { time: '15 mins ago', action: 'Campaign updated', campaign: 'Holiday Promo', location: 'Toronto, CA' }
  ]
};

export function AnalyticsOverview() {
  const [timeFilter, setTimeFilter] = useState('7d');

  const statCards = [
    {
      title: 'Total Scans',
      value: mockData.totalScans.toLocaleString(),
      change: '+23.5%',
      trend: 'up',
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Unique Users',
      value: mockData.uniqueUsers.toLocaleString(),
      change: '+18.2%',
      trend: 'up',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Conversion Rate',
      value: `${mockData.conversionRate}%`,
      change: '-2.1%',
      trend: 'down',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Global Reach',
      value: '45 Countries',
      change: '+3 new',
      trend: 'up',
      icon: Globe,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Overview</h2>
          <p className="text-gray-600">Track your QR code performance and user engagement</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Countries */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              Top Countries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.topCountries.map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-6 bg-gray-200 rounded flex items-center justify-center text-xs font-medium">
                      {country.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-medium">{country.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24">
                      <Progress value={country.percentage} className="h-2" />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {country.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-green-600" />
              Device Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Mobile</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24">
                    <Progress value={mockData.deviceBreakdown.mobile} className="h-2" />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {mockData.deviceBreakdown.mobile}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Monitor className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">Desktop</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24">
                    <Progress value={mockData.deviceBreakdown.desktop} className="h-2" />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {mockData.deviceBreakdown.desktop}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Tablet className="h-5 w-5 text-orange-600" />
                  <span className="font-medium">Tablet</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24">
                    <Progress value={mockData.deviceBreakdown.tablet} className="h-2" />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {mockData.deviceBreakdown.tablet}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-600" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.campaign}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{activity.time}</p>
                  <p className="text-xs text-gray-500">{activity.location}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
