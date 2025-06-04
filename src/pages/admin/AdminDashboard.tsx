
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  QrCode, 
  BarChart3, 
  Settings, 
  Shield, 
  LogOut, 
  Bell,
  Search,
  Plus,
  Filter,
  Download,
  MoreVertical,
  TrendingUp,
  Activity,
  DollarSign,
  Eye
} from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useToast } from '@/hooks/use-toast';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminStatsCards from '@/components/admin/AdminStatsCards';
import AdminUsersTable from '@/components/admin/AdminUsersTable';
import AdminQRCodesTable from '@/components/admin/AdminQRCodesTable';
import AdminAnalyticsCharts from '@/components/admin/AdminAnalyticsCharts';
import AdminSystemSettings from '@/components/admin/AdminSystemSettings';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { adminUser, adminLogout } = useAdminAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!adminUser) {
      navigate('/admin/login');
    }
  }, [adminUser, navigate]);

  const handleLogout = async () => {
    await adminLogout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the admin dashboard.",
    });
    navigate('/admin/login');
  };

  if (!adminUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar 
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <AdminHeader 
          adminUser={adminUser}
          onLogout={handleLogout}
        />
        
        <main className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-600">Welcome back, {adminUser.name}</p>
              </div>
              
              <AdminStatsCards />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest user actions and system events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map((item) => (
                        <div key={item} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium">User created new QR code</p>
                            <p className="text-xs text-gray-500">2 minutes ago</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>System Status</CardTitle>
                    <CardDescription>Current system performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Server Uptime</span>
                        <span className="text-sm text-green-600">99.9%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">API Response Time</span>
                        <span className="text-sm text-green-600">45ms</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Database Status</span>
                        <span className="text-sm text-green-600">Healthy</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Storage Usage</span>
                        <span className="text-sm text-yellow-600">68%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                  <p className="text-gray-600">Manage all registered users</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
              
              <AdminUsersTable />
            </div>
          )}

          {activeTab === 'qr-codes' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">QR Code Management</h1>
                  <p className="text-gray-600">Monitor and manage all QR codes</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create QR Code
                  </Button>
                </div>
              </div>
              
              <AdminQRCodesTable />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
                <p className="text-gray-600">Comprehensive platform analytics</p>
              </div>
              
              <AdminAnalyticsCharts />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
                <p className="text-gray-600">Configure platform settings and preferences</p>
              </div>
              
              <AdminSystemSettings />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
