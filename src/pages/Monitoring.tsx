
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, AlertTriangle, CheckCircle, Clock, TrendingUp, Users, Zap } from 'lucide-react';

const Monitoring = () => {
  const activityStats = [
    {
      title: 'Active Sessions',
      value: '2.4K',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'QR Scans/Hour',
      value: '145',
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Response Time',
      value: '1.2s',
      icon: Zap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Uptime',
      value: '99.9%',
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'scan',
      title: 'QR Code Scanned',
      description: 'Restaurant Menu QR was scanned 15 times',
      time: '2 minutes ago',
      status: 'success',
      icon: Activity
    },
    {
      id: 2,
      type: 'error',
      title: 'High Response Time',
      description: 'API response time exceeded 3 seconds',
      time: '5 minutes ago',
      status: 'warning',
      icon: AlertTriangle
    },
    {
      id: 3,
      type: 'create',
      title: 'New QR Code Created',
      description: 'WiFi Access QR code for Office Network',
      time: '12 minutes ago',
      status: 'success',
      icon: CheckCircle
    },
    {
      id: 4,
      type: 'traffic',
      title: 'Traffic Spike',
      description: 'Unusual traffic detected on Summer Campaign',
      time: '18 minutes ago',
      status: 'info',
      icon: TrendingUp
    }
  ];

  const systemMetrics = [
    { label: 'CPU Usage', value: 45, status: 'good' },
    { label: 'Memory Usage', value: 67, status: 'warning' },
    { label: 'Disk Usage', value: 23, status: 'good' },
    { label: 'Network I/O', value: 89, status: 'critical' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
      case 'good':
        return 'text-green-600 bg-green-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'critical':
      case 'error':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 via-green-50 to-blue-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0 ml-[240px]">
          <DashboardTopbar />
          
          <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
              {/* Header Section */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Activity Monitor
                </h1>
                <p className="text-gray-600">Real-time monitoring of your QR code system performance</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {activityStats.map((stat, index) => (
                  <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                          <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Monitoring Dashboard */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg p-6">
                <Tabs defaultValue="activity" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="activity">Activity Feed</TabsTrigger>
                    <TabsTrigger value="metrics">System Metrics</TabsTrigger>
                    <TabsTrigger value="alerts">Alerts</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="activity" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="h-5 w-5" />
                          Recent Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                              <div className={`p-2 rounded-lg ${getStatusColor(activity.status)}`}>
                                <activity.icon className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{activity.title}</h4>
                                <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {activity.time}
                                </p>
                              </div>
                              <Badge variant={activity.status === 'success' ? 'default' : 'secondary'}>
                                {activity.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="metrics" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>System Performance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {systemMetrics.map((metric, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold">{metric.value}%</span>
                                  <Badge variant={metric.status === 'good' ? 'default' : 'secondary'}>
                                    {metric.status}
                                  </Badge>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    metric.status === 'good' ? 'bg-green-500' :
                                    metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${metric.value}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="alerts" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5" />
                          System Alerts
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8">
                          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">All Systems Operational</h3>
                          <p className="text-gray-600">No active alerts at this time. Your system is running smoothly.</p>
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
