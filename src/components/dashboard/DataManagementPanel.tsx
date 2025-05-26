
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  Users, 
  FileImage, 
  Campaign, 
  QrCode, 
  Activity,
  Download,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { databaseService } from '@/utils/databaseService';
import { userProfileService } from '@/utils/userProfileService';

export function DataManagementPanel() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const dbStats = await databaseService.getDatabaseStats();
      const userProfile = userProfileService.getUserProfile();
      const analytics = await databaseService.getUserAnalytics('current-user', '30d');
      
      setStats({
        database: dbStats,
        user: userProfile,
        analytics
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const result = await userProfileService.exportUserData();
      if (result.success) {
        const blob = new Blob([JSON.stringify(result.data, null, 2)], { 
          type: 'application/json' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `clearqr-data-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading data management panel...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Data Management</h2>
          <p className="text-gray-600">Monitor and manage your database and user data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadStats}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleExportData} disabled={isExporting}>
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export Data'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.database?.users?.count || 0}</div>
                <p className="text-xs text-muted-foreground">Active accounts</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Templates</CardTitle>
                <FileImage className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.database?.templates?.count || 0}</div>
                <p className="text-xs text-muted-foreground">Stored templates</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Campaigns</CardTitle>
                <Campaign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.database?.campaigns?.count || 0}</div>
                <p className="text-xs text-muted-foreground">Active campaigns</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">QR Codes</CardTitle>
                <QrCode className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.database?.qr_codes?.count || 0}</div>
                <p className="text-xs text-muted-foreground">Generated codes</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Database Size Overview</CardTitle>
              <CardDescription>Storage usage by data type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.database && Object.entries(stats.database).map(([table, data]: [string, any]) => (
                  <div key={table} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{table}</Badge>
                      <span className="text-sm text-gray-600">{data.count} records</span>
                    </div>
                    <div className="text-sm font-mono">
                      {(data.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Tables</CardTitle>
              <CardDescription>Detailed view of all database tables and their contents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.database && Object.entries(stats.database).map(([table, data]: [string, any]) => (
                  <div key={table} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium capitalize">{table.replace('_', ' ')}</h4>
                      <Badge>{data.count} records</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Size:</span>
                        <span className="ml-2">{(data.size / 1024).toFixed(1)} KB</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Avg Record Size:</span>
                        <span className="ml-2">
                          {data.count > 0 ? (data.size / data.count).toFixed(0) : 0} bytes
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Analytics</CardTitle>
              <CardDescription>Your account activity and usage patterns</CardDescription>
            </CardHeader>
            <CardContent>
              {stats?.analytics ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{stats.analytics.campaigns}</div>
                    <div className="text-sm text-gray-600">Your Campaigns</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.analytics.qr_codes}</div>
                    <div className="text-sm text-gray-600">Your QR Codes</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{stats.analytics.total_scans}</div>
                    <div className="text-sm text-gray-600">Total Scans</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{stats.analytics.unique_scans}</div>
                    <div className="text-sm text-gray-600">Unique Scans</div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No analytics data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Maintenance</CardTitle>
              <CardDescription>Manage your data and perform maintenance operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  onClick={handleExportData}
                  disabled={isExporting}
                  className="justify-start"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isExporting ? 'Exporting...' : 'Export All Data'}
                </Button>
                
                <Button variant="outline" className="justify-start">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Statistics
                </Button>
                
                <Button variant="outline" className="justify-start">
                  <Activity className="h-4 w-4 mr-2" />
                  View Audit Logs
                </Button>
                
                <Button variant="destructive" className="justify-start">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account Data
                </Button>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Data Retention Policy</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Your data is retained according to our data retention policy. Analytics data older than 2 years is automatically archived.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Active Data:</span>
                    <span className="ml-2 text-gray-600">Last 12 months</span>
                  </div>
                  <div>
                    <span className="font-medium">Archived Data:</span>
                    <span className="ml-2 text-gray-600">1-2 years</span>
                  </div>
                  <div>
                    <span className="font-medium">Deleted Data:</span>
                    <span className="ml-2 text-gray-600">After 2 years</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
