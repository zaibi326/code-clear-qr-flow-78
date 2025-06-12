
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MapPin, Clock, Users, TrendingUp, Tag, Download, Eye, RefreshCw } from 'lucide-react';
import { enhancedQRService } from '@/utils/enhancedQRService';
import { useAuth } from '@/hooks/useSupabaseAuth';

export function EnhancedScanAnalytics() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user, timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await enhancedQRService.getScanAnalytics(user!.id, timeRange);
      setAnalytics(data || []);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLocationBreakdown = () => {
    const locationCounts: Record<string, number> = {};
    analytics.forEach(scan => {
      const country = scan.location_data?.country || 'Unknown';
      locationCounts[country] = (locationCounts[country] || 0) + 1;
    });
    return Object.entries(locationCounts).map(([location, count]) => ({ location, count }));
  };

  const getDeviceBreakdown = () => {
    const deviceCounts: Record<string, number> = {};
    analytics.forEach(scan => {
      const device = scan.device_info?.type || 'Unknown';
      deviceCounts[device] = (deviceCounts[device] || 0) + 1;
    });
    return Object.entries(deviceCounts).map(([device, count]) => ({ device, count }));
  };

  const getLeadSourceBreakdown = () => {
    const sourceCounts: Record<string, number> = {};
    analytics.forEach(scan => {
      const source = scan.lead_source || 'Direct';
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });
    return Object.entries(sourceCounts).map(([source, count]) => ({ source, count }));
  };

  const firstTimeScans = analytics.filter(scan => scan.is_first_time_scan).length;
  const repeatScans = analytics.length - firstTimeScans;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Enhanced Scan Analytics
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={loadAnalytics}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{analytics.length}</div>
              <div className="text-sm text-gray-600">Total Scans</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{firstTimeScans}</div>
              <div className="text-sm text-gray-600">First-time Scans</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{repeatScans}</div>
              <div className="text-sm text-gray-600">Repeat Scans</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((firstTimeScans / analytics.length) * 100) || 0}%
              </div>
              <div className="text-sm text-gray-600">Conversion Rate</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Location Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="w-5 h-5" />
                  Scan Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={getLocationBreakdown().slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="location" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Device Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5" />
                  Device Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={getDeviceBreakdown()}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {getDeviceBreakdown().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Lead Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Tag className="w-5 h-5" />
                  Lead Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getLeadSourceBreakdown().map((source, index) => (
                    <div key={source.source} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{source.source}</span>
                      <Badge variant="secondary">{source.count} scans</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Scans */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {analytics.slice(0, 10).map((scan) => (
                    <div key={scan.id} className="flex items-center justify-between p-2 border-b">
                      <div>
                        <div className="font-medium text-sm">{scan.qr_codes?.name || 'Unnamed QR'}</div>
                        <div className="text-xs text-gray-500">
                          {scan.location_data?.country || 'Unknown'} • {scan.device_info?.type || 'Unknown device'}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(scan.scan_timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
