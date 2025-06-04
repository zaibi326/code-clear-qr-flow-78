
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  QrCode, 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield
} from 'lucide-react';
import AdminStatsCards from './AdminStatsCards';

const AdminOverviewTab = () => {
  // Mock data - in real app, this would come from API calls
  const systemHealth = {
    status: 'healthy',
    uptime: '99.9%',
    lastIncident: '2 days ago',
    activeUsers: 2547,
    responseTime: '125ms'
  };

  const recentActivities = [
    {
      id: 1,
      type: 'user_signup',
      description: 'New user registered: john.doe@example.com',
      timestamp: '2 minutes ago',
      status: 'success'
    },
    {
      id: 2,
      type: 'qr_created',
      description: 'QR code created for Marketing Campaign',
      timestamp: '5 minutes ago',
      status: 'success'
    },
    {
      id: 3,
      type: 'payment',
      description: 'Subscription upgraded to Pro plan',
      timestamp: '12 minutes ago',
      status: 'success'
    },
    {
      id: 4,
      type: 'error',
      description: 'API rate limit exceeded for user ID: 1234',
      timestamp: '18 minutes ago',
      status: 'warning'
    }
  ];

  const topUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', qrCodes: 45, plan: 'Pro' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', qrCodes: 38, plan: 'Enterprise' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', qrCodes: 32, plan: 'Pro' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', qrCodes: 28, plan: 'Free' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_signup': return <Users className="h-4 w-4" />;
      case 'qr_created': return <QrCode className="h-4 w-4" />;
      case 'payment': return <DollarSign className="h-4 w-4" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <AdminStatsCards />

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>System Health</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <Badge className="bg-green-100 text-green-800">Healthy</Badge>
              </div>
              <p className="text-sm text-gray-600">System Status</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">99.9%</div>
              <p className="text-sm text-gray-600">Uptime</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">125ms</div>
              <p className="text-sm text-gray-600">Avg Response</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">2,547</div>
              <p className="text-sm text-gray-600">Active Users</p>
            </div>
            <div className="text-center">
              <div className="text-sm">2 days ago</div>
              <p className="text-sm text-gray-600">Last Incident</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`mt-0.5 ${getStatusColor(activity.status)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Users */}
        <Card>
          <CardHeader>
            <CardTitle>Top Users by QR Codes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topUsers.map((user, index) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{user.qrCodes} QRs</p>
                    <Badge variant={user.plan === 'Enterprise' ? 'default' : user.plan === 'Pro' ? 'secondary' : 'outline'}>
                      {user.plan}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">API Performance</span>
                <span className="text-sm text-green-600">98.5%</span>
              </div>
              <Progress value={98.5} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Database Health</span>
                <span className="text-sm text-green-600">99.2%</span>
              </div>
              <Progress value={99.2} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Storage Usage</span>
                <span className="text-sm text-yellow-600">76.3%</span>
              </div>
              <Progress value={76.3} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverviewTab;
