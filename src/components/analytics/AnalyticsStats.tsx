
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, Eye, MousePointer, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';

const statsData = [
  {
    title: "Total Scans",
    value: "45,231",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: Eye,
    period: "vs last month"
  },
  {
    title: "Active QR Codes",
    value: "187",
    change: "+8",
    changeType: "positive" as const,
    icon: QrCode,
    period: "vs last month"
  },
  {
    title: "Click-through Rate",
    value: "24.8%",
    change: "-2.1%",
    changeType: "negative" as const,
    icon: MousePointer,
    period: "vs last month"
  },
  {
    title: "Top Campaign",
    value: "Summer Promo",
    change: "15,432 scans",
    changeType: "neutral" as const,
    icon: TrendingUp,
    period: "this month"
  }
];

export function AnalyticsStats() {
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
              {stat.changeType === 'positive' && (
                <ArrowUp className="h-3 w-3 text-green-600" />
              )}
              {stat.changeType === 'negative' && (
                <ArrowDown className="h-3 w-3 text-red-600" />
              )}
              <span className={`text-xs font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 
                stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-xs text-gray-500">
                {stat.period}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
