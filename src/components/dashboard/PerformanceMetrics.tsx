
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Target, Clock, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const metrics = [
  {
    label: 'Scan Rate',
    value: '85%',
    progress: 85,
    change: '+12%',
    trend: 'up',
    icon: TrendingUp,
    color: 'text-green-600'
  },
  {
    label: 'Conversion',
    value: '68%',
    progress: 68,
    change: '+5%',
    trend: 'up',
    icon: Target,
    color: 'text-blue-600'
  },
  {
    label: 'Response Time',
    value: '1.2s',
    progress: 75,
    change: '-0.3s',
    trend: 'up',
    icon: Clock,
    color: 'text-purple-600'
  },
  {
    label: 'Efficiency',
    value: '92%',
    progress: 92,
    change: '+8%',
    trend: 'up',
    icon: Zap,
    color: 'text-orange-600'
  }
];

export function PerformanceMetrics() {
  return (
    <Card className="bg-white rounded-xl shadow-sm border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                  <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">{metric.value}</span>
                  <span className="text-xs text-green-600 font-medium">{metric.change}</span>
                </div>
              </div>
              <Progress value={metric.progress} className="h-2" />
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">4.8</div>
              <div className="text-xs text-gray-500">Avg Rating</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">99.9%</div>
              <div className="text-xs text-gray-500">Uptime</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
