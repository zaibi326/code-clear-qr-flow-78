
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const AdminAnalyticsCharts = () => {
  // Mock data for charts
  const dailyScansData = [
    { date: '2024-05-28', scans: 1200 },
    { date: '2024-05-29', scans: 1350 },
    { date: '2024-05-30', scans: 1100 },
    { date: '2024-05-31', scans: 1400 },
    { date: '2024-06-01', scans: 1600 },
    { date: '2024-06-02', scans: 1450 },
    { date: '2024-06-03', scans: 1700 },
    { date: '2024-06-04', scans: 1550 }
  ];

  const userGrowthData = [
    { month: 'Jan', users: 100 },
    { month: 'Feb', users: 150 },
    { month: 'Mar', users: 220 },
    { month: 'Apr', users: 280 },
    { month: 'May', users: 350 },
    { month: 'Jun', users: 420 }
  ];

  const qrTypeData = [
    { name: 'URL', value: 45, color: '#3B82F6' },
    { name: 'vCard', value: 25, color: '#8B5CF6' },
    { name: 'WiFi', value: 15, color: '#10B981' },
    { name: 'SMS', value: 10, color: '#F59E0B' },
    { name: 'Email', value: 5, color: '#EF4444' }
  ];

  const deviceData = [
    { device: 'Mobile', scans: 2400 },
    { device: 'Desktop', scans: 1200 },
    { device: 'Tablet', scans: 800 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Daily Scans</CardTitle>
          <CardDescription>QR code scans over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyScansData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="scans" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
          <CardDescription>New user registrations by month</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>QR Code Types</CardTitle>
          <CardDescription>Distribution of QR code types created</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={qrTypeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {qrTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Device Usage</CardTitle>
          <CardDescription>Scans by device type</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deviceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="device" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="scans" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalyticsCharts;
