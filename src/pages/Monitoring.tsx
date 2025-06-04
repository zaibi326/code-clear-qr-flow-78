
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, AlertTriangle, CheckCircle, Clock, TrendingUp, Users, Zap, Plus, RefreshCw } from 'lucide-react';

const Monitoring = () => {
  const activityStats = [
    {
      title: 'Active Sessions',
      value: '2.4K',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
      lightBg: 'bg-blue-50',
      change: '+12%'
    },
    {
      title: 'QR Scans/Hour',
      value: '145',
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
      lightBg: 'bg-green-50',
      change: '+8%'
    },
    {
      title: 'Response Time',
      value: '1.2s',
      icon: Zap,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-r from-purple-500 to-purple-600',
      lightBg: 'bg-purple-50',
      change: '-5%'
    },
    {
      title: 'Uptime',
      value: '99.9%',
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      lightBg: 'bg-emerald-50',
      change: '+0.1%'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'scan',
      title: 'QR Code Scanned',
      description: 'Restaurant Menu QR was scanned 15 times in the last 5 minutes',
      time: '2 minutes ago',
      status: 'success',
      icon: Activity,
      location: 'New York, USA'
    },
    {
      id: 2,
      type: 'error',
      title: 'High Response Time Alert',
      description: 'API response time exceeded 3 seconds threshold',
      time: '5 minutes ago',
      status: 'warning',
      icon: AlertTriangle,
      location: 'Server US-East-1'
    },
    {
      id: 3,
      type: 'create',
      title: 'New QR Code Created',
      description: 'WiFi Access QR code created for Office Network',
      time: '12 minutes ago',
      status: 'success',
      icon: CheckCircle,
      location: 'Admin Dashboard'
    },
    {
      id: 4,
      type: 'traffic',
      title: 'Traffic Spike Detected',
      description: 'Unusual traffic detected on Summer Campaign - 300% increase',
      time: '18 minutes ago',
      status: 'info',
      icon: TrendingUp,
      location: 'Campaign #SC2024'
    }
  ];

  const systemMetrics = [
    { label: 'CPU Usage', value: 45, status: 'good', trend: '+2%' },
    { label: 'Memory Usage', value: 67, status: 'warning', trend: '+5%' },
    { label: 'Disk Usage', value: 23, status: 'good', trend: '-1%' },
    { label: 'Network I/O', value: 89, status: 'critical', trend: '+15%' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
      case 'good':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical':
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0 ml-[240px]">
          <DashboardTopbar />
          
          <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
              {/* Header Section */}
              <div className="mb-8 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      Activity Monitor
                    </h1>
                    <p className="text-lg text-gray-600">Real-time monitoring of your QR code system performance</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex items-center gap-2 hover:bg-gray-100">
                      <RefreshCw className="h-4 w-4" />
                      Refresh
                    </Button>
                    <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Alert
                    </Button>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
                {activityStats.map((stat, index) => (
                  <Card key={index} className="group border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl hover:scale-105 transition-all duration-500">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-4 rounded-2xl ${stat.bgColor} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                          <stat.icon className="h-6 w-6" />
                        </div>
                        <div className={`flex items-center gap-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm font-medium">{stat.change}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Monitoring Dashboard */}
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-gray-200 shadow-2xl p-8 animate-fade-in">
                <Tabs defaultValue="activity" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="activity" className="text-sm font-medium">Activity Feed</TabsTrigger>
                    <TabsTrigger value="metrics" className="text-sm font-medium">System Metrics</TabsTrigger>
                    <TabsTrigger value="alerts" className="text-sm font-medium">Alerts & Notifications</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="activity" className="mt-0">
                    <Card className="border-0 shadow-lg">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-3 text-xl">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Activity className="h-5 w-5 text-blue-600" />
                          </div>
                          Recent Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {recentActivity.map((activity) => (
                            <div key={activity.id} className={`flex items-start gap-4 p-4 rounded-2xl border ${getStatusColor(activity.status)} hover:shadow-md transition-shadow`}>
                              <div className={`p-3 rounded-xl ${getStatusColor(activity.status)}`}>
                                <activity.icon className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                                  <Badge variant={activity.status === 'success' ? 'default' : 'secondary'} className="text-xs">
                                    {activity.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {activity.time}
                                  </span>
                                  <span>📍 {activity.location}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="metrics" className="mt-0">
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-xl">System Performance Metrics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {systemMetrics.map((metric, index) => (
                            <div key={index} className="space-y-3 p-4 bg-gray-50 rounded-2xl">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold text-gray-700">{metric.label}</span>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-bold text-gray-900">{metric.value}%</span>
                                  <span className={`text-xs font-medium ${metric.trend.startsWith('+') ? 'text-red-600' : 'text-green-600'}`}>
                                    {metric.trend}
                                  </span>
                                  <Badge variant={metric.status === 'good' ? 'default' : 'secondary'} className="text-xs">
                                    {metric.status}
                                  </Badge>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <div 
                                  className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(metric.status)}`}
                                  style={{ width: `${metric.value}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="alerts" className="mt-0">
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-xl">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          System Alerts
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-12">
                          <div className="mb-6">
                            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto -mt-20 mb-4"></div>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-3">All Systems Operational</h3>
                          <p className="text-gray-600 mb-6 max-w-md mx-auto">No active alerts at this time. Your system is running smoothly with optimal performance across all metrics.</p>
                          <Button variant="outline" className="flex items-center gap-2 mx-auto">
                            <Plus className="h-4 w-4" />
                            Configure Alerts
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Monitoring;
