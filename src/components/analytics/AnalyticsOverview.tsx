
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
  Zap,
  BarChart3,
  MapPin,
  Clock,
  Target,
  Star
} from 'lucide-react';

const mockData = {
  totalScans: 45623,
  uniqueUsers: 32145,
  conversionRate: 12.8,
  topCountries: [
    { name: 'United States', scans: 15234, percentage: 33.4, flag: '🇺🇸' },
    { name: 'United Kingdom', scans: 8765, percentage: 19.2, flag: '🇬🇧' },
    { name: 'Germany', scans: 6543, percentage: 14.3, flag: '🇩🇪' },
    { name: 'France', scans: 4321, percentage: 9.5, flag: '🇫🇷' },
    { name: 'Canada', scans: 3210, percentage: 7.0, flag: '🇨🇦' }
  ],
  deviceBreakdown: {
    mobile: 68.5,
    desktop: 23.8,
    tablet: 7.7
  },
  recentActivity: [
    { time: '2 mins ago', action: 'QR Code scanned', campaign: 'Summer Sale 2024', location: 'New York, US', status: 'success' },
    { time: '5 mins ago', action: 'Campaign created', campaign: 'Product Launch', location: 'London, UK', status: 'info' },
    { time: '8 mins ago', action: 'QR Code scanned', campaign: 'Restaurant Menu', location: 'Paris, FR', status: 'success' },
    { time: '12 mins ago', action: 'QR Code scanned', campaign: 'Event Tickets', location: 'Berlin, DE', status: 'success' },
    { time: '15 mins ago', action: 'Campaign updated', campaign: 'Holiday Promo', location: 'Toronto, CA', status: 'warning' }
  ]
};

export function AnalyticsOverview() {
  const [timeFilter, setTimeFilter] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('scans');

  const statCards = [
    {
      title: 'Total Scans',
      value: mockData.totalScans.toLocaleString(),
      change: '+23.5%',
      trend: 'up',
      icon: Eye,
      color: 'text-blue-600',
      bgGradient: 'from-blue-500 via-blue-600 to-indigo-600',
      lightBg: 'from-blue-50 to-indigo-50',
      description: 'vs last period',
      iconBg: 'bg-blue-500'
    },
    {
      title: 'Unique Users',
      value: mockData.uniqueUsers.toLocaleString(),
      change: '+18.2%',
      trend: 'up',
      icon: Users,
      color: 'text-emerald-600',
      bgGradient: 'from-emerald-500 via-green-600 to-teal-600',
      lightBg: 'from-emerald-50 to-green-50',
      description: 'returning visitors',
      iconBg: 'bg-emerald-500'
    },
    {
      title: 'Conversion Rate',
      value: `${mockData.conversionRate}%`,
      change: '-2.1%',
      trend: 'down',
      icon: Target,
      color: 'text-purple-600',
      bgGradient: 'from-purple-500 via-violet-600 to-purple-700',
      lightBg: 'from-purple-50 to-violet-50',
      description: 'scan to action',
      iconBg: 'bg-purple-500'
    },
    {
      title: 'Global Reach',
      value: '45 Countries',
      change: '+3 new',
      trend: 'up',
      icon: Globe,
      color: 'text-orange-600',
      bgGradient: 'from-orange-500 via-amber-600 to-yellow-600',
      lightBg: 'from-orange-50 to-amber-50',
      description: 'worldwide coverage',
      iconBg: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Enhanced Header with Interactive Elements */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-white/5 rounded-full blur-lg"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold">Analytics Overview</h2>
                <p className="text-blue-100 text-lg">Real-time insights into your QR code performance</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Activity className="h-4 w-4" />
                <span>Live Data</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Clock className="h-4 w-4" />
                <span>Updated 2 mins ago</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="flex bg-white/10 backdrop-blur-sm rounded-xl p-1">
              {['7d', '30d', '90d'].map((period) => (
                <Button
                  key={period}
                  variant={timeFilter === period ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setTimeFilter(period)}
                  className={`relative ${timeFilter === period 
                    ? 'bg-white text-purple-600 shadow-lg' 
                    : 'text-white hover:bg-white/20'
                  }`}
                >
                  {period}
                </Button>
              ))}
            </div>
            <Button className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid with Interactive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card 
            key={index} 
            className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer hover:scale-105"
            onClick={() => setSelectedMetric(stat.title.toLowerCase().replace(' ', '_'))}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.lightBg} opacity-50`}></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm"></div>
            
            <CardContent className="relative p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${stat.bgGradient} text-white shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-bold px-3 py-1.5 rounded-full ${
                  stat.trend === 'up' 
                    ? 'text-emerald-700 bg-emerald-100 border border-emerald-200' 
                    : 'text-red-700 bg-red-100 border border-red-200'
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
                <p className="text-sm font-semibold text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 font-medium">{stat.description}</p>
              </div>

              {/* Interactive Sparkline Effect */}
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${stat.bgGradient} rounded-full transition-all duration-1000 group-hover:w-full`}
                  style={{ width: `${65 + index * 10}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Enhanced Geographic Performance */}
        <Card className="xl:col-span-2 group hover:shadow-2xl transition-all duration-500 border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl text-white shadow-lg">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Geographic Performance
                </span>
                <p className="text-sm text-gray-600 font-normal">Top performing regions worldwide</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {mockData.topCountries.map((country, index) => (
                <div key={index} className="group/item relative overflow-hidden hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 p-4 rounded-xl transition-all duration-300 border border-transparent hover:border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="text-2xl">{country.flag}</div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                      <div>
                        <span className="font-bold text-gray-800 text-lg">{country.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-3 w-3 text-gray-500" />
                          <span className="text-xs text-gray-500">Active region</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="font-bold text-lg px-3 py-1">
                        {country.scans.toLocaleString()}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">total scans</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Progress 
                        value={country.percentage} 
                        className="h-3 bg-gray-200"
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-700 w-12 text-right">
                      {country.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Device Analytics */}
        <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-xl">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl text-white shadow-lg">
                <Smartphone className="h-6 w-6" />
              </div>
              <div>
                <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  Device Analytics
                </span>
                <p className="text-sm text-gray-600 font-normal">User device preferences</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {[
                { type: 'Mobile', value: mockData.deviceBreakdown.mobile, icon: Smartphone, color: 'blue', gradient: 'from-blue-500 to-cyan-500' },
                { type: 'Desktop', value: mockData.deviceBreakdown.desktop, icon: Monitor, color: 'purple', gradient: 'from-purple-500 to-violet-500' },
                { type: 'Tablet', value: mockData.deviceBreakdown.tablet, icon: Tablet, color: 'orange', gradient: 'from-orange-500 to-amber-500' }
              ].map((device, index) => (
                <div key={device.type} className={`group/device hover:bg-${device.color}-50 p-4 rounded-xl transition-all duration-300 border border-transparent hover:border-${device.color}-200`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 bg-gradient-to-r ${device.gradient} rounded-xl text-white shadow-lg group-hover/device:scale-110 transition-transform`}>
                        <device.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="font-bold text-gray-800 text-lg">{device.type}</span>
                        <p className="text-xs text-gray-500">devices</p>
                      </div>
                    </div>
                    <Badge className={`bg-${device.color}-100 text-${device.color}-800 font-bold text-lg px-3 py-1`}>
                      {device.value}%
                    </Badge>
                  </div>
                  <div className="relative">
                    <Progress value={device.value} className="h-4" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Live Activity Feed */}
      <Card className="hover:shadow-2xl transition-all duration-500 border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-t-xl">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl text-white shadow-lg">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Live Activity Feed
              </span>
              <p className="text-sm text-gray-600 font-normal">Real-time user interactions</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {mockData.recentActivity.map((activity, index) => (
              <div key={index} className="group/activity relative overflow-hidden flex items-center justify-between p-4 bg-gradient-to-r from-white via-gray-50 to-white rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-indigo-200">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className={`w-4 h-4 rounded-full animate-pulse ${
                      activity.status === 'success' ? 'bg-green-500' : 
                      activity.status === 'warning' ? 'bg-yellow-500' : 
                      activity.status === 'info' ? 'bg-blue-500' : 'bg-gray-500'
                    }`}></div>
                    <div className={`absolute inset-0 w-4 h-4 rounded-full animate-ping opacity-75 ${
                      activity.status === 'success' ? 'bg-green-400' : 
                      activity.status === 'warning' ? 'bg-yellow-400' : 
                      activity.status === 'info' ? 'bg-blue-400' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-gray-900 group-hover/activity:text-indigo-600 transition-colors">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-600 font-medium">{activity.campaign}</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-bold text-gray-900">{activity.time}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="h-3 w-3" />
                    <span>{activity.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
