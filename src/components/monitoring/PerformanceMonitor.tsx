
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Zap, 
  Database, 
  Globe, 
  Server,
  AlertTriangle,
  TrendingUp,
  Clock
} from 'lucide-react';

export const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    pageLoad: 1.2,
    apiResponse: 0.85,
    dbQuery: 0.15,
    memoryUsage: 67,
    cpuUsage: 34,
    errorRate: 0.2,
    uptime: 99.9
  });

  const [realTimeData, setRealTimeData] = useState([]);

  useEffect(() => {
    // Simulate real-time performance data
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        pageLoad: Math.max(0.5, Math.min(3.0, prev.pageLoad + (Math.random() - 0.5) * 0.2)),
        apiResponse: Math.max(0.1, Math.min(2.0, prev.apiResponse + (Math.random() - 0.5) * 0.1)),
        memoryUsage: Math.max(30, Math.min(90, prev.memoryUsage + (Math.random() - 0.5) * 5)),
        cpuUsage: Math.max(10, Math.min(80, prev.cpuUsage + (Math.random() - 0.5) * 10))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'text-green-600';
    if (value <= thresholds.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'default';
    if (value <= thresholds.warning) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Performance Monitor</h1>
          <p className="text-gray-600">Real-time application performance metrics</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Live Monitoring
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Load Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(metrics.pageLoad, { good: 1.5, warning: 2.5 })}`}>
              {metrics.pageLoad.toFixed(2)}s
            </div>
            <Badge variant={getStatusBadge(metrics.pageLoad, { good: 1.5, warning: 2.5 })} className="mt-2">
              {metrics.pageLoad <= 1.5 ? 'Excellent' : metrics.pageLoad <= 2.5 ? 'Good' : 'Needs Attention'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Response</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(metrics.apiResponse, { good: 0.5, warning: 1.0 })}`}>
              {metrics.apiResponse.toFixed(2)}s
            </div>
            <Badge variant={getStatusBadge(metrics.apiResponse, { good: 0.5, warning: 1.0 })} className="mt-2">
              {metrics.apiResponse <= 0.5 ? 'Fast' : metrics.apiResponse <= 1.0 ? 'Normal' : 'Slow'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(metrics.memoryUsage, { good: 60, warning: 80 })}`}>
              {metrics.memoryUsage.toFixed(0)}%
            </div>
            <Progress value={metrics.memoryUsage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {metrics.uptime.toFixed(1)}%
            </div>
            <Badge variant="default" className="mt-2">
              Excellent
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Performance Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Database Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Query Response Time</span>
              <span className="text-sm text-green-600">{metrics.dbQuery.toFixed(2)}s</span>
            </div>
            <Progress value={25} className="h-2" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Connection Pool</span>
              <span className="text-sm text-green-600">8/20 active</span>
            </div>
            <Progress value={40} className="h-2" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Cache Hit Rate</span>
              <span className="text-sm text-green-600">94.2%</span>
            </div>
            <Progress value={94} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Web Vitals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">First Contentful Paint</span>
              <Badge variant="default">0.8s</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Largest Contentful Paint</span>
              <Badge variant="default">1.2s</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Cumulative Layout Shift</span>
              <Badge variant="default">0.05</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">First Input Delay</span>
              <Badge variant="default">12ms</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Issues */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Performance Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <div className="font-medium text-yellow-800">Memory usage trending upward</div>
                <div className="text-sm text-yellow-600">Consider optimization for QR generation processes</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <Activity className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium text-green-800">All systems operational</div>
                <div className="text-sm text-green-600">Performance within optimal ranges</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
