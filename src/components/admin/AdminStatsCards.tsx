
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, QrCode, BarChart3, DollarSign, TrendingUp, Activity } from 'lucide-react';

const AdminStatsCards = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '2,547',
      change: '+12%',
      icon: Users,
      trend: 'up'
    },
    {
      title: 'QR Codes Created',
      value: '18,432',
      change: '+8%',
      icon: QrCode,
      trend: 'up'
    },
    {
      title: 'Total Scans',
      value: '847,293',
      change: '+23%',
      icon: BarChart3,
      trend: 'up'
    },
    {
      title: 'Revenue',
      value: '$12,847',
      change: '+15%',
      icon: DollarSign,
      trend: 'up'
    },
    {
      title: 'Active Campaigns',
      value: '156',
      change: '+5%',
      icon: Activity,
      trend: 'up'
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '+0.4%',
      icon: TrendingUp,
      trend: 'up'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-green-600">
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AdminStatsCards;
