
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
    <div className="grid-responsive-stats">
      {statsData.map((stat, index) => (
        <Card 
          key={index} 
          className="card-elevated group hover:scale-[1.02] transition-all duration-200"
          role="article"
          aria-labelledby={`stat-title-${index}`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle 
              id={`stat-title-${index}`}
              className="text-sm font-medium text-gray-600 leading-tight"
            >
              {stat.title}
            </CardTitle>
            <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              <stat.icon 
                className="h-4 w-4 text-blue-600" 
                aria-hidden="true"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
              {stat.value}
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span 
                className={`font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}
                aria-label={`${stat.changeType === 'positive' ? 'Increase' : 'Decrease'} of ${stat.change}`}
              >
                {stat.change}
              </span>
              <span className="text-gray-500">
                {stat.description}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
