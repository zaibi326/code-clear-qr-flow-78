
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
  Download,
  Activity,
  Zap
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
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
      lightBg: 'bg-blue-50',
      description: 'vs last period'
    },
    {
      title: 'Unique Users',
      value: mockData.uniqueUsers.toLocaleString(),
      change: '+18.2%',
      trend: 'up',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-br from-green-500 to-green-600',
      lightBg: 'bg-green-50',
      description: 'returning visitors'
    },
    {
      title: 'Conversion Rate',
      value: `${mockData.conversionRate}%`,
      change: '-2.1%',
      trend: 'down',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-500 to-purple-600',
      lightBg: 'bg-purple-50',
      description: 'scan to action'
    },
    {
      title: 'Global Reach',
      value: '45 Countries',
      change: '+3 new',
      trend: 'up',
      icon: Globe,
      color: 'text-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-500 to-orange-600',
      lightBg: 'bg-orange-50',
      description: 'worldwide coverage'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Analytics Overview
          </h2>
          <p className="text-gray-600 text-lg">Real-time insights into your QR code performance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="flex items-center gap-2 hover:shadow-md transition-all">
            <Filter className="h-4 w-4" />
            Filter Data
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2 hover:shadow-md transition-all">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-60"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-6">
                <div className={`p-4 rounded-2xl ${stat.bgColor} text-white shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-full ${
                  stat.trend === 'up' 
                    ? 'text-green-700 bg-green-100' 
                    : 'text-red-700 bg-red-100'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enhanced Top Countries */}
        <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg text-white">
                <Globe className="h-5 w-5" />
              </div>
              Geographic Performance
            </CardTitle>
            <p className="text-gray-600">Top performing regions</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {mockData.topCountries.map((country, index) => (
                <div key={index} className="group/item hover:bg-gray-50 p-3 rounded-xl transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded flex items-center justify-center text-xs font-bold text-white shadow-md">
                        {country.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-800">{country.name}</span>
                    </div>
                    <Badge variant="secondary" className="font-medium">
                      {country.scans.toLocaleString()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Progress 
                        value={country.percentage} 
                        className="h-3 bg-gray-200"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600 w-12 text-right">
                      {country.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Device Breakdown */}
        <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white">
                <Smartphone className="h-5 w-5" />
              </div>
              Device Analytics
            </CardTitle>
            <p className="text-gray-600">User device preferences</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="group/device hover:bg-blue-50 p-4 rounded-xl transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Smartphone className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="font-semibold text-gray-800">Mobile</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 font-semibold">
                    {mockData.deviceBreakdown.mobile}%
                  </Badge>
                </div>
                <Progress value={mockData.deviceBreakdown.mobile} className="h-3" />
              </div>
              
              <div className="group/device hover:bg-purple-50 p-4 rounded-xl transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Monitor className="h-5 w-5 text-purple-600" />
                    </div>
                    <span className="font-semibold text-gray-800">Desktop</span>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800 font-semibold">
                    {mockData.deviceBreakdown.desktop}%
                  </Badge>
                </div>
                <Progress value={mockData.deviceBreakdown.desktop} className="h-3" />
              </div>
              
              <div className="group/device hover:bg-orange-50 p-4 rounded-xl transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Tablet className="h-5 w-5 text-orange-600" />
                    </div>
                    <span className="font-semibold text-gray-800">Tablet</span>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800 font-semibold">
                    {mockData.deviceBreakdown.tablet}%
                  </Badge>
                </div>
                <Progress value={mockData.deviceBreakdown.tablet} className="h-3" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Recent Activity */}
      <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg text-white">
              <Activity className="h-5 w-5" />
            </div>
            Live Activity Feed
          </CardTitle>
          <p className="text-gray-600">Real-time user interactions</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.recentActivity.map((activity, index) => (
              <div key={index} className="group/activity flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-md transition-all duration-300 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75"></div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 group-hover/activity:text-blue-600 transition-colors">
                      {activity.action}
                    </p>
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
