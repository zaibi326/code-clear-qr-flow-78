
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, QrCode, BarChart3, Users, Eye, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const activities = [
  {
    id: 1,
    type: 'scan',
    title: 'QR Code Scanned',
    description: 'Restaurant Menu QR was scanned 15 times',
    time: '2 minutes ago',
    icon: Eye,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    id: 2,
    type: 'create',
    title: 'New QR Code Created',
    description: 'WiFi Access QR code for Office Network',
    time: '1 hour ago',
    icon: QrCode,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    id: 3,
    type: 'campaign',
    title: 'Campaign Updated',
    description: 'Summer Sale campaign settings modified',
    time: '3 hours ago',
    icon: Zap,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    id: 4,
    type: 'analytics',
    title: 'Analytics Report',
    description: 'Weekly performance report generated',
    time: '5 hours ago',
    icon: BarChart3,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    id: 5,
    type: 'user',
    title: 'New User Registration',
    description: 'Team member joined your workspace',
    time: '1 day ago',
    icon: Users,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50'
  }
];

export function RecentActivity() {
  return (
    <Card className="bg-white rounded-xl shadow-sm border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-600" />
          Recent Activity
        </CardTitle>
        <Badge variant="secondary" className="text-xs">
          Live
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div className={`p-2 rounded-lg ${activity.bgColor} flex-shrink-0`}>
                <activity.icon className={`h-4 w-4 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 mb-1">{activity.title}</h4>
                <p className="text-xs text-gray-600 mb-1">{activity.description}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium w-full text-center">
            View All Activity
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
