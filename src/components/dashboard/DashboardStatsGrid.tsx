
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  QrCode, 
  Eye, 
  Users, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export function DashboardStatsGrid() {
  const stats = [
    {
      title: 'Total QR Codes',
      value: '124',
      change: '+12',
      trend: 'up',
      icon: QrCode,
      bgGradient: 'from-blue-500 via-blue-600 to-indigo-600',
      lightBg: 'from-blue-50 to-indigo-50',
      description: 'active codes'
    },
    {
      title: 'Total Scans',
      value: '45.2K',
      change: '+23.5%',
      trend: 'up',
      icon: Eye,
      bgGradient: 'from-emerald-500 via-green-600 to-teal-600',
      lightBg: 'from-emerald-50 to-green-50',
      description: 'this month'
    },
    {
      title: 'Unique Users',
      value: '12.8K',
      change: '+18.2%',
      trend: 'up',
      icon: Users,
      bgGradient: 'from-purple-500 via-violet-600 to-purple-700',
      lightBg: 'from-purple-50 to-violet-50',
      description: 'visitors'
    },
    {
      title: 'Conversion Rate',
      value: '12.8%',
      change: '-2.1%',
      trend: 'down',
      icon: TrendingUp,
      bgGradient: 'from-orange-500 via-amber-600 to-yellow-600',
      lightBg: 'from-orange-50 to-amber-50',
      description: 'avg rate'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer hover:scale-105"
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
  );
}
