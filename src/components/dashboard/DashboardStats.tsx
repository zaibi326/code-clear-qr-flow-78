
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, Eye, Zap, TrendingUp } from 'lucide-react';

const statsData = [
  {
    title: "Total QR Codes",
    value: "234",
    change: "+12%",
    changeType: "positive" as const,
    icon: QrCode,
    description: "Active QR codes"
  },
  {
    title: "Total Scans",
    value: "12,345",
    change: "+18%",
    changeType: "positive" as const,
    icon: Eye,
    description: "This month"
  },
  {
    title: "Active Campaigns",
    value: "48",
    change: "+3%",
    changeType: "positive" as const,
    icon: Zap,
    description: "Running campaigns"
  },
  {
    title: "Conversion Rate",
    value: "8.2%",
    change: "+2.1%",
    changeType: "positive" as const,
    icon: TrendingUp,
    description: "Avg. this month"
  }
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className="p-2 bg-blue-50 rounded-lg">
              <stat.icon className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-xs font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-xs text-gray-500">
                {stat.description}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
