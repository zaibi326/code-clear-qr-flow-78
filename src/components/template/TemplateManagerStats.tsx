
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Upload, TrendingUp, Download } from 'lucide-react';

interface TemplateManagerStatsProps {
  templateCount: number;
}

export const TemplateManagerStats = ({ templateCount }: TemplateManagerStatsProps) => {
  const templateStats = [
    {
      title: 'Total Templates',
      value: templateCount.toString(),
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
      lightBg: 'bg-blue-50',
      change: '+3'
    },
    {
      title: 'Recent Uploads',
      value: '12',
      icon: Upload,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
      lightBg: 'bg-green-50',
      change: '+5'
    },
    {
      title: 'Most Used',
      value: 'Business Card',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-r from-purple-500 to-purple-600',
      lightBg: 'bg-purple-50',
      change: '89%'
    },
    {
      title: 'Downloads',
      value: '1.2k',
      icon: Download,
      color: 'text-orange-600',
      bgColor: 'bg-gradient-to-r from-orange-500 to-orange-600',
      lightBg: 'bg-orange-50',
      change: '+24%'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
      {templateStats.map((stat, index) => (
        <Card key={index} className="group border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl hover:scale-105 transition-all duration-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-4 rounded-2xl ${stat.bgColor} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className={`flex items-center gap-1 ${stat.change.includes('+') || stat.change.includes('%') ? 'text-green-600' : 'text-blue-600'}`}>
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
  );
};
