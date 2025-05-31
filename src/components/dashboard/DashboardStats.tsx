
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, Eye, Zap, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';

const statsData = [
  {
    title: "Total QR Codes",
    value: "234",
    change: "+12%",
    changeType: "positive" as const,
    icon: QrCode,
    description: "Active codes",
    previousValue: "209"
  },
  {
    title: "Total Scans",
    value: "12,345",
    change: "+18%",
    changeType: "positive" as const,
    icon: Eye,
    description: "This month",
    previousValue: "10,462"
  },
  {
    title: "Active Campaigns",
    value: "48",
    change: "+3%",
    changeType: "positive" as const,
    icon: Zap,
    description: "Running now",
    previousValue: "47"
  },
  {
    title: "Conversion Rate",
    value: "8.2%",
    change: "-2.1%",
    changeType: "negative" as const,
    icon: TrendingUp,
    description: "Avg. this month",
    previousValue: "8.4%"
  }
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <Card 
          key={index} 
          className="border-0 shadow-sm bg-white hover:shadow-md transition-all duration-200"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${
                stat.changeType === 'positive' ? 'bg-green-50' : 
                stat.changeType === 'negative' ? 'bg-red-50' : 'bg-blue-50'
              }`}>
                <stat.icon className={`h-6 w-6 ${
                  stat.changeType === 'positive' ? 'text-green-600' : 
                  stat.changeType === 'negative' ? 'text-red-600' : 'text-blue-600'
                }`} />
              </div>
              <div className={`flex items-center text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 
                stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {stat.changeType === 'positive' ? (
                  <ArrowUp className="h-4 w-4 mr-1" />
                ) : stat.changeType === 'negative' ? (
                  <ArrowDown className="h-4 w-4 mr-1" />
                ) : null}
                {stat.change}
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-gray-500">
                {stat.description} • Previous: {stat.previousValue}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
