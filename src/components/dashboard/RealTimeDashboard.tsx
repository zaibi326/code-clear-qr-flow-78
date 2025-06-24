
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area 
} from 'recharts';
import { 
  QrCode, Eye, Users, TrendingUp, MapPin, Clock, Tag, 
  RefreshCw, Globe, Smartphone, Monitor, Tablet 
} from 'lucide-react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { qrCodeService } from '@/services/qrCodeService';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalQRCodes: number;
  totalScans: number;
  uniqueScans: number;
  avgScansPerQR: number;
  recentActivity: any[];
}

interface ScanData {
  id: string;
  qr_code_id: string;
  scan_timestamp: string;
  location_data: any;
  device_info: any;
  is_first_time_scan: boolean;
  lead_source: string;
  referrer_source: string;
}

export function RealTimeDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalQRCodes: 0,
    totalScans: 0,
    uniqueScans: 0,
    avgScansPerQR: 0,
    recentActivity: []
  });
  const [scanData, setScanData] = useState<ScanData[]>([]);
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    if (user) {
      loadDashboardData();
      setupRealTimeSubscription();
    }
  }, [user, timeRange]);

  const loadDashboardData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Load QR analytics
      const analytics = await qrCodeService.getQRAnalytics(user.id, timeRange);
      setStats({
        totalQRCodes: analytics.total_qr_codes,
        totalScans: analytics.total_scans,
        uniqueScans: analytics.unique_scans,
        avgScansPerQR: analytics.avg_scans_per_qr,
        recentActivity: analytics.recent_activity || []
      });

      // Load scan data
      const { data: scans } = await supabase
        .from('scan_analytics')
        .select('*')
        .eq('user_id', user.id)
        .order('scan_timestamp', { ascending: false })
        .limit(100);

      setScanData(scans || []);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeSubscription = () => {
    if (!user) return;

    const channel = supabase
      .channel('dashboard-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'scan_analytics',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New scan detected:', payload);
          setScanData(prev => [payload.new as ScanData, ...prev.slice(0, 99)]);
          setStats(prev => ({
            ...prev,
            totalScans: prev.totalScans + 1,
            uniqueScans: (payload.new as ScanData).is_first_time_scan ? prev.uniqueScans + 1 : prev.uniqueScans
          }));
          setLastUpdate(new Date());
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const getLocationBreakdown = () => {
    const locationCounts: Record<string, number> = {};
    scanData.forEach(scan => {
      const country = scan.location_data?.country || 'Unknown';
      locationCounts[country] = (locationCounts[country] || 0) + 1;
    });
    return Object.entries(locationCounts)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  };

  const getTagBreakdown = () => {
    // Mock tag data - would come from actual QR codes and their tags
    return [
      { name: 'Social Media', value: 35, color: '#8884d8' },
      { name: 'Email Campaign', value: 25, color: '#82ca9d' },
      { name: 'Print Materials', value: 20, color: '#ffc658' },
      { name: 'Website', value: 15, color: '#ff7c7c' },
      { name: 'Events', value: 5, color: '#8dd1e1' }
    ];
  };

  const getFirstTimeVsRepeatScans = () => {
    const firstTime = scanData.filter(scan => scan.is_first_time_scan).length;
    const repeat = scanData.length - firstTime;
    return [
      { name: 'First-time', value: firstTime, color: '#8884d8' },
      { name: 'Repeat', value: repeat, color: '#82ca9d' }
    ];
  };

  const getLeadSourceBreakdown = () => {
    const sourceCounts: Record<string, number> = {};
    scanData.forEach(scan => {
      const source = scan.lead_source || scan.referrer_source || 'Direct';
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });
    return Object.entries(sourceCounts)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  };

  const getDeviceBreakdown = () => {
    const deviceCounts: Record<string, number> = {};
    scanData.forEach(scan => {
      const device = scan.device_info?.type || 'Unknown';
      deviceCounts[device] = (deviceCounts[device] || 0) + 1;
    });
    return Object.entries(deviceCounts).map(([device, count]) => ({ device, count }));
  };

  const getHourlyScans = () => {
    const hourCounts: Record<number, number> = {};
    scanData.forEach(scan => {
      const hour = new Date(scan.scan_timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    return Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour}:00`,
      scans: hourCounts[hour] || 0
    }));
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#ffbb28'];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Real-time Indicator */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Real-Time Analytics Dashboard</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={loadDashboardData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total QR Codes</p>
                <p className="text-3xl font-bold">{stats.totalQRCodes}</p>
              </div>
              <QrCode className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Total Scans</p>
                <p className="text-3xl font-bold">{stats.totalScans.toLocaleString()}</p>
              </div>
              <Eye className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Unique Scans</p>
                <p className="text-3xl font-bold">{stats.uniqueScans.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Avg Scans/QR</p>
                <p className="text-3xl font-bold">{stats.avgScansPerQR}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Scan Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Hourly Scan Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={getHourlyScans()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="scans" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Geographic Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getLocationBreakdown()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="location" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tag Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Campaign Tag Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getTagBreakdown()}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {getTagBreakdown().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {getTagBreakdown().map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* First-time vs Repeat Scans */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              First-time vs Repeat Scans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getFirstTimeVsRepeatScans()}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {getFirstTimeVsRepeatScans().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {getFirstTimeVsRepeatScans().map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lead Source Attribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Lead Source Attribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getLeadSourceBreakdown().map((source, index) => (
              <div key={source.source} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="font-medium">{source.source}</span>
                </div>
                <Badge variant="secondary">{source.count} scans</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Device Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Device Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {getDeviceBreakdown().map((device) => (
              <div key={device.device} className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="mb-4">
                  {device.device === 'mobile' && <Smartphone className="w-8 h-8 mx-auto text-blue-600" />}
                  {device.device === 'desktop' && <Monitor className="w-8 h-8 mx-auto text-green-600" />}
                  {device.device === 'tablet' && <Tablet className="w-8 h-8 mx-auto text-purple-600" />}
                  {!['mobile', 'desktop', 'tablet'].includes(device.device) && <Globe className="w-8 h-8 mx-auto text-gray-600" />}
                </div>
                <div className="text-2xl font-bold text-gray-900">{device.count}</div>
                <div className="text-sm text-gray-600 capitalize">{device.device}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Scan Activity
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm">Live</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {scanData.slice(0, 10).map((scan) => (
              <div key={scan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <QrCode className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">QR Code Scanned</p>
                    <p className="text-xs text-gray-500">
                      {scan.location_data?.country || 'Unknown location'} • 
                      {scan.device_info?.type || 'Unknown device'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">
                    {new Date(scan.scan_timestamp).toLocaleTimeString()}
                  </div>
                  {scan.is_first_time_scan && (
                    <Badge variant="secondary" className="text-xs">New User</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
