
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Upload, BarChart3, Zap, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function QuickActions() {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Create QR Campaign',
      description: 'Start a new marketing campaign',
      icon: Plus,
      color: 'bg-blue-500',
      action: () => navigate('/campaigns'),
      badge: 'Popular'
    },
    {
      title: 'Upload Template',
      description: 'Add new marketing materials',
      icon: Upload,
      color: 'bg-green-500',
      action: () => navigate('/templates'),
      badge: null
    },
    {
      title: 'View Analytics',
      description: 'Check campaign performance',
      icon: BarChart3,
      color: 'bg-purple-500',
      action: () => navigate('/analytics'),
      badge: 'New Data'
    },
    {
      title: 'Quick Generate',
      description: 'Generate QR codes instantly',
      icon: Zap,
      color: 'bg-orange-500',
      action: () => navigate('/quick-generate'),
      badge: null
    }
  ];

  const recentActivity = [
    { action: 'Created "Summer Sale" campaign', time: '2 hours ago', type: 'create' },
    { action: 'Updated QR template positioning', time: '4 hours ago', type: 'update' },
    { action: 'Generated 50 QR codes for event', time: '1 day ago', type: 'generate' },
    { action: 'Exported analytics report', time: '2 days ago', type: 'export' }
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Quick Actions */}
      <div className="xl:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <div
                  key={action.title}
                  className="relative p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={action.action}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg ${action.color} text-white`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    {action.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {action.badge}
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1">
                    {activity.type === 'create' && (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                    {activity.type === 'update' && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                    {activity.type === 'generate' && (
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    )}
                    {activity.type === 'export' && (
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-sm">
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
